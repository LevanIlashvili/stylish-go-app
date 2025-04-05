import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../config';
import { fonts } from '../../utils/fonts';
import { ApiClient, LeaderboardEntry } from '../../utils/api/client';
import { useWallet } from '../../providers';

type LeaderboardScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export function LeaderboardScreen({ navigation }: LeaderboardScreenProps) {
  const { wallet } = useWallet();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlayerEntry, setCurrentPlayerEntry] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const client = new ApiClient();
        const data = await client.getLeaderboard();
        
        const topEntries = data.slice(0, 5);
        
        if (wallet) {
          const playerEntry: LeaderboardEntry = {
            address: wallet.address,
            points: 650,
            rank: 29,
          };
          setCurrentPlayerEntry(playerEntry);
        }
        
        setLeaderboardData(topEntries);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err);
        setError('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [wallet]);

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const renderItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    // Use blue colors for top 3
    const isTopThree = item.rank <= 3;
    const rankBackgroundColor = isTopThree 
      ? colors.secondary
      : colors.darkBackground;

    return (
      <View style={[
        styles.leaderboardItem,
        index % 2 === 0 ? styles.evenRow : styles.oddRow
      ]}>
        <View style={[
          styles.rankContainer,
          { backgroundColor: rankBackgroundColor }
        ]}>
          <Text style={styles.rankText}>{item.rank}</Text>
        </View>
        
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>{truncateAddress(item.address)}</Text>
        </View>
        
        <Text style={styles.pointsText}>{item.points.toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => setLoading(true)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.tableHeader}>
            <View style={styles.rankHeaderContainer}>
              <Text style={[styles.headerText, styles.rankHeaderText]}>Rank</Text>
            </View>
            <View style={styles.addressHeaderContainer}>
              <Text style={[styles.headerText, styles.addressHeaderText]}>Player</Text>
            </View>
            <View style={styles.pointsHeaderContainer}>
              <Text style={[styles.headerText, styles.pointsHeaderText]}>Points</Text>
            </View>
          </View>
          
          <View style={styles.listContainer}>
            <FlatList
              data={leaderboardData}
              renderItem={renderItem}
              keyExtractor={(item) => item.address}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
            
            {currentPlayerEntry && (
              <>
                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>•••</Text>
                  <View style={styles.divider} />
                </View>
                
                <View style={[styles.leaderboardItem, styles.currentPlayerItem]}>
                  <View style={[styles.rankContainer, styles.currentPlayerRank]}>
                    <Text style={styles.rankText}>{currentPlayerEntry.rank}</Text>
                  </View>
                  
                  <View style={styles.addressContainer}>
                    <Text style={[styles.addressText, styles.currentPlayerText]}>
                      {truncateAddress(currentPlayerEntry.address)} (You)
                    </Text>
                  </View>
                  
                  <Text style={styles.pointsText}>{currentPlayerEntry.points.toLocaleString()}</Text>
                </View>
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 28,
    fontFamily: fonts.orbitron.medium,
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    fontFamily: fonts.orbitron.bold,
  },
  placeholder: {
    width: 44,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
    marginBottom: 10,
    alignItems: 'center',
  },
  rankHeaderContainer: {
    width: 50,
    marginRight: 10,
    alignItems: 'center',
  },
  addressHeaderContainer: {
    flex: 1,
    alignItems: 'center',
  },
  pointsHeaderContainer: {
    width: 100,
    alignItems: 'flex-end',
  },
  headerText: {
    color: colors.primary,
    fontFamily: fonts.orbitron.medium,
    fontSize: 16,
  },
  rankHeaderText: {
    textAlign: 'center',
  },
  addressHeaderText: {
    textAlign: 'center',
  },
  pointsHeaderText: {
    textAlign: 'right',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingVertical: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  evenRow: {
    backgroundColor: 'rgba(20, 20, 30, 0.5)',
  },
  oddRow: {
    backgroundColor: 'rgba(30, 30, 40, 0.3)',
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankText: {
    color: colors.text.dark,
    fontFamily: fonts.orbitron.bold,
    fontSize: 18,
  },
  addressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  addressText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.orbitron.regular,
    textAlign: 'center',
  },
  pointsText: {
    color: colors.secondary,
    fontSize: 16,
    fontFamily: fonts.orbitron.bold,
    width: 100,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text.secondary,
    marginTop: 15,
    fontSize: 16,
    fontFamily: fonts.orbitron.regular,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: colors.neon.pink,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    fontFamily: fonts.orbitron.regular,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: colors.text.dark,
    fontSize: 16,
    fontFamily: fonts.orbitron.bold,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  divider: {
    height: 1,
    flex: 1,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  dividerText: {
    color: colors.primary,
    paddingHorizontal: 10,
    fontSize: 18,
    opacity: 0.5,
  },
  currentPlayerItem: {
    backgroundColor: 'rgba(18, 170, 255, 0.1)',
    borderWidth: 1,
    borderColor: colors.secondary,
    borderStyle: 'dashed',
  },
  currentPlayerRank: {
    backgroundColor: colors.primary,
  },
  currentPlayerText: {
    color: colors.white,
    fontFamily: fonts.orbitron.medium,
  },
}); 