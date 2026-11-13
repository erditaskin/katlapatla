import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { useSave } from "../state/store";
import { LIFE_MS } from "../state/model";
import { Icon, IconButton, Label, Panel, row } from "./components";
export function Header({
  onBack,
  onSettings,
  onLives,
}: {
  onBack: () => void;
  onSettings: () => void;
  onLives: () => void;
}) {
  const { save } = useSave();
  return (
    <View style={[row, { paddingHorizontal: 12, gap: 6, height: 55 }]}>
      <IconButton name="back" label="Geri" onPress={onBack} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Can ${save.lives}/5, can al`}
        onPress={onLives}
        style={{ flex: 1, minHeight: 44, justifyContent: "center" }}
      >
        <Panel style={{ paddingVertical: 7, paddingHorizontal: 8 }}>
          <View style={row}>
            <Icon name="lotus" size={29} />
            <Label size={20}>{save.lives}/5</Label>
            <Icon name="plus" size={15} />
          </View>
        </Panel>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Altın ${save.gold}, mağaza`}
        onPress={() => router.push("/store")}
        style={{ flex: 1.15, minHeight: 44, justifyContent: "center" }}
      >
        <Panel style={{ paddingVertical: 9, paddingHorizontal: 8 }}>
          <View style={row}>
            <Icon name="coin" size={24} />
            <Label size={19}>{save.gold.toLocaleString("tr-TR")}</Label>
            <Icon name="plus" size={15} />
          </View>
        </Panel>
      </Pressable>
      <IconButton name="settings" label="Ayarlar" onPress={onSettings} />
    </View>
  );
}

export function LifeTimer() {
  const { save } = useSave();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const seconds = Math.max(0, Math.ceil((save.lifeAt + LIFE_MS - now) / 1000));
  return (
    <Label size={16}>
      {save.lives === 5
        ? "Canların dolu"
        : `Sonraki can ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`}
    </Label>
  );
}
