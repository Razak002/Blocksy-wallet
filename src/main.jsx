import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import {
  createConfig,
  WagmiConfig,
} from "wagmi";
import { mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { http } from "viem";
import "./index.css";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const { connectors } = getDefaultWallets({
  appName: "Blocksy crypto app",
  projectId: "Blocksyy",
  chains: [mainnet, polygon, optimism, arbitrum],
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  chains: [mainnet, polygon, optimism, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={[mainnet, polygon, optimism, arbitrum]}>
          <App />
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  </StrictMode>
);
