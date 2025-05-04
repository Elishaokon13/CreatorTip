import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";

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

// Create RainbowKit and Wagmi config
const wagmiConfig = getDefaultConfig({
  appName: "CreatorTip",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [lensTestnetChain],
  transports: {
    [lensTestnetChain.id]: http(),
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
