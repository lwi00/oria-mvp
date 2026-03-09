import {
  FUJI_CHAIN_ID,
  TOKEN_ADDRESSES,
  TOKEN_DECIMALS,
  VAULT_ADDRESS,
} from "./constants";
import type { ConnectedWallet } from "@privy-io/react-auth";

// ERC-20 transfer(address,uint256) selector
const TRANSFER_SELECTOR = "a9059cbb";

/** Pad a hex string (without 0x) to 64 chars (32 bytes), left-padded with zeros. */
function padLeft(hex: string): string {
  return hex.padStart(64, "0");
}

/** Convert a bigint to a zero-padded 32-byte hex string. */
function uint256Hex(value: bigint): string {
  return padLeft(value.toString(16));
}

/** Convert a 0x-prefixed address to a zero-padded 32-byte hex string. */
function addressHex(addr: string): string {
  return padLeft(addr.slice(2).toLowerCase());
}

/** Encode ERC-20 transfer(address to, uint256 amount) calldata. */
export function encodeErc20Transfer(to: string, amount: bigint): string {
  return "0x" + TRANSFER_SELECTOR + addressHex(to) + uint256Hex(amount);
}

/** Convert a human-readable amount to raw token units (e.g. 100 USDC → 100_000_000n). */
export function parseTokenAmount(amount: number, decimals: number): bigint {
  // Use string math to avoid floating-point precision issues
  const [whole = "0", frac = ""] = String(amount).split(".");
  const fracPadded = frac.padEnd(decimals, "0").slice(0, decimals);
  return BigInt(whole + fracPadded);
}

/**
 * Send an ERC-20 transfer to the vault address using Privy's embedded wallet.
 * Returns the transaction hash on success.
 */
export async function sendErc20Deposit(
  wallet: ConnectedWallet,
  token: string,
  amount: number,
): Promise<string> {
  const tokenAddress = TOKEN_ADDRESSES[token];
  const decimals = TOKEN_DECIMALS[token];
  if (!tokenAddress || decimals === undefined) {
    throw new Error(`Unsupported token: ${token}`);
  }

  // Switch to Fuji if needed
  await wallet.switchChain(FUJI_CHAIN_ID);

  // Get EIP-1193 provider
  const provider = await wallet.getEthereumProvider();

  // Encode transfer calldata
  const rawAmount = parseTokenAmount(amount, decimals);
  const data = encodeErc20Transfer(VAULT_ADDRESS, rawAmount);

  // Send transaction — this triggers the wallet popup
  const txHash = await provider.request({
    method: "eth_sendTransaction",
    params: [
      {
        from: wallet.address,
        to: tokenAddress,
        data,
      },
    ],
  });

  return txHash as string;
}
