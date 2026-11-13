import React from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
  type StyleProp,
  type TextStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { art } from "./art";
export const palette = {
  gold: "#F0CD83",
  ivory: "#F5E5BC",
  stone: "#191916",
  teal: "#09B5B8",
};
export function Label({
  children,
  size = 18,
  style,
  title = false,
}: {
  children: React.ReactNode;
  size?: number;
  style?: StyleProp<TextStyle>;
  title?: boolean;
}) {
  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={1.2}
      style={[
        {
          color: palette.ivory,
          fontFamily: title ? "Cinzel" : "Georgia",
          fontSize: size,
          textShadowColor: "#000",
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 2,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
export function Icon({
  name,
  size = 26,
}: {
  name: keyof typeof art;
  size?: number;
}) {
  return (
    <Image
      source={art[name] as number}
      style={{ width: size, height: size }}
      resizeMode="contain"
    />
  );
}
export function Panel({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ padding: 12 }, style]}>
      <Image
        source={art.panel}
        capInsets={{ top: 12, left: 12, bottom: 12, right: 12 }}
        style={[
          StyleSheet.absoluteFill,
          { width: undefined, height: undefined },
        ]}
        resizeMode="stretch"
      />
      {children}
    </View>
  );
}
export function Button({
  label,
  onPress,
  kind = "primary",
  disabled = false,
  icon,
  small = false,
  testID,
}: {
  label: string;
  onPress: () => void;
  kind?: "primary" | "secondary";
  disabled?: boolean;
  icon?: keyof typeof art;
  small?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: small ? 46 : 56,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 18,
        opacity: disabled ? 0.55 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      {({ pressed }) => (
        <>
          <Image
            source={
              disabled
                ? art.disabled
                : kind === "secondary"
                  ? art.garnet
                  : pressed
                    ? art.pressed
                    : art.button
            }
            style={[
              StyleSheet.absoluteFill,
              { width: undefined, height: undefined },
            ]}
            capInsets={{ top: 18, bottom: 18, left: 25, right: 25 }}
            resizeMode="stretch"
          />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            {icon && <Icon name={icon} size={24} />}
            <Label size={small ? 17 : 21} style={{ color: palette.ivory }}>
              {label}
            </Label>
          </View>
        </>
      )}
    </Pressable>
  );
}
export function IconButton({
  name,
  label,
  onPress,
}: {
  name: keyof typeof art;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={{
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={art.iconFrame}
        style={[
          StyleSheet.absoluteFill,
          { width: undefined, height: undefined },
        ]}
        resizeMode="stretch"
      />
      <Icon name={name} />
    </Pressable>
  );
}
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <View
      accessibilityRole="header"
      accessibilityLabel="Katla Patla"
      style={{
        alignItems: "center",
        justifyContent: "center",
        height: compact ? 50 : 70,
        paddingHorizontal: 20,
      }}
    >
      <Image
        source={art.logo}
        style={{ width: "100%", height: compact ? 38 : 54 }}
        resizeMode="contain"
      />
    </View>
  );
}
export function Screen({ children }: { children: React.ReactNode }) {
  const safe = useSafeAreaInsets();
  return (
    <ImageBackground source={art.temple} style={{ flex: 1 }} resizeMode="cover">
      <View
        style={{
          flex: 1,
          paddingTop: safe.top,
          paddingBottom: Math.max(safe.bottom, 8),
        }}
      >
        {children}
      </View>
    </ImageBackground>
  );
}
export const row: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
};
