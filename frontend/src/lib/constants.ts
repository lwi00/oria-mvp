// Avalanche Fuji testnet
export const FUJI_CHAIN_ID = 43113;
export const FUJI_CHAIN_ID_HEX = "0xA869";

// Fuji testnet token contracts
export const TOKEN_ADDRESSES: Record<string, string> = {
  USDC: "0x5425890298aed601595a70AB815c96711a31Bc65",
  WAVAX: "0xd00ae08403B9bbb9124bB305C09058E32C39A48c",
};

// Token decimals
export const TOKEN_DECIMALS: Record<string, number> = {
  USDC: 6,
  WAVAX: 18,
};

// Vault/treasury address where deposits are sent
export const VAULT_ADDRESS =
  process.env.NEXT_PUBLIC_VAULT_ADDRESS ??
  "0x0000000000000000000000000000000000000000";
