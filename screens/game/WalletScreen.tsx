import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';
import { colors } from '../../config';
import { fonts } from '../../utils/fonts';
import { useWallet } from '../../providers';
import { ApiClient } from '../../utils/api/client';
import { deleteWallet } from '../../utils/storage';

type WalletScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export function WalletScreen({ navigation }: WalletScreenProps) {
  const { wallet, setWallet } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMnemonicModal, setShowMnemonicModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!wallet) return;
      
      try {
        setLoading(true);
        const client = new ApiClient();
        const balanceData = await client.getBalance(wallet.address);
        setBalance(balanceData);
      } catch (err) {
        console.error('Failed to fetch balance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [wallet]);

  const copyAddressToClipboard = async () => {
    if (!wallet) return;
    
    await Clipboard.setStringAsync(wallet.address);
    Toast.show({
      type: 'success',
      text1: 'Address Copied',
      text2: 'Wallet address copied to clipboard',
      position: 'bottom',
      visibilityTime: 2500,
    });
  };

  const copyMnemonicToClipboard = async () => {
    if (!wallet) return;
    
    await Clipboard.setStringAsync(wallet.mnemonic);
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleResetWallet = async () => {
    try {
      setIsResetting(true);
      await deleteWallet();
      setWallet(null);
      setShowResetModal(false);
      Toast.show({
        type: 'success',
        text1: 'Wallet Reset',
        text2: 'Your wallet has been successfully reset',
        position: 'bottom',
        visibilityTime: 2500,
      });
    } catch (error) {
      console.error('Error during wallet reset:', error);
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: 'Unable to reset wallet. Please try again.',
        position: 'bottom',
        visibilityTime: 3000,
      });
    } finally {
      setIsResetting(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const renderMnemonicModal = () => (
    <Modal
      transparent
      visible={showMnemonicModal}
      animationType="fade"
      onRequestClose={() => setShowMnemonicModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Backup Your Wallet</Text>
          
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              Save these words in a secure location. Anyone with this phrase can access your wallet.
            </Text>
          </View>
          
          <View style={styles.mnemonicContainer}>
            <Text style={styles.mnemonicText}>
              {wallet?.mnemonic}
            </Text>
          </View>
          
          <View style={styles.modalButtonRow}>
            <TouchableOpacity
              style={[styles.modalButton, styles.copyButton]}
              onPress={copyMnemonicToClipboard}
            >
              <Text style={styles.modalButtonText}>
                {isCopied ? 'Copied!' : 'Copy Phrase'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setShowMnemonicModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderResetModal = () => (
    <Modal
      transparent
      visible={showResetModal}
      animationType="fade"
      onRequestClose={() => setShowResetModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Reset Wallet</Text>
          
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              This action will delete your wallet permanently. All your progress will be lost.
            </Text>
            <Text style={[styles.warningText, styles.boldText]}>
              Are you sure you want to continue?
            </Text>
          </View>
          
          <View style={styles.modalButtonRow}>
            {isResetting ? (
              <ActivityIndicator color={colors.primary} size="large" />
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.modalButton, styles.dangerButton]}
                  onPress={handleResetWallet}
                >
                  <Text style={styles.modalButtonText}>Yes, Reset</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowResetModal(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );

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
        <Text style={styles.title}>Wallet</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={[styles.card, styles.addressCard]}
          onPress={copyAddressToClipboard}
          activeOpacity={0.7}
        >
          <Text style={styles.addressLabel}>Your Address</Text>
          <Text style={styles.addressText}>
            {wallet ? formatAddress(wallet.address) : 'No wallet found'}
          </Text>
          <Text style={styles.copyHint}>Tap to copy</Text>
        </TouchableOpacity>
        
        <View style={[styles.card, styles.balanceCard]}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>SPN Balance</Text>
            {loading && <ActivityIndicator color={colors.secondary} size="small" />}
          </View>
          
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>
              {balance !== null ? balance.toFixed(2) : '—'} SPN
            </Text>
            
            <TouchableOpacity 
              style={styles.fillButton}
              onPress={() => {
                Toast.show({
                  type: 'info',
                  text1: 'Fill Up Requested',
                  text2: 'Please wait for the faucet',
                  position: 'bottom',
                  visibilityTime: 3000,
                });
              }}
            >
              <Text style={styles.fillButtonText}>Fill Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setShowMnemonicModal(true)}
        >
          <Text style={styles.buttonText}>Backup Wallet</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.dangerButton]}
          onPress={() => setShowResetModal(true)}
        >
          <Text style={styles.buttonText}>Reset Wallet</Text>
        </TouchableOpacity>
      </View>
      
      {renderMnemonicModal()}
      {renderResetModal()}
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
    marginBottom: 30,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 12,
    padding: 20,
  },
  addressCard: {
    backgroundColor: 'rgba(30, 40, 60, 0.6)',
    marginBottom: 20,
    alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: 'rgba(30, 40, 60, 0.3)',
  },
  addressLabel: {
    color: colors.text.secondary,
    fontSize: 14,
    fontFamily: fonts.orbitron.regular,
    marginBottom: 10,
  },
  addressText: {
    color: colors.white,
    fontSize: 22,
    fontFamily: fonts.orbitron.medium,
    marginBottom: 8,
  },
  copyHint: {
    color: colors.secondary,
    fontSize: 12,
    fontFamily: fonts.orbitron.regular,
    opacity: 0.8,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    color: colors.text.secondary,
    fontSize: 16,
    fontFamily: fonts.orbitron.regular,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceAmount: {
    color: colors.white,
    fontSize: 28,
    fontFamily: fonts.orbitron.bold,
  },
  fillButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  fillButtonText: {
    color: colors.text.dark,
    fontSize: 14,
    fontFamily: fonts.orbitron.bold,
  },
  buttonsContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: colors.darkBackground,
    width: '100%',
    height: 60,
    borderRadius: 10,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.orbitron.black,
  },
  dangerButton: {
    backgroundColor: 'rgba(210, 45, 45, 0.25)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors.darkBackground,
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fonts.orbitron.bold,
    textAlign: 'center',
    marginBottom: 20,
  },
  warningContainer: {
    marginBottom: 20,
  },
  warningText: {
    color: colors.text.secondary,
    fontFamily: fonts.orbitron.regular,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  boldText: {
    fontFamily: fonts.orbitron.bold,
    color: colors.white,
  },
  mnemonicContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  mnemonicText: {
    color: colors.secondary,
    fontSize: 16,
    fontFamily: fonts.orbitron.medium,
    lineHeight: 24,
    textAlign: 'center',
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  copyButton: {
    backgroundColor: colors.secondary,
  },
  closeButton: {
    backgroundColor: colors.darkBackground,
  },
  cancelButton: {
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
  },
  modalButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.orbitron.bold,
  },
}); 