import React, { memo, useEffect, useRef, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, View } from "react-native";
import type { Board as BoardData, Tile } from "../game/engine";
import { COLORS } from "../game/engine";
import { art, colorNames } from "./art";
const Balloon = memo(function Balloon({
  tile,
  width,
  height,
  popping,
  reducedMotion,
  onPress,
  selected,
  index,
}: {
  tile: Tile;
  width: number;
  height: number;
  popping: boolean;
  reducedMotion: boolean;
  onPress: () => void;
  selected: boolean;
  index: number;
}) {
  const scale = useState(() => new Animated.Value(1))[0];
  useEffect(() => {
    scale.setValue(1);
    if (popping && !reducedMotion)
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }).start();
  }, [popping, reducedMotion, scale, tile.id]);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${Math.floor(index / 8) + 1}. satır ${(index % 8) + 1}. sütun, ${colorNames[tile.color]}${tile.power ? ", özel balon" : ""}`}
      accessibilityState={{ selected }}
      testID={`cell-${index}`}
      onPress={onPress}
      style={{
        width,
        height,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
          (Math.floor(index / 8) + (index % 8)) % 2 ? "#20201b" : "#2a2922",
      }}
    >
      <Animated.Image
        source={art[tile.power ?? tile.color]}
        style={{
          width: width - 3,
          height: height - 3,
          transform: [{ scale }],
          opacity: popping ? 0.3 : 1,
        }}
        resizeMode="contain"
      />
      {selected && (
        <Image
          source={art.selection}
          style={[
            StyleSheet.absoluteFill,
            { width: undefined, height: undefined },
          ]}
          resizeMode="stretch"
        />
      )}
      {popping && (
        <Image
          source={art.splash[COLORS.indexOf(tile.color)]}
          style={{
            position: "absolute",
            width: width * 1.5,
            height: height * 1.5,
          }}
          resizeMode="contain"
        />
      )}
    </Pressable>
  );
});
export function Board({
  board,
  width,
  height,
  selected,
  popping,
  reducedMotion,
  onTap,
  onSwap,
  disabled,
}: {
  board: BoardData;
  width: number;
  height: number;
  selected: number | null;
  popping: number[];
  reducedMotion: boolean;
  onTap: (i: number) => void;
  onSwap: (a: number, b: number) => void;
  disabled: boolean;
}) {
  const touch = useRef<{ x: number; y: number; index: number } | null>(null);
  const swiped = useRef(false);
  const w = width / 8,
    h = height / 8;
  return (
    <View
      accessibilityLabel="8 satır 8 sütun balon tahtası"
      style={{
        width: width + 4,
        height: height + 4,
        borderColor: "#cda45b",
        borderWidth: 2,
        borderRadius: 5,
        overflow: "hidden",
      }}
      onTouchEnd={(e) => {
        const t = touch.current;
        if (!t || disabled) return;
        const dx = e.nativeEvent.pageX - t.x,
          dy = e.nativeEvent.pageY - t.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 14) return;
        const a = t.index;
        if (a < 0) return;
        const b =
          a +
          (Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : -1) : dy > 0 ? 8 : -8);
        swiped.current = true;
        onSwap(a, b);
      }}
    >
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {board.map((tile, i) => (
          <View
            key={i}
            onTouchStart={(e) => {
              swiped.current = false;
              touch.current = {
                x: e.nativeEvent.pageX,
                y: e.nativeEvent.pageY,
                index: i,
              };
            }}
          >
            <Balloon
              tile={tile}
              index={i}
              width={w}
              height={h}
              popping={popping.includes(i)}
              reducedMotion={reducedMotion}
              selected={selected === i}
              onPress={() => {
                if (!disabled && !swiped.current) onTap(i);
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
