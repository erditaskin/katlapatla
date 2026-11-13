import React from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SaveProvider, useSave } from "../state/store";
import { Button, Label, Screen } from "../ui/components";
function Routes() {
  const { ready, error, retry } = useSave();
  if (!ready)
    return (
      <Screen>
        <Label style={{ textAlign: "center", marginTop: 200 }}>
          {error ?? "Yükleniyor…"}
        </Label>
        {error && <Button label="Tekrar dene" onPress={retry} />}
      </Screen>
    );
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#191916" },
          animation: "fade",
          statusBarHidden: true,
        }}
      />
      {error && <Button label={error} onPress={retry} />}
    </>
  );
}
export default function Root() {
  const [loaded, error] = useFonts({
    Cinzel: require("../../assets/fonts/Cinzel.ttf"),
  });
  if (!loaded && !error) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar hidden />
      <SaveProvider>
        <Routes />
      </SaveProvider>
    </GestureHandlerRootView>
  );
}
