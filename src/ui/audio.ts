/* eslint-disable react-hooks/immutability -- Expo Audio players are imperative native handles; their documented setters do not mutate React state. */
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { AppState } from "react-native";
import { useSave } from "../state/store";
export function useWaterAudio() {
  const { save } = useSave();
  const pop = useAudioPlayer(require("../../assets/audio/pop.wav"));
  const cascade = useAudioPlayer(require("../../assets/audio/cascade.wav"));
  const burst = useAudioPlayer(require("../../assets/audio/burst.wav"));
  const invalid = useAudioPlayer(require("../../assets/audio/invalid.wav"));
  const music = useAudioPlayer(require("../../assets/audio/temple.wav"));
  useEffect(() => {
    void setAudioModeAsync({
      playsInSilentMode: false,
      shouldPlayInBackground: false,
    }).catch(() => {});
  }, []);
  useEffect(() => {
    music.loop = true;
    music.volume = 0.22;
    if (save.settings.music) music.play();
    else music.pause();
    const sub = AppState.addEventListener("change", (s) => {
      if (s === "active" && save.settings.music) music.play();
      else music.pause();
    });
    return () => sub.remove();
  }, [music, save.settings.music]);
  return (combo: number, large = false) => {
    if (save.settings.sound) {
      const player =
        combo === 0 ? invalid : large ? burst : combo > 1 ? cascade : pop;
      pop.pause();
      cascade.pause();
      burst.pause();
      invalid.pause();
      player.volume = 0.55;
      player.shouldCorrectPitch = false;
      player.setPlaybackRate(Math.min(1.5, 1 + Math.max(0, combo - 1) * 0.07));
      void player
        .seekTo(0)
        .then(() => player.play())
        .catch(() => {});
    }
    if (save.settings.haptics && combo > 0)
      void Haptics.impactAsync(
        large
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light,
      ).catch(() => {});
  };
}
