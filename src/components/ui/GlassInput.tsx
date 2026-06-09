import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
  type TextInputProps,
} from 'react-native';
import { bodyFontFamily } from '../../constants/typography';
import { themeColors } from '../../constants/theme';

type GlassInputProps = TextInputProps;

export function GlassInput({ style, onFocus, onBlur, ...props }: GlassInputProps) {
  const [focused, setFocused] = useState(false);

  const handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocused(false);
    onBlur?.(event);
  };

  return (
    <TextInput
      placeholderTextColor={themeColors.textPlaceholder}
      selectionColor={themeColors.primary}
      style={[styles.input, focused && styles.inputFocused, style]}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: themeColors.glassButton,
    borderWidth: 1,
    borderColor: themeColors.glassBorderStrong,
    borderRadius: 10,
    color: themeColors.text,
    height: 52,
    fontSize: 16,
    fontFamily: bodyFontFamily,
    paddingHorizontal: 16,
  },
  inputFocused: {
    borderColor: themeColors.primary,
  },
});
