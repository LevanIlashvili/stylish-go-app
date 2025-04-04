import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameMenu } from '../screens';

type GameStackParamList = {
  Menu: undefined;
};

const Stack = createNativeStackNavigator<GameStackParamList>();

export function GameNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Menu" component={GameMenu} />
    </Stack.Navigator>
  );
} 