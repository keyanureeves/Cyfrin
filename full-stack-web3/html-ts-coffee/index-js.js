import {createWalletClient, custom, createPublicClient, parseEther, defineChain, formatEther} from "https://esm.sh/viem"
import { contractAddress, abi } from "./constants-js.js";


// const connectButton = document.getElementById('connectButton').addEventListener("click", connect);
// const fundButton = document.getElementById('fundButton').addEventListener("click", fund);
// const getBalanceButton = document.getElementById('balanceButton').addEventListener("click", getBalance);
// const ethAmountInput = document.getElementById('ethAmount');

let walletClient
let publicClient
let connectedAccount
let connectButton, fundButton, getBalanceButton, ethAmountInput, withdrawButton;


//creating the dom

document.addEventListener("DOMContentLoaded", () => {
    //getting actual elements references
    connectButton = document.getElementById('connectButton');
    fundButton = document.getElementById('fundButton');
    getBalanceButton = document.getElementById('balanceButton');
    ethAmountInput = document.getElementById('ethAmount');
    withdrawButton = document.getElementById('withdrawButton');
 

    //adding event listeners
    connectButton.addEventListener("click", connect);
    fundButton.addEventListener("click", fund);
    getBalanceButton.addEventListener("click", getBalance);
    withdrawButton.addEventListener("click", withdraw);
   
});



async function connect() {
    if (typeof window.ethereum !== 'undefined') {  // window.ethereum
        
         walletClient = createWalletClient({
            transport:custom(window.ethereum)// we could add a different type of transp
        })

        const accounts = await walletClient.requestAddresses()
        connectedAccount = accounts[0]
        console.log(`Connected account: ${connectedAccount}`); // change inner text 

    
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
            connectedAccount = accounts[0]; // connecting to metamask again 
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

async function withdraw () {
    if (typeof window.ethereum !== 'undefined') {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        });

        if (!connectedAccount){
            const accounts = await walletClient.getAddresses();
            connectedAccount = accounts[0];
        }

        const currentChain = await getCurrentChain(walletClient);

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        });

        const {request} = await publicClient.simulateContract({
            address: contractAddress,
            abi: abi,
            functionName: 'withdraw',
            account: connectedAccount,
            chain: currentChain,

        });

        const txHash = await walletClient.writeContract(request);
        console.log(`Transaction sent: ${txHash}`);

    } else {
        connectButton.innerText = "Please install a wallet extension like MetaMask";
    }
}

async function getBalance(){
    //get balance logic goes here 

     if (typeof window.ethereum !== 'undefined') {
         publicClient = createPublicClient({
            transport:custom(window.ethereum)// we could add a different type of transp
        })

        const balance = await publicClient.getBalance({
            address: contractAddress,
            // chain: await getCurrentChain(publicClient)
        });
        console.log(`Balance of contract ${contractAddress}:`);
        
        console.log(formatEther(balance));
     }
   
    
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





// connectButton.onclick = connect;
// fundButton.onclick = fund;
// getBalanceButton.onclick = getBalance;


