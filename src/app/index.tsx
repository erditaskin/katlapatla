import React, { useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { useSave } from "../state/store";
import { startLevel } from "../state/model";
import { levels } from "../game/levels";
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
import { CommonDialog, Popup } from "../ui/Dialogs";
import { MotionPressable } from "../ui/Feedback";
import { art } from "../ui/art";
export default function MapScreen() {
  const { save, update } = useSave();
  const [dialog, setDialog] = useState<"settings" | "lives" | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const { width } = useWindowDimensions();
  const stage = levels[(selected ?? save.unlocked) - 1]!;
  const launch = () => {
    const next = update((s) =>
      startLevel(s, selected ?? s.unlocked, Date.now()),
    );
    setSelected(null);
    if (next.game && !next.game.settled) router.push("/game");
    else setDialog("lives");
  };
  return (
    <Screen>
      <Header
        onBack={() =>
          save.game && !save.game.settled
            ? router.push("/game")
            : setSelected(save.unlocked)
        }
        onSettings={() => setDialog("settings")}
        onLives={() => setDialog("lives")}
      />
      <Brand compact />
      <View
        style={{
          flex: 1,
          marginHorizontal: 14,
          borderWidth: 1,
          borderColor: "#a88145",
          overflow: "hidden",
          borderRadius: 12,
        }}
      >
        <ImageBackground
          source={require("../../assets/art/nile.png")}
          style={{ flex: 1 }}
          resizeMode="cover"
        >
          <ScrollView
            ref={scroll}
            onContentSizeChange={() =>
              scroll.current?.scrollTo({
                y: Math.max(0, (50 - save.unlocked) * 86 - 200),
                animated: false,
              })
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ height: 4480 }}
          >
            {levels.map((l, i) => {
              const x = (width - 125) * (0.48 + 0.34 * Math.sin(i * 0.85));
              const y = 4300 - i * 86;
              const locked = l.id > save.unlocked;
              return (
                <MotionPressable
                  key={l.id}
                  testID={`level-${l.id}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Bölüm ${l.id}${locked ? ", kilitli" : ""}`}
                  accessibilityState={{ disabled: locked }}
                  disabled={locked}
                  onPress={() => setSelected(l.id)}
                  wrapperStyle={{
                    position: "absolute",
                    left: x,
                    top: y,
                    width: 72,
                    height: 72,
                    opacity: locked ? 0.65 : 1,
                  }}
                  style={{
                    width: 72,
                    height: 72,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={art.node}
                    style={{ position: "absolute", width: 80, height: 78 }}
                    resizeMode="contain"
                  />
                  {locked ? (
                    <>
                      <Label size={20}>{l.id}</Label>
                      <Icon name="lock" size={19} />
                    </>
                  ) : (
                    <>
                      <Label
                        size={27}
                        style={{
                          color: l.id === save.unlocked ? "#ffe1a0" : "#f4e6bc",
                        }}
                      >
                        {l.id}
                      </Label>
                      <View style={{ flexDirection: "row" }}>
                        {Array.from(
                          { length: save.stars[String(l.id)] ?? 0 },
                          (_, j) => (
                            <Icon key={j} name="star" size={14} />
                          ),
                        )}
                      </View>
                    </>
                  )}
                </MotionPressable>
              );
            })}
          </ScrollView>
        </ImageBackground>
      </View>
      <View style={{ paddingHorizontal: 16, paddingTop: 9, gap: 8 }}>
        <Panel>
          <View style={row}>
            <View>
              <Label title size={19}>
                Bölüm {save.unlocked}
              </Label>
              <Label size={13}>{levels[save.unlocked - 1]!.region}</Label>
            </View>
            <Button
              label={save.game && !save.game.settled ? "Devam" : "OYNA"}
              onPress={() => {
                if (save.game && !save.game.settled) router.push("/game");
                else setSelected(save.unlocked);
              }}
            />
          </View>
        </Panel>
        <View style={[row, { gap: 10 }]}>
          <View style={{ flex: 1 }}>
            <Button label="Harita" icon="map" small onPress={() => {}} />
          </View>
          <View style={{ flex: 1 }}>
            <Button
              label="Mağaza"
              icon="shop"
              kind="secondary"
              small
              onPress={() => router.push("/store")}
            />
          </View>
        </View>
      </View>
      {selected !== null && (
        <Popup title={`Bölüm ${selected}`} close={() => setSelected(null)}>
          <Label style={{ textAlign: "center" }}>{stage.region}</Label>
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            {stage.goals.map((g) => (
              <View key={g.color} style={{ alignItems: "center" }}>
                <Icon name={g.color} size={64} />
                <Label size={24}>{g.count}</Label>
              </View>
            ))}
          </View>
          <Label size={23} style={{ textAlign: "center" }}>
            {stage.moves} HAMLE
          </Label>
          <Label size={14} style={{ textAlign: "center" }}>
            Aynı renkten 3 balonu eşleştir.
          </Label>
          <Button label="OYNA" onPress={launch} />
        </Popup>
      )}
      <CommonDialog kind={dialog} close={() => setDialog(null)} />
    </Screen>
  );
}
