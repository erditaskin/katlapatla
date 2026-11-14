import { memo, useEffect, useState } from "react";
import { Animated, Easing, View } from "react-native";
import { COLORS, type Color } from "../game/engine";
import { art } from "./art";
const waterColors = [
  "#f4c354",
  "#629cff",
  "#4ce7d2",
  "#f476aa",
  "#ffad66",
  "#e8eced",
];
export const WaterBurst = memo(function WaterBurst({
  x,
  y,
  size,
  color,
  strong,
  reducedMotion,
}: {
  x: number;
  y: number;
  size: number;
  color: Color;
  strong: boolean;
  reducedMotion: boolean;
}) {
  const [p] = useState(() => new Animated.Value(0));
  const tint = waterColors[COLORS.indexOf(color)]!;
  useEffect(() => {
    const a = Animated.timing(p, {
      toValue: 1,
      duration: reducedMotion ? 120 : 410,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [p, reducedMotion]);
  const fade = p.interpolate({
    inputRange: [0, 0.12, 0.48, 1],
    outputRange: [0, 1, 0.8, 0],
  });
  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: size,
          borderWidth: 2,
          borderColor: tint,
          opacity: fade,
          transform: [
            {
              scale: reducedMotion
                ? 1
                : p.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.25, strong ? 2.3 : 1.6],
                  }),
            },
          ],
        }}
      />
      <Animated.Image
        source={art.splash[COLORS.indexOf(color)]}
        resizeMode="contain"
        style={{
          position: "absolute",
          width: size * 1.7,
          height: size * 1.7,
          opacity: fade,
          transform: [
            {
              scale: reducedMotion
                ? 1
                : p.interpolate({
                    inputRange: [0, 0.45, 1],
                    outputRange: [0.18, strong ? 1.2 : 0.9, 1.4],
                  }),
            },
            { rotate: color === "waves" ? "17deg" : "-8deg" },
          ],
        }}
      />
      {!reducedMotion &&
        Array.from({ length: 5 }, (_, i) => {
          const angle = ((i * 72 + COLORS.indexOf(color) * 19) * Math.PI) / 180;
          const radius = size * (strong ? 0.95 : 0.7);
          return (
            <Animated.View
              key={i}
              style={{
                position: "absolute",
                width: i % 2 ? 4 : 6,
                height: i % 2 ? 9 : 6,
                borderRadius: 5,
                backgroundColor: tint,
                opacity: fade,
                transform: [
                  {
                    translateX: p.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, Math.cos(angle) * radius],
                    }),
                  },
                  {
                    translateY: p.interpolate({
                      inputRange: [0, 0.6, 1],
                      outputRange: [
                        0,
                        Math.sin(angle) * radius - 9,
                        Math.sin(angle) * radius + 16,
                      ],
                    }),
                  },
                  {
                    scale: p.interpolate({
                      inputRange: [0, 0.3, 1],
                      outputRange: [0.3, 1, 0.2],
                    }),
                  },
                  { rotate: `${i * 54}deg` },
                ],
              }}
            />
          );
        })}
    </View>
  );
});
