import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameMenu } from '../screens';
import { colors } from '../config';

type GameStackParamList = {
  Menu: undefined;
};

const Stack = createNativeStackNavigator<GameStackParamList>();

export function GameNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Menu" component={GameMenu} />
    </Stack.Navigator>
  );
} 