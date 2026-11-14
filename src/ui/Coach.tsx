/* eslint-disable react-hooks/immutability -- Documented mutable Expo Audio player handle. */
import { useEffect, useRef, useState } from "react";
import { Animated, AppState, Image, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAudioPlayer } from "expo-audio";
import { useSave } from "../state/store";
import { useFeedback } from "./Feedback";
import { Label, Panel } from "./components";
import { coachTips, nextCoachTopic, type CoachTopic } from "./coachRules";
// Once per topic per app session. No modal, no input capture, no repeated nagging.
const seen = new Set<string>();
let lastShownAt = 0;
export function Coach({
  blocked,
  used,
  onTopic,
}: {
  blocked: boolean;
  used: HelperUsage;
  onTopic: (topic: CoachTopic | null) => void;
}) {
  const { save } = useSave();
  const { reducedMotion } = useFeedback();
  const meow = useAudioPlayer(require("../../assets/audio/cat-meow.wav"));
  const safe = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [topic, setTopic] = useState<CoachTopic | null>(null);
  const [slide] = useState(() => new Animated.Value(0));
  useEffect(() => {
    let active = true;
    if (topic && save.settings.music && AppState.currentState === "active") {
      meow.volume = 0.38;
      void meow
        .seekTo(0)
        .then(() => {
          if (active) meow.play();
        })
        .catch(() => {});
    }
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") {
        active = false;
        meow.pause();
      }
    });
    return () => {
      active = false;
      sub.remove();
      meow.pause();
    };
  }, [topic, save.settings.music, meow]);

  useEffect(() => {
    onTopic(blocked ? null : topic);
  }, [topic, blocked, onTopic]);
  const current = useRef({ blocked, used, helpers: save.helpers });
  useEffect(() => {
    current.current = { blocked, used, helpers: save.helpers };
  }, [blocked, used, save.helpers]);
  useEffect(() => {
    const timer = setInterval(() => {
      const state = current.current;
      if (
        state.blocked ||
        AppState.currentState !== "active" ||
        Date.now() - lastShownAt < 45000
      )
        return;
      const excluded = new Set([...seen, ...Object.keys(state.used)]);
      const next = nextCoachTopic(excluded, state.helpers);
      if (!next) {
        clearInterval(timer);
        return;
      }
      seen.add(next);
      lastShownAt = Date.now();
      setTopic(next);
    }, 8000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!topic) return;
    slide.setValue(reducedMotion ? 1 : 0);
    const a = Animated.spring(slide, {
      toValue: 1,
      stiffness: 180,
      damping: 20,
      useNativeDriver: true,
    });
    a.start();
    const timer = setTimeout(() => setTopic(null), 7000);
    return () => {
      clearTimeout(timer);
      a.stop();
    };
  }, [topic, slide, reducedMotion]);
  if (!topic || blocked) return null;
  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      accessibilityLabel={`Kedi rehber: ${coachTips[topic]}`}
      testID="cat-coach"
      style={{
        position: "absolute",
        top: safe.top + 57,
        right: 0,
        width: Math.min(width - 12, 350),
        flexDirection: "row",
        alignItems: "center",
        opacity: slide,
        transform: [
          {
            translateX: reducedMotion
              ? 0
              : slide.interpolate({
                  inputRange: [0, 1],
                  outputRange: [350, 0],
                }),
          },
        ],
      }}
    >
      <Panel style={{ flex: 1, padding: 12 }}>
        <Label size={15}>{coachTips[topic]}</Label>
      </Panel>
      <Image
        source={require("../../assets/art/cat-coach.png")}
        resizeMode="contain"
        style={{ width: 80, height: 100, marginLeft: -5 }}
      />
    </Animated.View>
  );
}
export type HelperUsage = Partial<Record<"needle" | "heart" | "shuffle", true>>;
