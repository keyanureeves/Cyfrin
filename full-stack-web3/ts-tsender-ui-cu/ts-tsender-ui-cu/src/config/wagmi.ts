import { createConfig, http } from "wagmi";
import { mainnet, sepolia, anvil, zksync } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia, anvil, zksync],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [anvil.id]: http(),
    [zksync.id]: http(),
  },
});