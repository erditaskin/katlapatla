import React from "react";
import { Modal, Pressable, ScrollView, Switch, View } from "react-native";
import { useSave } from "../state/store";
import { buy, type Settings } from "../state/model";
import { Button, Icon, IconButton, Label, Panel, row } from "./components";
import { LifeTimer } from "./Header";
export function Popup({
  title,
  close,
  children,
}: {
  title: string;
  close?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal transparent visible animationType="fade" onRequestClose={close}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#000b",
          justifyContent: "center",
          padding: 22,
        }}
      >
        <Panel style={{ padding: 22, maxHeight: "90%", gap: 14 }}>
          <View style={row}>
            <Label title size={22} style={{ flex: 1, textAlign: "center" }}>
              {title}
            </Label>
            {close && <IconButton name="close" label="Kapat" onPress={close} />}
          </View>
          <ScrollView contentContainerStyle={{ gap: 14 }} bounces={false}>
            {children}
          </ScrollView>
        </Panel>
      </View>
    </Modal>
  );
}
export function CommonDialog({
  kind,
  close,
  info,
}: {
  kind: "settings" | "lives" | "unavailable" | null;
  close: () => void;
  info?: string;
}) {
  const { save, update } = useSave();
  const [notice, setNotice] = React.useState("");
  if (!kind) return null;
  if (kind === "settings")
    return (
      <Popup title="AYARLAR" close={close}>
        {(
          [
            ["music", "Müzik"],
            ["sound", "Ses efektleri"],
            ["haptics", "Titreşim"],
            ["reducedMotion", "Azaltılmış hareket"],
          ] as [keyof Settings, string][]
        ).map(([key, label]) => (
          <View key={key} style={row}>
            <Label>{label}</Label>
            <Switch
              accessibilityLabel={label}
              value={save.settings[key]}
              trackColor={{ true: "#007e83", false: "#39352b" }}
              thumbColor="#e3be70"
              onValueChange={(value) => {
                update((s) => ({
                  ...s,
                  settings: { ...s.settings, [key]: value },
                }));
              }}
            />
          </View>
        ))}
        <Label size={14}>Katla Patla · 1.0.0</Label>
        <Label size={14}>
          İlerleme bu cihazda saklanır. Henüz reklam veya satın alma sağlayıcısı
          bağlı değildir.
        </Label>
        <Button label="Tamam" onPress={close} />
      </Popup>
    );
  if (kind === "unavailable")
    return (
      <Popup title="ŞİMDİLİK HAZIR DEĞİL" close={close}>
        <Label style={{ textAlign: "center" }}>
          {info ??
            "Reklam ve satın alma hizmetleri henüz bağlı değil. Altın veya can harcanmadı."}
        </Label>
        <Button label="Oyuna dön" onPress={close} />
      </Popup>
    );
  return (
    <Popup title={save.lives ? "CANLAR" : "CANLARIN TÜKENDİ"} close={close}>
      <View style={{ alignItems: "center", gap: 10 }}>
        <Icon name="lotus" size={70} />
        <Label size={32}>{save.lives}/5</Label>
        <LifeTimer />
      </View>
      <Button
        label="300 altın · Doldur"
        icon="coin"
        disabled={save.lives === 5 || save.gold < 300}
        onPress={() => {
          update((s) => buy(s, "lives", Date.now()));
          setNotice("Canların doldu.");
        }}
      />
      <Button
        label="Reklam şu an hazır değil"
        icon="video"
        disabled
        onPress={() => {}}
      />
      {notice && <Label size={16}>{notice}</Label>}
    </Popup>
  );
}
export function TextLink({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={{ minHeight: 44, justifyContent: "center", alignItems: "center" }}
    >
      <Label size={17}>{label}</Label>
    </Pressable>
  );
}
