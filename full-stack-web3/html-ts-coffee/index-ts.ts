import {
  createWalletClient,
  custom,
  createPublicClient,
  parseEther,
  defineChain,
  formatEther,
  type WalletClient,
  type PublicClient,
} from "viem";


import "viem/window";




import { contractAddress, abi } from "./constants-js.js"; // if you convert this later, rename to .ts

// // Extend the global `window` type to include `ethereum`
// declare global {
//   interface Window {
//     ethereum?: any;
//   }
// }

// Global variables
let walletClient: WalletClient | undefined;
let publicClient: PublicClient | undefined;
let connectedAccount: `0x${string}` | undefined;

let connectButton: HTMLButtonElement | null;
let fundButton: HTMLButtonElement | null;
let getBalanceButton: HTMLButtonElement | null;
let ethAmountInput: HTMLInputElement | null;
let withdrawButton: HTMLButtonElement | null;

// --- DOM Setup ---
document.addEventListener("DOMContentLoaded", () => {
  // Get elements
  connectButton = document.getElementById("connectButton") as HTMLButtonElement;
  fundButton = document.getElementById("fundButton") as HTMLButtonElement;
  getBalanceButton = document.getElementById(
    "balanceButton"
  ) as HTMLButtonElement;
  ethAmountInput = document.getElementById("ethAmount") as HTMLInputElement;
  withdrawButton = document.getElementById("withdrawButton") as HTMLButtonElement;

  // Add event listeners
  connectButton?.addEventListener("click", connect);
  fundButton?.addEventListener("click", fund);
  getBalanceButton?.addEventListener("click", getBalance);
  withdrawButton?.addEventListener("click", withdraw);
});

// --- Functions ---

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    const accounts = await walletClient.requestAddresses();
    connectedAccount = accounts[0];
    console.log(`Connected account: ${connectedAccount}`);
  } else {
    if (connectButton)
      connectButton.innerText = "Please install a wallet extension like MetaMask";
  }
}

async function fund() {
  if (!ethAmountInput) return;
  const ethAmount = ethAmountInput.value;
  console.log(`Funding with ${ethAmount} ETH`);

  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    if (!connectedAccount) {
      const accounts = await walletClient.getAddresses();
      connectedAccount = accounts[0];
    }

    const currentChain = await getCurrentChain(walletClient);

    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    const { request } = await publicClient.simulateContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: "fund",
      account: connectedAccount!,
      chain: currentChain,
      value: parseEther(ethAmount),
    });

    const txHash = await walletClient.writeContract(request);
    console.log(`Transaction sent: ${txHash}`);
  } else {
    if (connectButton)
      connectButton.innerText = "Please install a wallet extension like MetaMask";
  }
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    walletClient = createWalletClient({
      transport: custom(window.ethereum),
    });

    if (!connectedAccount) {
      const accounts = await walletClient.getAddresses();
      connectedAccount = accounts[0];
    }

    const currentChain = await getCurrentChain(walletClient);

    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    const { request } = await publicClient.simulateContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: "withdraw",
      account: connectedAccount!,
      chain: currentChain,
    });

    const txHash = await walletClient.writeContract(request);
    console.log(`Transaction sent: ${txHash}`);
  } else {
    if (connectButton)
      connectButton.innerText = "Please install a wallet extension like MetaMask";
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    publicClient = createPublicClient({
      transport: custom(window.ethereum),
    });

    const balance = await publicClient.getBalance({
      address: contractAddress as `0x${string}`,
    });

    console.log(`Balance of contract ${contractAddress}:`);
    console.log(formatEther(balance));
  }
}

async function getCurrentChain(client: WalletClient | PublicClient) {
  const chainId = await client.getChainId();

  const currentChain = defineChain({
    id: chainId,
    name: `Localhost Chain ${chainId}`,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [`https://localhost:${chainId}`], // changed 'https' to 'http'
      },
    },
  });

  return currentChain;
}
