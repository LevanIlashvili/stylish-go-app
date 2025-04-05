import React from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import { colors } from '../../config';

type GoBoardProps = {
  size: number;
  boardState: (number | null)[][]; 
  onIntersectionPress: (row: number, col: number) => void;
};

const { width } = Dimensions.get('window');
const BOARD_MARGIN_HORIZONTAL = 45; 

function isStarPoint(size: number, row: number, col: number): boolean {
  if (size !== 7) return false; 
  return row === 3 && col === 3; 
}

export function GoBoard({ size, boardState, onIntersectionPress }: GoBoardProps) {
  const boardWidth = width - BOARD_MARGIN_HORIZONTAL * 2; 
  const cellSize = boardWidth / (size - 1);
  const stoneSize = cellSize * 0.8; 
  const starPointSize = cellSize * 0.15; 

  return (
    <View style={[styles.board, { width: boardWidth, height: boardWidth }]}>
      {Array.from({ length: size }).map((_, i) => (
        <View 
          key={`h${i}`} 
          style={[
            styles.gridLine,
            { 
              width: '100%', 
              top: i * cellSize,
              height: 1,
            }
          ]}
        />
      ))}
      {Array.from({ length: size }).map((_, i) => (
        <View 
          key={`v${i}`} 
          style={[
            styles.gridLine, 
            { 
              height: '100%', 
              left: i * cellSize, 
              width: 1, 
            }
          ]}
        />
      ))}
      
      {Array.from({ length: size }).map((_, r) =>
        Array.from({ length: size }).map((_, c) =>
          isStarPoint(size, r, c) ? (
            <View
              key={`star-${r}-${c}`}
              style={[
                styles.starPoint,
                {
                  left: c * cellSize - starPointSize / 2,
                  top: r * cellSize - starPointSize / 2,
                  width: starPointSize,
                  height: starPointSize,
                  borderRadius: starPointSize / 2,
                },
              ]}
            />
          ) : null
        )
      )}
      
      {boardState.map((row, rowIndex) => 
        row.map((cell, colIndex) => {
          const isPlayer1 = cell === 0;
          const isPlayer2 = cell === 1;
          const stoneBaseStyle = isPlayer1 ? styles.player1Stone : styles.player2Stone;
          const gradientColors = isPlayer1
            ? [colors.primary, '#A0054D'] as const
            : [colors.secondary, '#0D7FAF'] as const;
          
          return (
            <Pressable
              key={`${rowIndex}-${colIndex}`}
              style={[
                styles.intersection,
                {
                  left: colIndex * cellSize - cellSize / 2,
                  top: rowIndex * cellSize - cellSize / 2,
                  width: cellSize,
                  height: cellSize,
                },
              ]}
              onPress={() => onIntersectionPress(rowIndex, colIndex)}
              hitSlop={10} 
            >
              {(isPlayer1 || isPlayer2) && (
                <View style={[styles.stoneContainer, { width: stoneSize, height: stoneSize }]}>
                  <LinearGradient
                    colors={gradientColors}
                    style={[
                      styles.stone,
                      stoneBaseStyle,
                      { borderRadius: stoneSize / 2 }
                    ]}
                    start={{ x: 0.3, y: 0.1 }} 
                    end={{ x: 0.7, y: 0.9 }}
                  />
                </View>
              )}
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: colors.darkBackground + 'E0', 
    position: 'relative',
    borderRadius: 12, 
    shadowColor: colors.primary + '80', 
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 6,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: colors.primary + '30', 
  },
  starPoint: {
    position: 'absolute',
    backgroundColor: colors.primary + '70', 
  },
  intersection: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stoneContainer: { 
    overflow: 'hidden', 
    borderRadius: 50, 
  },
  stone: {
    width: '100%', 
    height: '100%', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4, 
    shadowRadius: 3, 
    elevation: 3,
  },
  player1Stone: { 
    shadowColor: colors.primary, 
  },
  player2Stone: { 
    shadowColor: colors.secondary, 
  },
}); 