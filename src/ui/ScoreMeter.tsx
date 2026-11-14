import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Label, Panel, row } from "./components";
import { goalProgress } from "./impact";
import { useFeedback } from "./Feedback";
export function ScoreMeter({
  score,
  initial,
  remaining,
  width,
}: {
  score: number;
  initial: number;
  remaining: number;
  width: number;
}) {
  const { reducedMotion } = useFeedback();
  const progress = goalProgress(initial, remaining);
  const [fill] = useState(() => new Animated.Value(progress));
  const [pulse] = useState(() => new Animated.Value(1));
  useEffect(() => {
    const animation = Animated.timing(fill, {
      toValue: progress,
      duration: reducedMotion ? 0 : 420,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, reducedMotion, fill]);
  useEffect(() => {
    if (!score || reducedMotion) return;
    const a = Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1.06,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(pulse, {
        toValue: 1,
        stiffness: 260,
        damping: 17,
        useNativeDriver: true,
      }),
    ]);
    a.start();
    return () => a.stop();
  }, [score, reducedMotion, pulse]);
  return (
    <Panel style={{ width, paddingVertical: 7, paddingHorizontal: 13 }}>
      <View style={[row, { gap: 12 }]}>
        <Animated.View style={{ transform: [{ scale: pulse }] }}>
          <Label size={19} style={{ color: "#f2d392" }}>
            {score.toLocaleString("tr-TR")}
          </Label>
          <Label size={10} style={{ color: "#bda77f", letterSpacing: 2 }}>
            PUAN
          </Label>
        </Animated.View>
        <View style={{ flex: 1, maxWidth: "62%", gap: 4 }}>
          <View style={row}>
            <Label size={10} style={{ color: "#c9b68e", letterSpacing: 1 }}>
              HEDEFLER
            </Label>
            <Label size={11} style={{ color: "#a2eee4" }}>
              %{Math.round(progress * 100)}
            </Label>
          </View>
          <View
            accessibilityRole="progressbar"
            accessibilityLabel="Hedef tamamlama"
            accessibilityValue={{
              min: 0,
              max: 100,
              now: Math.round(progress * 100),
            }}
            style={{
              height: 9,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: "#8c7040",
              backgroundColor: "#090f11",
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: "#20bdb6",
                  borderRadius: 4,
                  transformOrigin: "left center",
                  transform: [{ scaleX: fill }],
                },
              ]}
            />
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                top: 1,
                left: 1,
                right: 1,
                height: 1,
                backgroundColor: "#c4ffff70",
              }}
            />
          </View>
        </View>
      </View>
    </Panel>
  );
}
