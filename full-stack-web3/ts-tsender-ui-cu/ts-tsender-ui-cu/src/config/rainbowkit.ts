import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, anvil, zksync } from "wagmi/chains";

export const rainbowKitConfig = getDefaultConfig({
  appName: "TSender",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "default_project_id",
  chains: [mainnet, sepolia, anvil, zksync],
  ssr: false
});