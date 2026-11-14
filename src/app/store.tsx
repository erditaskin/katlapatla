import { useState } from "react";
import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { useSave } from "../state/store";
import { buy, type Helper } from "../state/model";
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
import { CommonDialog } from "../ui/Dialogs";
export default function StoreScreen() {
  const { save, update } = useSave();
  const [dialog, setDialog] = useState<
    "settings" | "lives" | "unavailable" | null
  >(null);
  return (
    <Screen>
      <Header
        onBack={() => router.back()}
        onSettings={() => setDialog("settings")}
        onLives={() => setDialog("lives")}
      />
      <Brand compact />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 20,
          gap: 14,
        }}
      >
        <Label title size={27} style={{ textAlign: "center" }}>
          MAĞAZA
        </Label>
        <Panel>
          <View style={row}>
            <Icon name="lotus" size={62} />
            <View style={{ flex: 1 }}>
              <Label size={22}>Canları Doldur</Label>
              <Label size={14}>
                {save.lives === 5 ? "Canların dolu" : "Canlarını 5/5 tamamla."}
              </Label>
            </View>
          </View>
          <Button
            label="300 altın"
            icon="coin"
            disabled={save.lives === 5 || save.gold < 300}
            onPress={() => update((s) => buy(s, "lives", Date.now()))}
          />
        </Panel>
        <Label title size={20} style={{ textAlign: "center" }}>
          Yardımcılar
        </Label>
        <View style={[row, { gap: 6 }]}>
          {(
            [
              ["needle", "İğne", 100, "needle"],
              ["shuffle", "Karıştır", 150, "shuffle"],
              ["heart", "Kalp", 200, "horizontal"],
            ] as const
          ).map(([key, label, price, icon]) => (
            <Panel
              key={key}
              style={{ flex: 1, padding: 6, alignItems: "center", gap: 6 }}
            >
              <Label size={16}>{label}</Label>
              <Icon name={icon} size={52} />
              <Label size={13}>Stok: {save.helpers[key]}</Label>
              <Button
                label={String(price)}
                small
                disabled={save.gold < price}
                onPress={() => update((s) => buy(s, key as Helper, Date.now()))}
              />
            </Panel>
          ))}
        </View>
        <Panel>
          <Label size={21}>Reklam izle</Label>
          <Label size={14} style={{ marginVertical: 5 }}>
            İsteğe bağlı · 1 can
          </Label>
          <Button
            label="Şu an hazır değil"
            icon="video"
            disabled
            onPress={() => {}}
          />
        </Panel>
        <Label title size={20} style={{ textAlign: "center" }}>
          Altın Paketleri
        </Label>
        <View style={[row, { gap: 10 }]}>
          {[1000, 2500].map((amount) => (
            <Panel
              key={amount}
              style={{ flex: 1, alignItems: "center", gap: 8 }}
            >
              <Icon name="coin" size={55} />
              <Label size={22}>{amount.toLocaleString("tr-TR")} Altın</Label>
              <Button
                label="Yakında"
                small
                kind="secondary"
                onPress={() => setDialog("unavailable")}
              />
            </Panel>
          ))}
        </View>
        <Label size={13} style={{ textAlign: "center" }}>
          Bu sürümde gerçek para alınmaz. Reklam ve ödeme hizmetleri henüz bağlı
          değildir.
        </Label>
      </ScrollView>
      <View style={{ paddingHorizontal: 20 }}>
        <Button
          label="Haritaya dön"
          icon="map"
          onPress={() => router.replace("/")}
        />
      </View>
      <CommonDialog kind={dialog} close={() => setDialog(null)} />
    </Screen>
  );
}
