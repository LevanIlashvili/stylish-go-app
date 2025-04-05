import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useWallet } from '../../providers';
import { generateRandomWallet } from '../../utils/wallet';
import { storeWallet } from '../../utils/storage';
import { colors } from '../../config';
import { fonts } from '../../utils/fonts';

const { width, height } = Dimensions.get('window');

export function OnboardingScreen() {
  const { setWallet } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleCreateWallet = async () => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newWallet = generateRandomWallet();
      
      await storeWallet({
        address: newWallet.address,
        encryptedWallet: JSON.stringify(newWallet),
      });
      
      setWallet(newWallet);
    } catch (error) {
      console.error('Error creating wallet:', error);
      Alert.alert('Error', 'Failed to create wallet');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Main content in the center */}
      <View style={styles.centerContent}>
        <Text style={styles.logoText}>Stylish Go</Text>
        
        <Text style={styles.subtitle}>
          Play the ancient game of Go with a modern twist. Create your wallet to begin.
        </Text>
      </View>
      
      {/* Bottom content */}
      <View style={styles.bottomContent}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[
              styles.button,
              loading && styles.buttonLoading
            ]}
            onPress={handleCreateWallet}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating Wallet...' : 'Create Wallet'}
            </Text>
            {loading && (
              <ActivityIndicator 
                color={colors.background}
                size="small"
                style={styles.loader}
              />
            )}
          </TouchableOpacity>
          
          <View style={[styles.buttonGlow, { zIndex: -1 }]} />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Powered by Stylus
          </Text>
        </View>
      </View>
      
      <View style={styles.gridContainer}>
        {[...Array(25)].map((_, index) => (
          <View key={index} style={styles.gridDot} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  bottomContent: {
    width: '100%',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 80,
    fontFamily: fonts.brush,
    color: colors.primary,
    textShadowColor: colors.neon.blue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    textAlign: 'center',
    marginBottom: 40,
    width: '100%',
    paddingHorizontal: 20,
    includeFontPadding: false,
    lineHeight: 120,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: width * 0.8,
    lineHeight: 22,
    fontFamily: fonts.orbitron.regular,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: width * 0.8,
    maxWidth: 300,
    height: 56,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.secondary,
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: colors.text.dark,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
    fontFamily: fonts.orbitron.black,
  },
  buttonGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
  },
  gridContainer: {
    position: 'absolute',
    width: width,
    height: width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    opacity: 0.15,
    transform: [{ rotate: '45deg' }],
    zIndex: -1,
    top: height / 2 - width / 2,
  },
  gridDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    margin: width / 12,
  },
  infoContainer: {
    marginBottom: 10,
  },
  infoText: {
    color: colors.text.secondary,
    fontSize: 14,
    opacity: 0.7,
    fontFamily: fonts.orbitron.regular,
  },
  loader: {
    marginLeft: 10,
  },
  buttonLoading: {
    backgroundColor: colors.neon.blue,
    opacity: 0.8,
  },
}); 