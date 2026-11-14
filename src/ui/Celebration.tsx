import { useEffect, useState } from "react";
import { Animated, View } from "react-native";
import { Label } from "./components";
import { useFeedback } from "./Feedback";
export function Celebration({
  title,
  combo,
  points,
}: {
  title: string;
  combo: number;
  points: number;
}) {
  const { reducedMotion } = useFeedback();
  const [scale] = useState(() => new Animated.Value(reducedMotion ? 1 : 0.4));
  const [opacity] = useState(() => new Animated.Value(1));
  useEffect(() => {
    const a = Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        stiffness: 280,
        damping: 16,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(570),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
    ]);
    a.start();
    return () => a.stop();
  }, [scale, opacity]);
  return (
    <Animated.View
      pointerEvents="none"
      testID="combo-celebration"
      style={{
        position: "absolute",
        top: "34%",
        left: 0,
        right: 0,
        alignItems: "center",
        opacity,
        transform: [{ scale }],
      }}
    >
      <View
        style={{
          backgroundColor: "#100b08dd",
          borderColor: "#dcb56c",
          borderWidth: 1,
          borderRadius: 12,
          paddingHorizontal: 18,
          paddingVertical: 10,
        }}
      >
        <Label
          title
          size={30}
          style={{
            color: "#ffe09b",
            textAlign: "center",
            textShadowColor: "#b85c06",
            textShadowRadius: 10,
          }}
        >
          {title}
        </Label>
        <Label size={21} style={{ color: "#a5fff1", textAlign: "center" }}>
          +{points.toLocaleString("tr-TR")}{" "}
          {combo > 1 && !title.startsWith("KATLA +")
            ? `· KATLA +${combo}`
            : "PUAN"}
        </Label>
      </View>
    </Animated.View>
  );
}
