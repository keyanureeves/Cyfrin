import {createWalletClient, custom, createPublicClient, parseEther, defineChain} from "https://esm.sh/viem"
import { contractAddress, abi } from "./constants-js.js";


const connectButton = document.getElementById('connectButton').addEventListener("click", connect);
const fundButton = document.getElementById('fundButton').addEventListener("click", fund);
const getBalanceButton = document.getElementById('balanceButton').addEventListener("click", getBalance);
const ethAmountInput = document.getElementById('ethAmount');

let walletClient
let publicClient
let connectedAccount

async function connect() {
    if (typeof window.ethereum !== 'undefined') {
         walletClient = createWalletClient({
            transport:custom(window.ethereum)// we could add a different type of transp
        })

        const accounts = await walletClient.requestAddresses()
        connectedAccount = accounts[0]
        console.log(`Connected account: ${connectedAccount}`);
    
    } else {
        connectButton.innerText = "Please install a wallet extension like MetaMask";
    }
}

async function fund() {
    const ethAmount = ethAmountInput.value;
    console.log(`Funding with ${ethAmount} ETH`);

     if (typeof window.ethereum !== 'undefined') {
         walletClient = createWalletClient({
            transport:custom(window.ethereum)// we could add a different type of transport
        })

        if (!connectedAccount) { // ✅ Ensure we have an account before funding
            const accounts = await walletClient.getAddresses();
            connectedAccount = accounts[0];
        }

        const currentChain = await getCurrentChain(walletClient);

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });

        console.log(parseEther(ethAmount));

        const {request} = await publicClient.simulateContract({
            //address, abi
            address : contractAddress,
            abi: abi,
            functionName: 'fund',
            account: connectedAccount,
            chain: currentChain, 
            value:parseEther(ethAmount),
        })

        // console.log({request});
        const txHash = await walletClient.writeContract(request);
        console.log(`Transaction sent: ${txHash}`);


    
    } else {
        connectButton.innerText = "Please install a wallet extension like MetaMask";
    }
}

async function getBalance(){
    //get balance logic goes here 
}

async function getCurrentChain  (client){
    const chainId = await client.getChainId()
    const currentChain = defineChain({
        id: chainId,
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
        },

        rpcUrls: {
            default: {
                https: ["https://localhost:"],
            },
        },
    })

    return currentChain
}





connectButton.onclick = connect;
fundButton.onclick = fund;


