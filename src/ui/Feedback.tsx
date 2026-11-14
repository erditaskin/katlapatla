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
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { useSave } from "../state/store";
const Feedback = createContext({ reducedMotion: false, press: () => {} });
export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const { save } = useSave();
  const [systemReduced, setSystemReduced] = useState(false);
  const player = useAudioPlayer(require("../../assets/audio/ui-click.wav"));
  const serial = useRef(0);
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
  onPress,
  onPressIn,
  onPressOut,
  ...props
}: PressableProps & { wrapperStyle?: StyleProp<ViewStyle> }) {
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
