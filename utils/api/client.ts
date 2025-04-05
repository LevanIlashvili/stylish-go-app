export interface LeaderboardEntry {
  address: string;
  points: number;
  rank: number;
}

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
    // delay for few hundred ms
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return mockData;
  }
} 