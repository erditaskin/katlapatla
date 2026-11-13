import React, { useEffect, useRef, useState } from "react";
import { AppState, View, useWindowDimensions } from "react-native";
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
  move,
  needle,
  shuffleGame,
  type Board as BoardData,
  type Outcome,
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
import { useWaterAudio } from "../ui/audio";
export default function GameScreen() {
  const { save, update } = useSave();
  const game = save.game;
  const { width, height } = useWindowDimensions();
  const safe = useSafeAreaInsets();
  const sound = useWaterAudio();
  const [selected, setSelected] = useState<number | null>(null);
  const [display, setDisplay] = useState<BoardData | null>(null);
  const [popping, setPopping] = useState<number[]>([]);
  const [combo, setCombo] = useState(0);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
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
      if (state !== "active") setSelected(null);
    });
    return () => s.remove();
  }, []);
  const show = async (out: Outcome, used?: Helper) => {
    if (!out.valid) {
      sound(0);
      setSelected(null);
      return;
    }
    busyRef.current = true;
    setBusy(true);
    setSelected(null);
    setHelper(null);
    setTool(null);
    // Persist the settled outcome before decoration. Suspension cannot replay a reward.
    update((s) => {
      if (s.game?.id !== out.game.id) return s;
      const next = used
        ? {
            ...s,
            helpers: { ...s.helpers, [used]: Math.max(0, s.helpers[used] - 1) },
          }
        : s;
      return settle(next, out.game, Date.now());
    });
    for (const wave of out.waves) {
      if (!alive.current) break;
      setDisplay(wave.board);
      setPopping(wave.removed);
      setCombo(wave.combo);
      sound(wave.combo, wave.removed.length > 7);
      await new Promise((r) =>
        setTimeout(r, save.settings.reducedMotion ? 50 : 220),
      );
    }
    if (alive.current) {
      setDisplay(null);
      setPopping([]);
      setCombo(0);
      setBusy(false);
    }
    busyRef.current = false;
  };
  const swap = (a: number, b: number) => {
    if (!game || busyRef.current || dialog || helper || tool) return;
    void show(move(game, a, b));
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
      if (Math.abs(a - i) === 1 || Math.abs(a - i) === 8) swap(a, i);
      else setSelected(i);
    }
  };
  if (!game)
    return (
      <Screen>
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
    height - safe.top - Math.max(safe.bottom, 8) - 344,
  );
  const paused = dialog !== null || helper !== null;
  return (
    <Screen>
      <Header
        onBack={() => setDialog("pause")}
        onSettings={() => setDialog("settings")}
        onLives={() => setDialog("lives")}
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
              {game.goals.map((g) => (
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
            reducedMotion={save.settings.reducedMotion}
            onTap={tap}
            onSwap={swap}
            disabled={busy || paused || game.phase !== "playing"}
          />
          {combo > 1 && (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: "40%",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Panel>
                <Label title size={29}>
                  ×{combo} KOMBO
                </Label>
              </Panel>
            </View>
          )}
        </View>
        <Panel style={{ width: boardWidth + 4, paddingVertical: 8 }}>
          <View style={row}>
            <Label size={19}>Puan {game.score.toLocaleString("tr-TR")}</Label>
            <View
              style={{
                width: "52%",
                height: 10,
                borderWidth: 1,
                borderColor: "#ab8546",
                backgroundColor: "#141713",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${Math.min(100, game.score / 120)}%`,
                  backgroundColor: "#06a4ad",
                }}
              />
            </View>
          </View>
        </Panel>
        <View style={[row, { width: boardWidth, gap: 8 }]}>
          {(
            [
              ["needle", "İğne", "needle"],
              ["shuffle", "Karıştır", "shuffle"],
              ["heart", "Kalp", "horizontal"],
            ] as const
          ).map(([key, label, icon]) => (
            <View key={key} style={{ flex: 1 }}>
              <Panel style={{ padding: 6, alignItems: "center" }}>
                <View style={{ position: "absolute", right: 9, top: 4 }}>
                  <Label size={16}>{save.helpers[key]}</Label>
                </View>
                <Icon name={icon} size={45} />
                <TextLink
                  label={label}
                  onPress={() => {
                    if (busy || game.phase !== "playing") return;
                    if (save.helpers[key] < 1) {
                      setHint(
                        "Bu yardımcı kalmadı. Mağazadan altınla alabilirsin.",
                      );
                      return;
                    }
                    setHelper(key);
                  }}
                />
              </Panel>
            </View>
          ))}
        </View>
      </View>
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
