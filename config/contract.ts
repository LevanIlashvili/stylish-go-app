export const contractABI = [
  "function createGame() external",
  "function hasGame(address player) external view returns (bool)",
  "function getBoard(address player) external view returns (uint64)",
  "function getBoardAsArray(address player) external view returns (uint8[][] memory)",
  "function getPlayerPoints(address player) external view returns (uint32)",
  "function getTotalPlayers() external view returns (uint32)",
  "function setPiece(uint8 x, uint8 y) external",
  "function passTurn() external",
  "function isGameEnded(address player) external view returns (bool)",
  "function getGameResult(address player) external view returns (uint32, uint32, uint8)",
  "function newGame() external",
  "function abandonGame() external",
  "function getTopPlayers(uint32 n) external view returns (address[] memory, uint32[] memory)",
  "function getPlayerRank(address player) external view returns (uint32)"
];

export const contractConfig = {
  address: "0x7d3ed693f76e1495d4206a1e6ef303891c7d652d",
  network: {
    name: "Superposition Testnet",
    rpcUrl: "https://testnet-rpc.superposition.so/",
    chainId: 98985,
    currencySymbol: "SPN",
    blockExplorer: "https://testnet-explorer.superposition.so/",
    chainIdHex: `0x${(98985).toString(16)}`,
  }
}; 