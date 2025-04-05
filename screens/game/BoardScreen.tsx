import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { ContractTransactionResponse } from 'ethers';

import { colors } from '../../config';
import { fonts } from '../../utils/fonts';
import { GoBoard } from './GoBoard';
import { useGame } from '../../providers';
import { useWallet } from '../../providers';

type BoardScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const BOARD_SIZE = 7;

const { width } = Dimensions.get('window');
const BOARD_MARGIN_HORIZONTAL = 45;

export function BoardScreen({ navigation }: BoardScreenProps) {
  const { wallet } = useWallet();
  const { contract, isLoading: isGameLoading, gameError } = useGame();
  
  const [boardState, setBoardState] = useState<(number | null)[][]>(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  );
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isGameEndedState, setIsGameEndedState] = useState<boolean>(false);
  const [gameResult, setGameResult] = useState<{ player1Points: number, player2Points: number, winner: number } | null>(null);
  const [isLoadingAction, setIsLoadingAction] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchGameState = useCallback(async () => {
    if (!contract || !wallet) return;

    setStatusMessage("Fetching game state...");
    setIsLoadingAction(true);
    try {
      const hasGame = await contract.hasGame(wallet.address);
      setIsGameActive(hasGame);

      if (hasGame) {
        const boardData = await contract.getBoardAsArray(wallet.address);
        const ended = await contract.isGameEnded(wallet.address);

        setBoardState(boardData.map((row: bigint[]) => 
          row.map((cell: bigint) => Number(cell) === 0 ? null : Number(cell)))
        );
        setIsGameEndedState(ended);
        
        if (ended) {
          const result = await contract.getGameResult(wallet.address);
          setGameResult({
            player1Points: Number(result[0]),
            player2Points: Number(result[1]),
            winner: result[2]
          });
          setStatusMessage("Game has ended.");
        } else {
          setStatusMessage("Your turn.");
        }
      } else {
        setStatusMessage("No active game found. Create one from menu?");
      }
    } catch (error) {
      setStatusMessage("Error loading game state.");
      Toast.show({ type: 'error', text1: 'Game Error', text2: 'Could not load game state.' });
    } finally {
      setIsLoadingAction(false);
    }
  }, [contract, wallet]);

  useEffect(() => {
    if (contract && wallet) {
      fetchGameState();
    }
  }, [contract, wallet, fetchGameState]);

  const handleTransaction = async (
    action: Promise<ContractTransactionResponse>, 
    actionType: 'move' | 'pass' | 'abandon',
    baseErrorMessage: string
  ): Promise<boolean> => {
    setIsLoadingAction(true);
    setStatusMessage("Sending transaction...");
    let txHash: string | undefined;
    try {
      const tx = await action;
      txHash = tx.hash;
      setStatusMessage("Waiting for confirmation...");
      await tx.wait(); 
      setStatusMessage("Action confirmed.");
      await fetchGameState(); 
      return true;
    } catch (error: any) {
      let userFriendlyMessage = baseErrorMessage;
      if (actionType === 'move') {
        userFriendlyMessage = "Error placing stone. Invalid move?";
      } else if (actionType === 'pass') {
        userFriendlyMessage = "Error passing turn.";
      } else if (actionType === 'abandon') {
        userFriendlyMessage = "Error abandoning game.";
      }
      setStatusMessage(userFriendlyMessage);
      Toast.show({ type: 'error', text1: 'Action Failed', text2: userFriendlyMessage });
      return false;
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleIntersectionPress = async (row: number, col: number) => {
    if (!contract || isLoadingAction || isGameEndedState) return;
    
    const contractX = col;
    const contractY = row;

    await handleTransaction(
      contract.setPiece(contractX, contractY),
      'move',
      "Error placing stone."
    );
  };

  const handlePass = async () => {
    if (!contract || isLoadingAction || isGameEndedState) return;
    await handleTransaction(
      contract.passTurn(),
      'pass',
      "Error passing turn."
    );
  };

  const handleAbandon = async () => {
    if (!contract || isLoadingAction) return;
    
    if (isGameEndedState) {
      const success = await handleTransaction(
        contract.newGame(),
        'abandon',
        "Error starting new game."
      );
    } else {
      const success = await handleTransaction(
        contract.abandonGame(),
        'abandon',
        "Error abandoning game."
      );
      if (success) {
        navigation.navigate('Menu');
      }
    }
  };

  const getPlayerLabel = (playerIndex: number) => playerIndex === 0 ? "Player 1" : "Player 2";
  const getPlayerColor = (playerIndex: number) => playerIndex === 0 ? colors.primary : colors.secondary;

  const getCurrentPlayerIndex = () => {
    if (!isGameActive || isGameEndedState) return -1;
    const stoneCount = boardState.flat().filter(s => s !== null).length;
    return stoneCount % 2 === 0 ? 0 : 1;
  };

  const currentPlayerIndex = getCurrentPlayerIndex();

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
      paddingTop: 20,
      marginBottom: 15,
    },
    title: {
      color: colors.primary,
      fontSize: 22,
      fontFamily: fonts.orbitron.bold,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 20,
      minHeight: 30,
    },
    loader: {
      marginRight: 10,
    },
    statusText: {
      color: colors.text.secondary,
      fontSize: 14,
      fontFamily: fonts.orbitron.regular,
      textAlign: 'center',
    },
    scoreContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: colors.primary + '40',
      marginBottom: 15,
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
      paddingHorizontal: 20,
      marginBottom: 10,
      position: 'relative',
    },
    gameOverOverlay: {
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      margin: BOARD_MARGIN_HORIZONTAL,
    },
    gameOverText: {
      fontSize: 36,
      fontFamily: fonts.orbitron.black,
      color: colors.primary,
      marginBottom: 10,
    },
    gameOverResultText: {
      fontSize: 24,
      fontFamily: fonts.orbitron.bold,
      color: colors.white,
      marginBottom: 15,
    },
    gameOverScoreText: {
      fontSize: 18,
      fontFamily: fonts.orbitron.medium,
      color: colors.text.secondary,
    },
    controlsContainer: {
      paddingHorizontal: 30,
      paddingVertical: 15,
      paddingBottom: 25,
    },
    button: {
      width: '100%',
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: 'center',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 4,
      marginBottom: 15,
    },
    buttonText: {
      color: colors.white,
      fontSize: 18,
      fontFamily: fonts.orbitron.bold,
      letterSpacing: 1,
    },
    passButton: {
      backgroundColor: colors.secondary + 'B0',
      shadowColor: colors.secondary,
    },
    abandonButton: {
      backgroundColor: colors.primary + 'B0',
      shadowColor: colors.primary,
    },
    disabledButton: {
      opacity: 0.5,
      backgroundColor: colors.darkBackground + '99',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 1,
    },
    noGameContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    noGameText: {
      color: colors.text.secondary,
      fontSize: 18,
      fontFamily: fonts.orbitron.regular,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Game</Text>
      </View>

      <View style={styles.statusContainer}>
        {(isLoadingAction || isGameLoading) && <ActivityIndicator color={colors.primary} style={styles.loader} />}
        <Text style={styles.statusText}>{statusMessage || (gameError ? `Error: ${gameError}` : ' ')}</Text>
      </View>

      {isGameActive ? (
        <>
          <View style={styles.boardContainer}>
            <GoBoard 
              size={BOARD_SIZE} 
              boardState={boardState} 
              onIntersectionPress={handleIntersectionPress} 
            />
             {isGameEndedState && gameResult && (
              <View style={styles.gameOverOverlay}>
                <Text style={styles.gameOverText}>Game Over</Text>
                <Text style={styles.gameOverResultText}>
                  {gameResult.winner === 0 ? "Draw!" : 
                   gameResult.winner === 2 ? "Player 1 Wins!" : "Player 2 Wins!"}
                </Text>
                <Text style={styles.gameOverScoreText}>
                  Score: {gameResult.player1Points} ({getPlayerLabel(0)}) - {gameResult.player2Points} ({getPlayerLabel(1)})
                </Text>
              </View>
            )}
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.passButton, (isLoadingAction || isGameEndedState) && styles.disabledButton]}
              onPress={handlePass}
              activeOpacity={0.7}
              disabled={isLoadingAction || isGameEndedState}
            >
              <Text style={styles.buttonText}>Pass</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.abandonButton, isLoadingAction && styles.disabledButton]}
              onPress={handleAbandon}
              activeOpacity={0.7}
              disabled={isLoadingAction}
            >
              <Text style={styles.buttonText}>{isGameEndedState ? 'New Game' : 'Abandon'}</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.noGameContainer}>
          <Text style={styles.noGameText}>Loading game or no game active.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}