import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { colors } from '.';
import { fonts } from '../utils/fonts';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftWidth: 0,
        backgroundColor: colors.darkBackground,
        borderRadius: 8,
        borderWidth: 0,
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
        height: 'auto',
        minHeight: 60,
        paddingVertical: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontFamily: fonts.orbitron.bold,
        color: colors.white,
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: fonts.orbitron.regular,
        color: colors.text.secondary,
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftWidth: 0,
        backgroundColor: colors.darkBackground,
        borderRadius: 8,
        borderWidth: 0,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
        height: 'auto',
        minHeight: 60,
        paddingVertical: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontFamily: fonts.orbitron.bold,
        color: colors.white,
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: fonts.orbitron.regular,
        color: colors.text.secondary,
      }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftWidth: 0,
        backgroundColor: colors.darkBackground,
        borderRadius: 8,
        borderWidth: 0,
        shadowColor: colors.neon.blue,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
        height: 'auto',
        minHeight: 60,
        paddingVertical: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontFamily: fonts.orbitron.bold,
        color: colors.white,
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: fonts.orbitron.regular,
        color: colors.text.secondary,
      }}
    />
  ),
}; 