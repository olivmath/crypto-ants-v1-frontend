import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import {
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from "wagmi/chains";
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { useState, useEffect } from "react";

const projectId = "ccfee3e38879715fd1d5ca580a847c76"// process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not defined");
}

const config = getDefaultConfig({
  appName: "Crypto Ants App",
  projectId,
  chains: [sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
