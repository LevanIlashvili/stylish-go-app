import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameMenu } from '../screens';
import { LeaderboardScreen } from '../screens/game/LeaderboardScreen';
import { colors } from '../config';

type GameStackParamList = {
  Menu: undefined;
  Leaderboard: undefined;
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
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
    </Stack.Navigator>
  );
} 