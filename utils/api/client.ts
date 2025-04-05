import { ethers } from 'ethers';

export interface LeaderboardEntry {
  address: string;
  points: number;
  rank: number;
}

// Simplified interface with only required fields
export interface AddressInfo {
  coin_balance: string;
  hash: string;
  is_contract: boolean;
  ens_domain_name: string | null;
}

const API_BASE_URL = "https://explorer-superposition-testnet-08ulzj7ibt.t.conduit.xyz/api/v2";

export class ApiClient {
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const mockData: LeaderboardEntry[] = [
      { address: '0x1234567890abcdef1234567890abcdef12345678', points: 9800, rank: 1 },
      { address: '0x2345678901abcdef2345678901abcdef23456789', points: 8500, rank: 2 },
      { address: '0x3456789012abcdef3456789012abcdef34567890', points: 7200, rank: 3 },
      { address: '0x4567890123abcdef4567890123abcdef45678901', points: 6600, rank: 4 },
      { address: '0x5678901234abcdef5678901234abcdef56789012', points: 5800, rank: 5 },
      { address: '0x6789012345abcdef6789012345abcdef67890123', points: 5100, rank: 6 },
    ];
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return mockData;
  }

  async getAddressInfo(address: string): Promise<AddressInfo> {
    try {
      const response = await fetch(`${API_BASE_URL}/addresses/${address}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error("Could not fetch address details.");
    }
  }

  async getBalance(address: string): Promise<number> {
    try {
      const addressInfo = await this.getAddressInfo(address);
      return parseFloat(ethers.formatUnits(addressInfo.coin_balance, 18));
    } catch {
      return 0;
    }
  }
}