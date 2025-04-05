import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { ethers, ContractTransactionResponse, JsonRpcProvider, Provider, Signer } from 'ethers';
import { useWallet } from './WalletProvider';
import { contractABI, contractConfig } from '../config';
import Toast from 'react-native-toast-message';

interface GameContextType {
  contract: ethers.Contract | null;
  readProvider: Provider | null;
  signer: Signer | null;
  isLoading: boolean;
  isCheckingGame: boolean;
  isCreatingGame: boolean;
  gameError: string | null;
  checkHasGame: () => Promise<boolean>;
  createGame: () => Promise<boolean>;
}

const GameContext = createContext<GameContextType>({
  contract: null,
  readProvider: null,
  signer: null,
  isLoading: false,
  isCheckingGame: false,
  isCreatingGame: false,
  gameError: null,
  checkHasGame: async () => false,
  createGame: async () => false,
});

export const useGame = () => useContext(GameContext);

type GameProviderProps = {
  children: ReactNode;
};

export function GameProvider({ children }: GameProviderProps) {
  const { ethersWallet, isWalletLoaded } = useWallet();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [readProvider, setReadProvider] = useState<Provider | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingGame, setIsCheckingGame] = useState<boolean>(false);
  const [isCreatingGame, setIsCreatingGame] = useState<boolean>(false);
  const [gameError, setGameError] = useState<string | null>(null);

  useEffect(() => {
    if (isWalletLoaded) {
      setIsLoading(true);
      setGameError(null);
      try {
        const jsonRpcProvider = new JsonRpcProvider(contractConfig.network.rpcUrl);
        setReadProvider(jsonRpcProvider);
        let contractConnector: Signer | Provider = jsonRpcProvider;

        if (ethersWallet) {
          const connectedSigner = ethersWallet.connect(jsonRpcProvider);
          setSigner(connectedSigner);
          contractConnector = connectedSigner;
        } else {
          setSigner(null);
        }
        
        const contractInstance = new ethers.Contract(
          contractConfig.address,
          contractABI,
          contractConnector
        );
        setContract(contractInstance);
      } catch (error) {
        setGameError("Failed to initialize game connection.");
        Toast.show({ type: 'error', text1: 'Initialization Error', text2: 'Could not connect to game services.' });
        setContract(null);
        setReadProvider(null);
        setSigner(null);
      }
      setIsLoading(false);
    }
  }, [ethersWallet, isWalletLoaded]);

  const checkHasGame = useCallback(async (): Promise<boolean> => {
    if (!contract || !signer) {
      setGameError("Wallet not connected or contract not ready.");
      return false;
    }
    setIsCheckingGame(true);
    setGameError(null);
    try {
      const signerAddress = await signer.getAddress();
      const result = await contract.hasGame(signerAddress);
      return result;
    } catch (error) {
      setGameError("Could not check if game exists.");
      Toast.show({ type: 'error', text1: 'Contract Error', text2: 'Could not check for active game.' });
      return false;
    } finally {
      setIsCheckingGame(false);
    }
  }, [contract, signer]);

  const createGame = useCallback(async (): Promise<boolean> => {
    if (!contract || !signer) {
      setGameError("Wallet not ready");
      Toast.show({ type: 'error', text1: 'Action Failed', text2: 'Not ready.' });
      return false;
    }
    setIsCreatingGame(true);
    setGameError(null);
    Toast.show({ type: 'info', text1: 'Creating Game', text2: 'Sending transaction...' });
    try {
      const tx: ContractTransactionResponse = await contract.createGame();
      Toast.show({ type: 'info', text1: 'Processing', text2: 'Waiting for confirmation...' });
      await tx.wait();
      Toast.show({ type: 'success', text1: 'Game Created', text2: 'Your new game is ready!' });
      return true;
    } catch (error: any) {
      const message = error?.reason || error?.message || "Failed to create game.";
      setGameError(message);
      Toast.show({ type: 'error', text1: 'Creation Failed', text2: message });
      return false;
    } finally {
      setIsCreatingGame(false);
    }
  }, [contract, signer]);

  return (
    <GameContext.Provider value={{
      contract,
      readProvider,
      signer,
      isLoading,
      isCheckingGame,
      isCreatingGame,
      gameError,
      checkHasGame,
      createGame
    }}>
      {children}
    </GameContext.Provider>
  );
}