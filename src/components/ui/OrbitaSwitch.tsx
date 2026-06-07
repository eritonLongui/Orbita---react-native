import React from 'react';
import { Platform, Switch as RNSwitch } from 'react-native';
import { Switch } from 'tamagui';
import { themeColors } from '../../constants/theme';

interface OrbitaSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function OrbitaSwitch({ checked, onCheckedChange, disabled }: OrbitaSwitchProps) {
  if (Platform.OS === 'web') {
    return (
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        backgroundColor={checked ? themeColors.primary : themeColors.surfaceMuted}
        borderColor={checked ? themeColors.primary : themeColors.border}
      >
        <Switch.Thumb backgroundColor="#FFFFFF" />
      </Switch>
    );
  }

  return (
    <RNSwitch
      value={checked}
      onValueChange={onCheckedChange}
      disabled={disabled}
      trackColor={{ false: themeColors.surfaceMuted, true: themeColors.primary }}
      thumbColor="#FFFFFF"
      ios_backgroundColor={themeColors.surfaceMuted}
    />
  );
}
