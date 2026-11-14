/* eslint-disable react-hooks/immutability -- Expo Audio players are imperative native handles; their documented setters do not mutate React state. */
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useSave } from "../state/store";
import type { impactForWave } from "./impact";
export function useWaterAudio() {
  const { save } = useSave();
  const pop = useAudioPlayer(require("../../assets/audio/pop.wav"));
  const pop2 = useAudioPlayer(require("../../assets/audio/pop-2.wav"));
  const pop3 = useAudioPlayer(require("../../assets/audio/pop-3.wav"));
  const cascade = useAudioPlayer(require("../../assets/audio/cascade.wav"));
  const burst = useAudioPlayer(require("../../assets/audio/burst.wav"));
  const invalid = useAudioPlayer(require("../../assets/audio/invalid.wav"));
  const music = useAudioPlayer(require("../../assets/audio/temple.wav"));
  const voices = useRef<(typeof pop)[]>([]);
  const sequence = useRef(0);
  const variant = useRef(0);
  const active = useRef(true);
  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: false,
      shouldPlayInBackground: false,
    }).catch(() => {});
  }, []);
  useEffect(() => {
    music.loop = true;
    music.volume = 0.16;
    if (save.settings.music) music.play();
    else music.pause();
    const sub = AppState.addEventListener("change", (s) => {
      active.current = s === "active";
      if (s === "active" && save.settings.music) music.play();
      else {
        music.pause();
        sequence.current++;
        voices.current.forEach((p) => p.pause());
        voices.current = [];
      }
    });
    return () => sub.remove();
  }, [music, save.settings.music]);
  useEffect(() => {
    if (!save.settings.sound) {
      sequence.current++;
      voices.current.forEach((p) => p.pause());
      voices.current = [];
    }
  }, [save.settings.sound]);
  return (
    combo: number,
    tier: ReturnType<typeof impactForWave>["tier"] = "small",
  ) => {
    if (save.settings.sound && active.current) {
      const player =
        combo === 0
          ? invalid
          : tier === "large"
            ? burst
            : tier === "medium"
              ? cascade
              : [pop, pop2, pop3][variant.current++ % 3]!;
      const token = ++sequence.current;
      player.pause();
      voices.current = voices.current.filter((p) => p.id !== player.id);
      while (voices.current.length >= 2) voices.current.shift()!.pause();
      voices.current.push(player);
      player.volume =
        combo === 0
          ? 0.22
          : tier === "large"
            ? 0.72
            : tier === "medium"
              ? 0.62
              : 0.56;
      player.shouldCorrectPitch = false;
      player.setPlaybackRate(
        Math.min(1.18, 1 + Math.max(0, combo - 1) * 0.025),
      );
      void player
        .seekTo(0)
        .then(() => {
          if (sequence.current === token && active.current) player.play();
        })
        .catch(() => {});
    }
    if (save.settings.haptics && combo > 0 && active.current)
      void Haptics.impactAsync(
        tier === "large"
          ? Haptics.ImpactFeedbackStyle.Heavy
          : tier === "medium"
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Light,
      ).catch(() => {});
  };
}
