import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../config';
import { fonts } from '../../utils/fonts';
import { GoBoard } from './GoBoard';   

type BoardScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const BOARD_SIZE = 7;

export function BoardScreen({ navigation }: BoardScreenProps) {
  const [score, setScore] = useState({ black: 0, white: 0 });
  const [boardState, setBoardState] = useState<(number | null)[][]>(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0); // 0 for black, 1 for white

  const handleIntersectionPress = (row: number, col: number) => {
    if (boardState[row][col] === null) {
      const newBoardState = boardState.map(r => [...r]); // Create a new copy
      newBoardState[row][col] = currentPlayer;
      setBoardState(newBoardState);
      setCurrentPlayer(currentPlayer === 0 ? 1 : 0); // Switch player
      
      console.log(`Placed stone at (${row}, ${col}) for player ${currentPlayer === 0 ? 'Black' : 'White'}`);
    } else {
      console.log(`Intersection (${row}, ${col}) is already occupied.`);
    }
  };

  const handlePass = () => {
    console.log('Pass button pressed');
    setCurrentPlayer(currentPlayer === 0 ? 1 : 0); 
  };

  const handleAbandon = () => {
    console.log('Abandon button pressed');
    // abandon logic
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Game</Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text 
          style={[
            styles.scoreText,
            currentPlayer === 0 ? styles.currentPlayerText : styles.inactivePlayerText,
            { color: colors.primary } 
          ]}
        >
          Player 1: {score.black}
        </Text>
        <Text 
          style={[
            styles.scoreText, 
            currentPlayer === 1 ? styles.currentPlayerText : styles.inactivePlayerText,
            { color: colors.secondary } 
          ]}
        >
          Player 2: {score.white}
        </Text>
      </View>

      <View style={styles.boardContainer}>
        <GoBoard 
          size={BOARD_SIZE} 
          boardState={boardState} 
          onIntersectionPress={handleIntersectionPress} 
        />
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.passButton]}
          onPress={handlePass}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Pass</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.abandonButton]}
          onPress={handleAbandon}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Abandon</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
    position: 'relative',
  },
  title: {
    color: colors.primary,
    fontSize: 22,
    fontFamily: fonts.orbitron.bold,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15, 
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.primary + '40',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
    fontFamily: fonts.orbitron.medium,
  },
  currentPlayerText: {
    fontFamily: fonts.orbitron.bold, 
    textShadowColor: colors.white + '50', 
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  inactivePlayerText: {
    opacity: 0.6,
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, 
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom: 30,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.orbitron.bold,
  },
  passButton: {
    backgroundColor: colors.secondary + '90',
    shadowColor: colors.secondary, 
  },
  abandonButton: {
    backgroundColor: colors.primary + '90',
    shadowColor: colors.primary, 
  },
}); 