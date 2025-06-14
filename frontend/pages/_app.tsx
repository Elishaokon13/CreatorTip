import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useState, useMemo } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider, http } from "wagmi";
import type { Chain } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { polygonMumbai } from "wagmi/chains";
import { ChainSelector } from "../components/ChainSelector";

// Define Base Goerli Testnet
const baseGoerliChain = {
  id: 84532,
  name: "Base Goerli",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://goerli.base.org"] },
    public: { http: [process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://goerli.base.org"] }
  },
  blockExplorers: {
    default: { name: "Base Goerli Explorer", url: "https://goerli.basescan.org" }
  },
  testnet: true
};

// Define Lens Chain Testnet
const lensTestnetChain = {
  id: 37111,
  name: "Lens Chain Testnet",
  nativeCurrency: { name: "GRASS", symbol: "GRASS", decimals: 18 },
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_LENS_RPC_URL || "https://rpc.testnet.lens.xyz"] },
    public: { http: [process.env.NEXT_PUBLIC_LENS_RPC_URL || "https://rpc.testnet.lens.xyz"] }
  },
  blockExplorers: {
    default: { name: "Lens Testnet Explorer", url: "https://explorer.testnet.lens.xyz" }
  },
  testnet: true
};

// Available chains
const availableChains: Chain[] = [polygonMumbai, baseGoerliChain, lensTestnetChain];

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  // State for selected chain
  const [selectedChain, setSelectedChain] = useState<Chain>(availableChains[0]);
  // Dynamic Wagmi config based on selected chain
  const wagmiConfig = useMemo(
    () =>
      getDefaultConfig({
        appName: "CreatorTip",
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
        chains: [selectedChain],
        transports: { [selectedChain.id]: http() }
      }),
    [selectedChain]
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="p-4">
            <ChainSelector
              chains={availableChains}
              selectedChain={selectedChain}
              onChainChange={setSelectedChain}
            />
            <Component {...pageProps} />
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
