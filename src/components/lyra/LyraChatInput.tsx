import { ImageSquare, PaperPlaneTilt, X } from 'phosphor-react-native';
import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { themeColors } from '../../constants/theme';

interface LyraChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onPickImage: () => void;
  pendingImageUri?: string | null;
  onClearImage?: () => void;
  disabled?: boolean;
  canSend?: boolean;
}

export function LyraChatInput({
  value,
  onChangeText,
  onSend,
  onPickImage,
  pendingImageUri,
  onClearImage,
  disabled = false,
  canSend = false,
}: LyraChatInputProps) {
  return (
    <View style={styles.wrapper}>
      {pendingImageUri ? (
        <View style={styles.previewRow}>
          <Image source={{ uri: pendingImageUri }} style={styles.preview} />
          <Pressable
            onPress={onClearImage}
            style={styles.previewClear}
            hitSlop={8}
            disabled={disabled}
          >
            <X size={14} color={themeColors.textMuted} />
          </Pressable>
        </View>
      ) : null}

      <View style={[styles.container, disabled && styles.containerDisabled]}>
        <Pressable
          onPress={onPickImage}
          disabled={disabled}
          style={({ pressed }) => [styles.attachBtn, pressed && styles.pressed]}
          hitSlop={4}
        >
          <ImageSquare size={20} color={themeColors.textMuted} />
        </Pressable>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Mensagem..."
          placeholderTextColor={themeColors.textMuted}
          style={styles.input}
          editable={!disabled}
          multiline
          maxLength={2000}
          onSubmitEditing={canSend ? onSend : undefined}
          blurOnSubmit={false}
        />

        <Pressable
          onPress={onSend}
          disabled={disabled || !canSend}
          style={({ pressed }) => [
            styles.sendBtn,
            (disabled || !canSend) && styles.sendBtnDisabled,
            pressed && canSend && !disabled && styles.pressed,
          ]}
          hitSlop={4}
        >
          <PaperPlaneTilt
            size={18}
            color={canSend && !disabled ? '#FFFFFF' : themeColors.textSubtle}
            weight="fill"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
    paddingTop: 8,
    paddingBottom: 0,
  },
  previewRow: {
    alignSelf: 'flex-start',
    position: 'relative',
  },
  preview: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: themeColors.glassButton,
  },
  previewClear: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: themeColors.glass,
    borderWidth: 1,
    borderColor: themeColors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: themeColors.glassBorder,
    backgroundColor: themeColors.glassButton,
    paddingLeft: 8,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 4,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  attachBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: themeColors.text,
    maxHeight: 120,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 4,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: themeColors.primary,
  },
  sendBtnDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  pressed: {
    opacity: 0.85,
  },
});
