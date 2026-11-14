import {
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import type { Board as BoardData, Tile } from "../game/engine";
import { art, colorNames } from "./art";
import { WaterBurst } from "./WaterBurst";
import { swipeTarget } from "./boardInput";
import { spreadEmitters } from "./impact";
const Balloon = memo(function Balloon({
  tile,
  index,
  width,
  height,
  popping,
  reducedMotion,
  selected,
  entering,
}: {
  tile: Tile;
  index: number;
  width: number;
  height: number;
  popping: boolean;
  reducedMotion: boolean;
  selected: boolean;
  entering: boolean;
}) {
  const x = (index % 8) * width,
    y = Math.floor(index / 8) * height;
  const [position] = useState(
    () =>
      new Animated.ValueXY({
        x,
        y:
          entering && !reducedMotion
            ? -height * (Math.floor(index / 8) + 1)
            : y,
      }),
  );
  const [sx] = useState(() => new Animated.Value(1));
  const [sy] = useState(() => new Animated.Value(1));
  const [opacity] = useState(() => new Animated.Value(1));
  useEffect(() => {
    const a = Animated.timing(position, {
      toValue: { x, y },
      duration: reducedMotion ? 0 : 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [position, x, y, reducedMotion]);
  useEffect(() => {
    sx.stopAnimation();
    sy.stopAnimation();
    opacity.stopAnimation();
    if (reducedMotion) {
      sx.setValue(1);
      sy.setValue(1);
      opacity.setValue(popping ? 0.15 : 1);
      return;
    }
    const a = popping
      ? Animated.parallel([
          Animated.sequence([
            Animated.parallel([
              Animated.timing(sx, {
                toValue: 1.15,
                duration: 65,
                useNativeDriver: true,
              }),
              Animated.timing(sy, {
                toValue: 0.84,
                duration: 65,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.timing(sx, {
                toValue: 0.08,
                duration: 125,
                useNativeDriver: true,
              }),
              Animated.timing(sy, {
                toValue: 0.08,
                duration: 125,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.sequence([
            Animated.delay(65),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 110,
              useNativeDriver: true,
            }),
          ]),
        ])
      : Animated.parallel([
          Animated.spring(sx, {
            toValue: selected ? 1.07 : 1,
            stiffness: 350,
            damping: 21,
            useNativeDriver: true,
          }),
          Animated.spring(sy, {
            toValue: selected ? 1.07 : 1,
            stiffness: 350,
            damping: 21,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 40,
            useNativeDriver: true,
          }),
        ]);
    a.start();
    return () => a.stop();
  }, [popping, selected, reducedMotion, sx, sy, opacity]);
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width,
        height,
        transform: position.getTranslateTransform(),
        zIndex: selected ? 2 : 1,
      }}
    >
      <View
        style={{
          width,
          height,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.Image
          source={art[tile.power ?? tile.color]}
          resizeMode="contain"
          style={{
            width: width - 3,
            height: height - 3,
            opacity,
            transform: [{ scaleX: sx }, { scaleY: sy }],
          }}
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
      </View>
    </Animated.View>
  );
});
const InputCell = memo(function InputCell({
  index,
  color,
  special,
  selected,
  disabled,
  width,
  height,
  onTap,
  onSwap,
}: {
  index: number;
  color: Tile["color"];
  special: boolean;
  selected: boolean;
  disabled: boolean;
  width: number;
  height: number;
  onTap: (i: number) => void;
  onSwap: (a: number, b: number) => void;
}) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  return (
    <Pressable
      testID={`cell-${index}`}
      accessibilityRole="button"
      accessibilityLabel={`${Math.floor(index / 8) + 1}. satır ${(index % 8) + 1}. sütun, ${colorNames[color]}${special ? ", özel balon" : ""}`}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      style={{
        position: "absolute",
        left: (index % 8) * width,
        top: Math.floor(index / 8) * height,
        width,
        height,
      }}
      onTouchStart={(e) => {
        swiped.current = false;
        start.current = { x: e.nativeEvent.pageX, y: e.nativeEvent.pageY };
      }}
      onTouchCancel={() => {
        start.current = null;
        swiped.current = false;
      }}
      onTouchEnd={(e) => {
        const origin = start.current;
        start.current = null;
        if (!origin || disabled) return;
        const target = swipeTarget(
          index,
          e.nativeEvent.pageX - origin.x,
          e.nativeEvent.pageY - origin.y,
        );
        if (target !== null) {
          swiped.current = true;
          onSwap(index, target);
        }
      }}
      onPress={() => {
        if (!disabled && !swiped.current) onTap(index);
      }}
    />
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
  effectId = 0,
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
  effectId?: number;
}) {
  const callbacks = useRef({ onTap, onSwap });
  useLayoutEffect(() => {
    callbacks.current = { onTap, onSwap };
  }, [onTap, onSwap]);
  const tap = useCallback(
    (index: number) => callbacks.current.onTap(index),
    [],
  );
  const swap = useCallback(
    (a: number, b: number) => callbacks.current.onSwap(a, b),
    [],
  );
  const [initialIds] = useState(() => new Set(board.map((t) => t.id)));
  const w = width / 8,
    h = height / 8;
  return (
    <View
      accessibilityLabel="8 satır 8 sütun balon tahtası"
      style={{ width: width + 4, height: height + 4 }}
    >
      <View
        style={{
          width: width + 4,
          height: height + 4,
          borderWidth: 2,
          borderColor: "#cda45b",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        {Array.from({ length: 64 }, (_, i) => (
          <View
            key={i}
            pointerEvents="none"
            style={{
              position: "absolute",
              left: (i % 8) * w,
              top: Math.floor(i / 8) * h,
              width: w,
              height: h,
              backgroundColor:
                (Math.floor(i / 8) + (i % 8)) % 2 ? "#20201b" : "#2a2922",
            }}
          />
        ))}
        {board.map((tile, i) => (
          <Balloon
            key={tile.id}
            tile={tile}
            index={i}
            width={w}
            height={h}
            popping={popping.includes(i)}
            reducedMotion={reducedMotion}
            selected={selected === i}
            entering={!initialIds.has(tile.id)}
          />
        ))}
      </View>
      <View
        style={{ position: "absolute", left: 2, top: 2, width, height }}
        pointerEvents={disabled ? "none" : "auto"}
      >
        {board.map((tile, i) => (
          <InputCell
            key={i}
            index={i}
            color={tile.color}
            special={!!tile.power}
            selected={selected === i}
            disabled={disabled}
            width={w}
            height={h}
            onTap={tap}
            onSwap={swap}
          />
        ))}
      </View>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {spreadEmitters(popping).map((i) => (
          <WaterBurst
            key={`${effectId}-${i}`}
            x={(i % 8) * w + w / 2 + 2}
            y={Math.floor(i / 8) * h + h / 2 + 2}
            size={Math.max(w, h)}
            color={board[i]!.color}
            strong={popping.length >= 8}
            reducedMotion={reducedMotion}
          />
        ))}
      </View>
    </View>
  );
}
