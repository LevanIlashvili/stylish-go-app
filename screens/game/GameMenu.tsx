import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Animated,
  Easing,
  ActivityIndicator
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import { useWallet } from '../../providers';
import { useGame } from '../../providers';
import { colors } from '../../config';
import { fonts } from '../../utils/fonts';

const { width, height } = Dimensions.get('window');
const BOARD_SIZE = 9;
const CELL_SIZE = width / BOARD_SIZE;
const NUM_ANIMATED_STONES = 30; 
const MAX_VISIBLE_STONES = 20; 
const ANIMATION_DURATION = 1500;

type AnimatedStone = {
  id: number;
  x: number;
  y: number;
  color: 'primary' | 'secondary';
  scale: Animated.Value;
  opacity: Animated.Value;
  animating: boolean;
};

type GameMenuProps = {
  navigation: NativeStackNavigationProp<any>;
};

export function GameMenu({ navigation }: GameMenuProps) {
  const { wallet } = useWallet();
  const { 
    contract, 
    checkHasGame, 
    createGame, 
    isCheckingGame, 
    isCreatingGame, 
    gameError 
  } = useGame();
  
  const [stones, setStones] = useState<AnimatedStone[]>([]);
  const [playButtonLoading, setPlayButtonLoading] = useState(false);

  useEffect(() => {
    const initialStones: AnimatedStone[] = [];
    for (let i = 0; i < NUM_ANIMATED_STONES; i++) {
      initialStones.push({
        id: i,
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
        color: Math.random() > 0.5 ? 'primary' : 'secondary',
        scale: new Animated.Value(0),
        opacity: new Animated.Value(0),
        animating: false
      });
    }
    setStones(initialStones);
  }, []);

  useEffect(() => {
    if (stones.length === 0) return;
    const animateRandomStone = () => {
      const inactiveStones = stones.filter(stone => !stone.animating);
      if (inactiveStones.length === 0) return;
      const randomIndex = Math.floor(Math.random() * inactiveStones.length);
      const stoneToAnimate = inactiveStones[randomIndex];
      stoneToAnimate.x = Math.floor(Math.random() * BOARD_SIZE);
      stoneToAnimate.y = Math.floor(Math.random() * BOARD_SIZE);
      stoneToAnimate.color = Math.random() > 0.5 ? 'primary' : 'secondary';
      stoneToAnimate.animating = true;
      const appearAnimation = Animated.parallel([
        Animated.timing(stoneToAnimate.scale, { toValue: 1, duration: ANIMATION_DURATION, easing: Easing.elastic(1), useNativeDriver: true }),
        Animated.timing(stoneToAnimate.opacity, { toValue: 0.85, duration: ANIMATION_DURATION / 2, useNativeDriver: true })
      ]);
      const disappearAnimation = Animated.timing(stoneToAnimate.opacity, { toValue: 0, duration: ANIMATION_DURATION, delay: 3000, useNativeDriver: true });
      Animated.sequence([appearAnimation, disappearAnimation]).start(() => {
        stoneToAnimate.scale.setValue(0);
        stoneToAnimate.animating = false;
        setStones(prevStones => [...prevStones]);
      });
    };
    const interval = setInterval(() => {
      const activeStones = stones.filter(stone => stone.animating);
      if (activeStones.length < MAX_VISIBLE_STONES) {
        animateRandomStone();
      }
    }, 300);
    return () => clearInterval(interval);
  }, [stones]);

  const navigateToWallet = () => {
    navigation.navigate('Wallet');
  };

  const handlePlayPress = async () => {
    setPlayButtonLoading(true);
    try {
      if (!contract) { 
        Toast.show({ type: 'error', text1: 'Contract Error', text2: 'Game connection not ready. Try again.' });
        return;
      }

      const userHasGame = await checkHasGame();

      if (userHasGame) {
        navigation.navigate('Board');
      } else {
        const gameCreated = await createGame();
        if (gameCreated) {
          navigation.navigate('Board');
        }
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Something went wrong. Please try again.' });
    } finally {
      setPlayButtonLoading(false);
    }
  };

  const isPlayActionLoading = playButtonLoading || isCheckingGame || isCreatingGame;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    boardContainer: {
      position: 'absolute',
      width: width,
      height: height,
      opacity: 0.3,
    },
    gridLine: {
      position: 'absolute',
      backgroundColor: colors.secondary,
      opacity: 0.3,
      height: 1,
      width: 1,
    },
    stone: {
      position: 'absolute',
      width: 30,
      height: 30,
      borderRadius: 15,
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      paddingBottom: 40,
    },
    titleContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    title: {
      fontSize: 86,
      fontFamily: fonts.brush,
      color: colors.primary,
      textAlign: 'center',
      width: '100%',
      paddingHorizontal: 30,
      includeFontPadding: false,
      lineHeight: 100,
    },
    buttonsContainer: {
      width: '100%',
      maxWidth: 340,
      alignItems: 'center',
      marginBottom: 20,
    },
    button: {
      backgroundColor: colors.darkBackground,
      width: '100%',
      height: 70,
      borderRadius: 10,
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    playButton: {},
    walletButton: {},
    disabledButton: {
      opacity: 0.6,
      backgroundColor: colors.darkBackground + '80',
    },
    buttonText: {
      color: colors.white,
      fontSize: 26,
      fontFamily: fonts.orbitron.black,
      letterSpacing: 1,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        {Array.from({ length: BOARD_SIZE }).map((_, i) => (
          <View 
            key={`h${i}`} 
            style={[
              styles.gridLine, 
              { 
                width: width, 
                top: i * CELL_SIZE
              }
            ]} 
          />
        ))}
        {Array.from({ length: BOARD_SIZE }).map((_, i) => (
          <View 
            key={`v${i}`} 
            style={[
              styles.gridLine, 
              { 
                height: height, 
                left: i * CELL_SIZE 
              }
            ]} 
          />
        ))}
        {stones.map(stone => (
          <Animated.View
            key={stone.id}
            style={[
              styles.stone,
              {
                left: stone.x * CELL_SIZE - 15,
                top: stone.y * CELL_SIZE - 15,                
                backgroundColor: stone.color === 'primary' ? colors.primary : colors.secondary,
                transform: [{ scale: stone.scale }],
                opacity: stone.opacity,
              }
            ]}
          />
        ))}
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Stylish Go
          </Text>
        </View>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.playButton, isPlayActionLoading && styles.disabledButton]} 
            activeOpacity={0.7}
            onPress={handlePlayPress} 
            disabled={isPlayActionLoading}
          >
            {isPlayActionLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Text style={styles.buttonText}>Play</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.walletButton]} 
            activeOpacity={0.7}
            onPress={navigateToWallet}
          >
            <Text style={styles.buttonText}>My Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}