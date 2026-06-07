import React from 'react';
import { View, ViewProps } from 'react-native';

/** Substitui @react-native-masked-view — não usamos máscaras no app. */
export default function MaskedView({
  children,
  ...props
}: ViewProps & { children?: React.ReactNode }) {
  return <View {...props}>{children}</View>;
}
