import { useEffect, useRef, useState } from "react";
import { Animated, AppState, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSave } from "../state/store";
import {
  abandon,
  continueGame,
  settle,
  startLevel,
  type Helper,
} from "../state/model";
import {
  addHeart,
  adjacent,
  move,
  needle,
  shuffleGame,
  type Board as BoardData,
  type Outcome,
  type Goal,
} from "../game/engine";
import { Board } from "../ui/Board";
import {
  Brand,
  Button,
  Icon,
  Label,
  Panel,
  Screen,
  row,
} from "../ui/components";
import { Header } from "../ui/Header";
import { CommonDialog, Popup, TextLink } from "../ui/Dialogs";
import { MotionPressable, useFeedback } from "../ui/Feedback";
import type { CoachTopic } from "../ui/coachRules";
import { Coach, type HelperUsage } from "../ui/Coach";
import { Celebration } from "../ui/Celebration";
import { celebrationForWave, impactForWave } from "../ui/impact";
import { ScoreMeter } from "../ui/ScoreMeter";
import { levels } from "../game/levels";
import { useWaterAudio } from "../ui/audio";
export default function GameScreen() {
  const { save, update } = useSave();
  const game = save.game;
  const { width, height } = useWindowDimensions();
  const safe = useSafeAreaInsets();
  const sound = useWaterAudio();
  const { reducedMotion } = useFeedback();
  const [shake] = useState(() => new Animated.ValueXY({ x: 0, y: 0 }));
  const [effectId, setEffectId] = useState(0);
  const [presentation, setPresentation] = useState<{
    score: number;
    goals: Goal[];
  } | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [display, setDisplay] = useState<BoardData | null>(null);
  const [popping, setPopping] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const sequence = useRef(0);
  const [highlighted, setHighlighted] = useState<CoachTopic | null>(null);
  const [usedHelpers, setUsedHelpers] = useState<HelperUsage>({});
  const [celebration, setCelebration] = useState<{
    title: string;
    combo: number;
    points: number;
    id: string;
  } | null>(null);
  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(() => setCelebration(null), 750);
    return () => clearTimeout(timer);
  }, [celebration]);
  const alive = useRef(true);
  const [dialog, setDialog] = useState<
    "pause" | "exit" | "tutorial" | "settings" | "lives" | "unavailable" | null
  >(!save.tutorial ? "tutorial" : null);
  const [helper, setHelper] = useState<Helper | null>(null);
  const [tool, setTool] = useState<Helper | null>(null);
  const [hint, setHint] = useState("");
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  useEffect(() => {
    const s = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        sequence.current++;
        busyRef.current = false;
        setSelected(null);
        setBusy(false);
        setDisplay(null);
        setPopping([]);
        setCelebration(null);
        setPresentation(null);
      }
    });
    return () => s.remove();
  }, []);
  useEffect(() => {
    if (reducedMotion) {
      shake.stopAnimation();
      shake.setValue({ x: 0, y: 0 });
    }
    return () => shake.stopAnimation();
  }, [shake, reducedMotion]);
  const pause = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
  const impact = (amplitude: number) => {
    shake.stopAnimation();
    shake.setValue({ x: 0, y: 0 });
    if (reducedMotion) return;
    Animated.sequence(
      [1, -0.8, 0.6, -0.45, 0.28, -0.12, 0].map((n, i) =>
        Animated.timing(shake, {
          toValue: {
            x: n * amplitude,
            y: (i % 2 ? -0.45 : 0.45) * Math.abs(n) * amplitude,
          },
          duration: i === 0 ? 30 : 46,
          useNativeDriver: true,
        }),
      ),
    ).start();
  };
  const show = async (out: Outcome, used?: Helper) => {
    if (!game) return;
    let displayedScore = game.score;
    let displayedGoals = game.goals.map((g) => ({ ...g }));
    if (!out.valid) {
      sound(0);
      setSelected(null);
      return;
    }
    const token = ++sequence.current;
    setPresentation({ score: displayedScore, goals: displayedGoals });
    busyRef.current = true;
    setBusy(true);
    setSelected(null);
    setHelper(null);
    setTool(null);
    setDisplay(out.waves[0]?.board ?? out.game.board);
    try {
      // Persist the settled outcome before decoration. Suspension cannot replay a reward.
      update((s) => {
        if (s.game?.id !== out.game.id) return s;
        const next = used
          ? {
              ...s,
              helpers: {
                ...s.helpers,
                [used]: Math.max(0, s.helpers[used] - 1),
              },
            }
          : s;
        return settle(next, out.game, Date.now());
      });
      if (used) setUsedHelpers((v) => ({ ...v, [used]: true }));
      if (!used) await pause(reducedMotion ? 0 : 155);
      for (let i = 0; i < out.waves.length; i++) {
        if (!alive.current || token !== sequence.current) break;
        const wave = out.waves[i]!;
        const profile = impactForWave(
          wave.removed.length,
          wave.combo,
          wave.removed.some((n) => !!wave.board[n]!.power),
        );
        const points = wave.removed.length * 60 * Math.min(wave.combo, 8);
        const title = celebrationForWave(
          wave.removed.length,
          wave.combo,
          profile.tier === "large",
          points,
        );
        if (title)
          setCelebration({
            title,
            combo: wave.combo,
            points,
            id: `${out.game.id}:${out.game.moves}:${i}`,
          });
        displayedScore += points;
        displayedGoals = displayedGoals.map((g) => ({
          ...g,
          count: Math.max(
            0,
            g.count - wave.colors.filter((c) => c === g.color).length,
          ),
        }));
        setPresentation({ score: displayedScore, goals: displayedGoals });
        setDisplay(wave.board);
        setPopping(wave.removed);
        setEffectId((v) => v + 1);
        sound(wave.combo, profile.tier);
        impact(profile.amplitude);
        await pause(reducedMotion ? 65 : profile.popMs);
        if (!alive.current || token !== sequence.current) break;
        setPopping([]);
        setDisplay(out.waves[i + 1]?.board ?? out.game.board);
        await pause(reducedMotion ? 0 : profile.fallMs);
      }
    } catch (error) {
      console.warn("Board presentation interrupted", error);
    } finally {
      if (alive.current && token === sequence.current) {
        setDisplay(null);
        setPopping([]);
        setBusy(false);
        setPresentation(null);
      }
      if (token === sequence.current) busyRef.current = false;
    }
  };
  const swap = async (a: number, b: number) => {
    if (!game || busyRef.current || dialog || helper || tool) return;
    const out = move(game, a, b);
    if (out.valid) {
      void show(out);
      return;
    }
    if (!adjacent(a, b)) return;
    const token = ++sequence.current;
    busyRef.current = true;
    setBusy(true);
    setSelected(null);
    const preview = [...game.board];
    [preview[a], preview[b]] = [preview[b]!, preview[a]!];
    setDisplay(preview);
    sound(0);
    await pause(reducedMotion ? 0 : 150);
    if (alive.current && token === sequence.current) setDisplay(game.board);
    await pause(reducedMotion ? 0 : 180);
    if (alive.current && token === sequence.current) {
      setDisplay(null);
      setBusy(false);
    }
    if (token === sequence.current) busyRef.current = false;
  };
  const tap = (i: number) => {
    if (!game || busyRef.current) return;
    if (tool === "needle") {
      void show(needle(game, i), "needle");
      return;
    }
    if (tool === "heart") {
      const next = addHeart(game, i);
      if (next !== game) {
        setUsedHelpers((v) => ({ ...v, heart: true }));
        update((s) => ({
          ...s,
          game: next,
          helpers: { ...s.helpers, heart: s.helpers.heart - 1 },
        }));
        setHelper(null);
        setTool(null);
      }
      return;
    }
    if (selected === null) setSelected(i);
    else if (selected === i) setSelected(null);
    else {
      const a = selected;
      setSelected(null);
      if (adjacent(a, i)) swap(a, i);
      else setSelected(i);
    }
  };
  if (!game)
    return (
      <Screen shake={shake}>
        <Brand />
        <Label style={{ textAlign: "center", marginTop: 100 }}>
          Kayıtlı bölüm yok.
        </Label>
        <Button label="Haritaya dön" onPress={() => router.replace("/")} />
      </Screen>
    );
  const finish = () =>
    update((s) =>
      s.game ? settle(s, { ...s.game, phase: "lost" }, Date.now()) : s,
    );
  const returnMap = () => {
    update((s) => ({ ...s, game: null }));
    router.replace("/");
  };
  const leave = () => {
    update((s) => abandon(s, Date.now()));
    router.replace("/");
  };
  const retry = () => {
    const next = update((s) => startLevel(s, game.level, Date.now()));
    if (next.game?.id === game.id) setDialog("lives");
    else {
      setDialog(null);
      setSelected(null);
      setHint("");
    }
  };
  const boardWidth = Math.min(width - 24, 500);
  const boardHeight = Math.min(
    boardWidth * 1.15,
    height - safe.top - Math.max(safe.bottom, 8) - 352,
  );
  const paused = dialog !== null || helper !== null || hint !== "";
  const shownGoals = presentation?.goals ?? game.goals;
  const shownScore = presentation?.score ?? game.score;
  return (
    <Screen shake={shake}>
      <Header
        onBack={() => setDialog("pause")}
        onSettings={() => setDialog("settings")}
        onLives={() => setDialog("lives")}
        highlighted={
          highlighted === "lives" || highlighted === "gold" ? highlighted : null
        }
      />
      <Brand />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-evenly",
          paddingBottom: 4,
          gap: 5,
        }}
      >
        <Panel style={{ width: boardWidth + 4, paddingVertical: 8 }}>
          <View style={row}>
            <Label size={19}>Bölüm {game.level}</Label>
            <View style={{ flexDirection: "row", gap: 9 }}>
              {shownGoals.map((g) => (
                <View
                  key={g.color}
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Icon name={g.color} size={36} />
                  <Label size={21}>{g.count === 0 ? "✓" : g.count}</Label>
                </View>
              ))}
            </View>
            <View style={{ alignItems: "center" }}>
              <Label size={30} style={{ lineHeight: 32 }}>
                {game.moves}
              </Label>
              <Label size={11}>HAMLE</Label>
            </View>
          </View>
        </Panel>
        <View>
          <Board
            board={display ?? game.board}
            width={boardWidth}
            height={boardHeight}
            selected={selected}
            popping={popping}
            reducedMotion={reducedMotion}
            effectId={effectId}
            key={game.id}
            onTap={tap}
            onSwap={swap}
            disabled={busy || paused || game.phase !== "playing"}
          />
          {celebration && (
            <Celebration
              key={celebration.id}
              title={celebration.title}
              combo={celebration.combo}
              points={celebration.points}
            />
          )}
          {busy && (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                bottom: 6,
                left: 0,
                right: 0,
                alignItems: "center",
              }}
            >
              <Label
                size={12}
                style={{
                  backgroundColor: "#0c100ee8",
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 8,
                }}
              >
                Balonlar yerleşiyor…
              </Label>
            </View>
          )}
        </View>
        <ScoreMeter
          score={shownScore}
          initial={levels[game.level - 1]!.goals.reduce(
            (n, g) => n + g.count,
            0,
          )}
          remaining={shownGoals.reduce((n, g) => n + g.count, 0)}
          width={boardWidth + 4}
        />
        <View style={[row, { width: boardWidth, gap: 8 }]}>
          {(
            [
              ["needle", "İğne", "needle"],
              ["shuffle", "Karıştır", "shuffle"],
              ["heart", "Kalp", "horizontal"],
            ] as const
          ).map(([key, label, icon]) => (
            <MotionPressable
              key={key}
              wrapperStyle={{ flex: 1 }}
              accessibilityRole="button"
              accessibilityLabel={`${label}, ${save.helpers[key]} adet`}
              testID={`helper-${key}`}
              highlighted={highlighted === key}
              disabled={busy || paused || game.phase !== "playing"}
              onPress={() => {
                if (save.helpers[key] < 1) {
                  setHint(
                    "Bu yardımcı kalmadı. Mağazadan altınla alabilirsin.",
                  );
                  return;
                }
                setHelper(key);
              }}
            >
              <View pointerEvents="none">
                <Panel style={{ padding: 6, alignItems: "center" }}>
                  <View style={{ position: "absolute", right: 9, top: 4 }}>
                    <Label size={16}>{save.helpers[key]}</Label>
                  </View>
                  <Icon name={icon} size={45} />
                  <View style={{ minHeight: 44, justifyContent: "center" }}>
                    <Label size={18}>{label}</Label>
                  </View>
                </Panel>
              </View>
            </MotionPressable>
          ))}
        </View>
      </View>
      <Coach
        blocked={busy || paused || game.phase !== "playing" || tool !== null}
        used={usedHelpers}
        onTopic={setHighlighted}
      />
      {hint !== "" && (
        <Popup title="YARDIMCILAR" close={() => setHint("")}>
          <Label>{hint}</Label>
          <Button label="Tamam" onPress={() => setHint("")} />
        </Popup>
      )}
      {helper && (
        <Popup title="YARDIMCI KULLAN" close={() => setHelper(null)}>
          <View style={{ alignItems: "center" }}>
            <Icon name={helper === "heart" ? "horizontal" : helper} size={90} />
          </View>
          <Label style={{ textAlign: "center" }}>
            {helper === "shuffle"
              ? "Balonların yerini değiştir. Hamle harcamaz."
              : helper === "heart"
                ? "Bir normal balonu kalbe dönüştür. Hamle harcamaz."
                : "Bir balonu patlat. Hamle harcamaz."}
          </Label>
          <Button
            label="Kullan"
            onPress={() => {
              if (helper === "shuffle") {
                setUsedHelpers((v) => ({ ...v, shuffle: true }));
                const next = shuffleGame(game);
                if (next !== game)
                  update((s) => ({
                    ...s,
                    game: next,
                    helpers: { ...s.helpers, shuffle: s.helpers.shuffle - 1 },
                  }));
                setHelper(null);
              } else {
                setHint(
                  helper === "needle"
                    ? "Patlatmak istediğin balona dokun."
                    : "Kalbe dönüştürmek istediğin balona dokun.",
                );
                setDialog(null);
                setHelper(null);
                setSelected(null);
                setTool(helper);
              }
            }}
          />
          <TextLink label="Vazgeç" onPress={() => setHelper(null)} />
        </Popup>
      )}
      {dialog === "tutorial" && (
        <Popup title="KAYDIR VE EŞLEŞTİR">
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Icon name="sun" size={58} />
            <Icon name="sun" size={58} />
            <Icon name="sun" size={58} />
          </View>
          <Label style={{ textAlign: "center" }}>
            Komşu iki balonu kaydır. Aynı renkten en az 3 balonu bir araya
            getir.
          </Label>
          <Label size={15} style={{ textAlign: "center" }}>
            4’lü kalp, düz 5’li hediye üretir. Hedefleri hamlelerin bitmeden
            tamamla.
          </Label>
          <Button
            label="Anladım"
            onPress={() => {
              update((s) => ({ ...s, tutorial: true }));
              setDialog(null);
            }}
          />
        </Popup>
      )}
      {dialog === "pause" && (
        <Popup title="DURAKLATILDI" close={() => setDialog(null)}>
          <Button label="Devam et" onPress={() => setDialog(null)} />
          <Button label="Ayarlar" onPress={() => setDialog("settings")} />
          <Button
            label="Haritaya dön"
            kind="secondary"
            onPress={() => setDialog("exit")}
          />
        </Popup>
      )}
      {dialog === "exit" && (
        <Popup title="BÖLÜMDEN ÇIKILSIN MI?" close={() => setDialog(null)}>
          <Label style={{ textAlign: "center" }}>
            Çıkarsan 1 can kaybedersin.
          </Label>
          <Button label="Oyuna dön" onPress={() => setDialog(null)} />
          <Button label="Çık" kind="secondary" onPress={leave} />
        </Popup>
      )}
      {!busy && !dialog && !helper && game.phase === "offer" && (
        <Popup title="HAMLE KALMADI">
          <Label style={{ textAlign: "center" }}>
            {game.continued
              ? "Ek hamle hakkın kullanıldı."
              : "Hedeflere ulaşmak için +5 hamle."}
          </Label>
          {!game.continued && (
            <>
              <Button
                label="200 altın · +5 hamle"
                icon="coin"
                disabled={save.gold < 200}
                onPress={() => update(continueGame)}
              />
              <Button
                label="Reklam hazır değil"
                icon="video"
                disabled
                onPress={() => {}}
              />
            </>
          )}
          <TextLink label="Vazgeç" onPress={finish} />
        </Popup>
      )}
      {!busy && !dialog && game.phase === "won" && (
        <Popup title="BÖLÜM TAMAMLANDI">
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            {Array.from(
              { length: save.stars[String(game.level)] ?? 1 },
              (_, i) => (
                <Icon name="star" size={60} key={i} />
              ),
            )}
          </View>
          <Label size={24} style={{ textAlign: "center" }}>
            Puan {game.score.toLocaleString("tr-TR")}
          </Label>
          <Label style={{ textAlign: "center" }}>
            Ödül altın bakiyene eklendi.
          </Label>
          <Button label="Devam" onPress={returnMap} />
          <TextLink label="Harita" onPress={returnMap} />
        </Popup>
      )}
      {!busy && !dialog && game.phase === "lost" && (
        <Popup title="BÖLÜM BİTTİ">
          <Label style={{ textAlign: "center" }}>Hedefler tamamlanamadı.</Label>
          <Label style={{ textAlign: "center" }}>1 can kullanıldı.</Label>
          <Button label="Tekrar oyna" onPress={retry} />
          <TextLink label="Harita" onPress={returnMap} />
        </Popup>
      )}
      <CommonDialog
        kind={
          dialog === "settings" ||
          dialog === "lives" ||
          dialog === "unavailable"
            ? dialog
            : null
        }
        close={() => setDialog(null)}
      />
    </Screen>
  );
}
