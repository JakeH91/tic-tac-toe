import React, { ReactNode, ReactElement } from "react";
import { Text as NativeText, TextProps as NativeTextProps } from "react-native";

type TextProps = {
  weight: "400" | "700";
  children: ReactNode;
} & NativeTextProps;

const defaultProps = {
  weight: "400",
};

export default function Text({
  style,
  children,
  weight,
  ...props
}: TextProps): ReactElement {
  let fontFamily = "DeliusUnicase_400Regular";
  if (weight === "700") fontFamily = "DeliusUnicase_700Bold";

  return (
    <NativeText {...props} style={[{ fontFamily }, style]}>
      {children}
    </NativeText>
  );
}

Text.defaultProps = defaultProps;
