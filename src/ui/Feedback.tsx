/* eslint-disable react-hooks/immutability -- Expo Audio uses documented mutable native player handles. */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AccessibilityInfo,
  Animated,
  AppState,
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useSave } from "../state/store";
const Feedback = createContext({ reducedMotion: false, press: () => {} });
export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const { save, ready } = useSave();
  const [systemReduced, setSystemReduced] = useState(false);
  const player = useAudioPlayer(require("../../assets/audio/ui-click.wav"));
  const serial = useRef(0);
  const music = useAudioPlayer(require("../../assets/audio/desert-mystic.m4a"));
  useEffect(() => {
    let mounted = true;
    music.loop = true;
    music.volume = 0.38;
    void setAudioModeAsync({
      playsInSilentMode: false,
      shouldPlayInBackground: false,
    })
      .then(() => {
        if (
          mounted &&
          ready &&
          save.settings.music &&
          AppState.currentState === "active"
        )
          music.play();
      })
      .catch(() => {});
    if (!ready || !save.settings.music) music.pause();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && ready && save.settings.music) music.play();
      else music.pause();
    });
    return () => {
      mounted = false;
      sub.remove();
      music.pause();
    };
  }, [music, ready, save.settings.music]);

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((v) => {
      if (active) setSystemReduced(v);
    });
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setSystemReduced,
    );
    return () => {
      active = false;
      sub.remove();
    };
  }, []);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        serial.current++;
        player.pause();
      }
    });
    return () => sub.remove();
  }, [player]);
  const press = useCallback(() => {
    if (save.settings.sound) {
      const token = ++serial.current;
      player.volume = 0.28;
      void player
        .seekTo(0)
        .then(() => {
          if (token === serial.current) player.play();
        })
        .catch(() => {});
    }
    if (save.settings.haptics) void Haptics.selectionAsync().catch(() => {});
  }, [player, save.settings.sound, save.settings.haptics]);
  const value = useMemo(
    () => ({
      reducedMotion: systemReduced || save.settings.reducedMotion,
      press,
    }),
    [systemReduced, save.settings.reducedMotion, press],
  );
  return <Feedback.Provider value={value}>{children}</Feedback.Provider>;
}
export function useFeedback() {
  return useContext(Feedback);
}
export function MotionPressable({
  wrapperStyle,
  highlighted = false,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}: PressableProps & {
  wrapperStyle?: StyleProp<ViewStyle>;
  highlighted?: boolean;
}) {
  const { reducedMotion, press } = useFeedback();
  const [scale] = useState(() => new Animated.Value(1));
  const animate = (value: number) => {
    scale.stopAnimation();
    if (reducedMotion) scale.setValue(1);
    else
      Animated.spring(scale, {
        toValue: value,
        stiffness: 420,
        damping: 23,
        mass: 0.65,
        useNativeDriver: true,
      }).start();
  };
  useEffect(() => {
    if (!highlighted || reducedMotion) {
      scale.setValue(1);
      return;
    }
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
      ]),
      { iterations: 3 },
    );
    animation.start();
    return () => {
      animation.stop();
      scale.setValue(1);
    };
  }, [highlighted, reducedMotion, scale]);
  useEffect(() => () => scale.stopAnimation(), [scale]);
  return (
    <Animated.View style={[wrapperStyle, { transform: [{ scale }] }]}>
      <Pressable
        {...props}
        onPressIn={(e) => {
          animate(0.955);
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          animate(1);
          onPressOut?.(e);
        }}
        onPress={(e) => {
          press();
          onPress?.(e);
        }}
      />
    </Animated.View>
  );
}
