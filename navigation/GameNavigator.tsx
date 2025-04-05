import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameMenu, BoardScreen } from '../screens';
import { LeaderboardScreen } from '../screens/game/LeaderboardScreen';
import { WalletScreen } from '../screens/game/WalletScreen';
import { colors } from '../config';

type GameStackParamList = {
  Menu: undefined;
  Leaderboard: undefined;
  Wallet: undefined;
  Board: undefined;
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
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Board" component={BoardScreen} />
    </Stack.Navigator>
  );
} 