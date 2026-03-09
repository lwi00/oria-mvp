"use client";

import { useQuery } from "@tanstack/react-query";
import { useWallets } from "@privy-io/react-auth";
import { TOKEN_ADDRESSES, TOKEN_DECIMALS, FUJI_CHAIN_ID } from "./constants";
import { padLeft } from "./deposit";

// balanceOf(address) selector
const BALANCE_OF_SELECTOR = "0x70a08231";

export function useOnChainBalances() {
  const { wallets } = useWallets();
  const wallet = wallets[0];

  return useQuery({
    queryKey: ["onchain-balances", wallet?.address],
    queryFn: async () => {
      if (!wallet) return null;

      await wallet.switchChain(FUJI_CHAIN_ID);
      const provider = await wallet.getEthereumProvider();
      const balanceOfData =
        BALANCE_OF_SELECTOR + padLeft(wallet.address.slice(2).toLowerCase());

      const [usdcRaw, wavaxRaw] = await Promise.all([
        provider.request({
          method: "eth_call",
          params: [
            { to: TOKEN_ADDRESSES.USDC, data: balanceOfData },
            "latest",
          ],
        }) as Promise<string>,
        provider.request({
          method: "eth_call",
          params: [
            { to: TOKEN_ADDRESSES.WAVAX, data: balanceOfData },
            "latest",
          ],
        }) as Promise<string>,
      ]);

      return {
        USDC:
          Number(BigInt(usdcRaw)) / Math.pow(10, TOKEN_DECIMALS.USDC),
        AVAX:
          Number(BigInt(wavaxRaw)) / Math.pow(10, TOKEN_DECIMALS.WAVAX),
      };
    },
    enabled: !!wallet,
    refetchInterval: 15_000,
    retry: 1,
  });
}
