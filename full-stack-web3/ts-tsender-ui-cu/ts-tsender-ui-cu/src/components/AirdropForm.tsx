"use client";

import InputField from "@/components/ui/InputField";
import { useMemo, useState } from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi";
import { readContract } from "@wagmi/core";
import { calculateTotal } from "@/utils";

export default function AirdropForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const total: number = useMemo(() => calculateTotal(amounts), [amounts]);
  const { data: hash, isPending, writeContractAsync } = useWriteContract();

  async function getApprovedAmount(
    tSenderAddress: string | null
  ): Promise<number> {
    if (!tSenderAddress || !tokenAddress || !account.address) {
      return 0;
    }

    try {
      const response = await readContract(config, {
        abi: erc20Abi,
        address: tokenAddress.trim() as `0x${string}`,
        functionName: "allowance",
        args: [account.address, tSenderAddress.trim() as `0x${string}`],
      });

      return Number(response || 0);
    } catch (error) {
      console.error("Error reading allowance:", error);
      return 0;
    }
  }

  async function handleSubmit() {
    const tSenderAddress = chainsToTSender[chainId]["tsender"];
    const approvedAmount = await getApprovedAmount(tSenderAddress);
    console.log("Approved Amount:", approvedAmount);

    if (approvedAmount < total) {
      const approvalHash = await writeContractAsync({
        abi: erc20Abi,
        address: tokenAddress.trim() as `0x${string}`,
        functionName: "approve",
        args: [tSenderAddress as `0x${string}`, BigInt(total)],
      });

      console.log("Approval Tx Hash:", approvalHash);
    }

    
  }

  return (
    <div className="flex flex-col gap-4">
      <InputField
        label="Token Address"
        placeholder="0x..."
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />

      <InputField
        label="Recipients"
        placeholder="0x123, 0x456, 0x789"
        value={recipients}
        onChange={(e) => setRecipients(e.target.value)}
        large={true}
      />

      <InputField
        label="Amounts"
        placeholder="100, 200, 300"
        value={amounts}
        onChange={(e) => setAmounts(e.target.value)}
        large={true}
      />

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="p-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        {isPending ? "Processing..." : "Send Tokens"}
      </button>
    </div>
  );
}
