"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import {
  positiveValueRange,
  negativeValueRange,
  contractABI,
  SHIELD_TESTNET_CHAIN_ID,
  contractAddress,
  publicKey,
} from "./helpers";
import { decryptVotes } from "./actions";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@radix-ui/react-radio-group";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function Voting() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedRange, setSelectedRange] = useState<string>();
  const [votingResults, setVotingResults] = useState<
    {
      name: string;
      votes?: string;
    }[]
  >();
  const [contract, setContract] = useState<ethers.Contract>();
  const [currentChainId, setCurrentChainId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    connectWallet();
    initializeVotingResults();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", connectWallet);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", connectWallet);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const handleChainChanged = (chainId: string) => {
    setCurrentChainId(chainId);
    connectWallet();
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        updateBalance(address);

        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        setCurrentChainId(chainId);

        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setContract(contractInstance);

        updateVotingResults();
        checkIfVoted(contractInstance, address);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        toast({
          title: "Error",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Ethereum wallet not detected",
        description: "Please install MetaMask or another Ethereum wallet.",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "eth_requestAccounts",
          params: [{ eth_accounts: {} }],
        });
        setAccount("");
        setBalance("0");
        setContract(undefined);
        setVotingResults(
          positiveValueRange.concat(negativeValueRange).map((range) => ({
            name: range.name,
            votes: undefined,
          }))
        );
      } catch (error) {
        console.error("Failed to disconnect wallet:", error);
        toast({
          title: "Error",
          description: "Failed to disconnect wallet. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const updateBalance = async (address: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);
    setBalance(ethers.formatEther(balance));
  };

  const switchToShieldTestnet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SHIELD_TESTNET_CHAIN_ID }],
        });
      } catch (switchError) {
        if ((switchError as any).code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: SHIELD_TESTNET_CHAIN_ID,
                  chainName: "Gateway Shield Testnet",
                  nativeCurrency: {
                    name: "Gateway",
                    symbol: "OWN",
                    decimals: 18,
                  },
                  rpcUrls: [
                    "https://gateway-shield-testnet.rpc.caldera.xyz/http",
                  ],
                  blockExplorerUrls: [
                    "https://gateway-shield-testnet.explorer.caldera.xyz",
                  ],
                },
              ],
            });
          } catch (addError) {
            console.error("Failed to add Shield Testnet:", addError);
          }
        }
        console.error("Failed to switch to Shield Testnet:", switchError);
      }
    }
  };

  const checkIfVoted = async (contract: ethers.Contract, account: string) => {
    const vote = await contract.hasVoted(ethers.getAddress(account));
    setHasVoted(vote);
  };

  const submitVote = async () => {
    setLoading(true);

    if (contract && selectedRange) {
      try {
        const encryptedVoteVector = positiveValueRange
          .concat(negativeValueRange)
          .map((range, i) => {
            const voteValue =
              i === parseInt(selectedRange) ? BigInt(1) : BigInt(0);
            const encryptedVote = publicKey.encrypt(voteValue);
            let hexString = encryptedVote.toString(16);
            if (hexString.length % 2) {
              hexString = "0" + hexString; // Ensure even length
            }
            return "0x" + hexString;
          });

        const tx = await contract.vote(encryptedVoteVector);
        const receipt = await tx.wait();

        toast({
          title: "Vote Submitted",
          description:
            "Your investment performance has been recorded! Transaction hash: " +
            receipt.transactionHash,
        });
        updateVotingResults();
        setSelectedRange(undefined);
        setHasVoted(true);
      } catch (error) {
        console.error("Failed to submit vote:", error);
        toast({
          title: "Error",
          description: "Failed to submit vote. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet before voting.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const initializeVotingResults = () => {
    const initialResults = [...positiveValueRange, ...negativeValueRange].map(
      (range) => ({
        name: range.displayName,
        positive: 0,
        negative: 0,
        votes: "0",
      })
    );
    setVotingResults(initialResults);
  };

  const updateVotingResults = async () => {
    try {
      const decryptedVotes = await decryptVotes();
      const updatedResults = [...positiveValueRange, ...negativeValueRange].map(
        (range) => {
          const voteData = decryptedVotes.find(
            (vote: { rangeId: number }) => vote.rangeId === range.id
          ) || { votes: "0" };
          const votes = parseInt(voteData.votes);
          return {
            name: range.displayName,
            positive: range.id < 7 ? votes : 0,
            negative: range.id >= 7 ? votes : 0,
            votes: voteData.votes,
          };
        }
      );
      setVotingResults(updatedResults);
    } catch (error) {
      console.error("Failed to update voting results:", error);
      toast({
        title: "Error",
        description: "Failed to fetch voting results. Please try again.",
        variant: "destructive",
      });
    }
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: any[];
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded shadow">
          <p className="font-bold">{label}</p>
          {data.positive > 0 && (
            <p className="text-[var(--positive)]">Gains: {data.positive}</p>
          )}
          {data.negative > 0 && (
            <p className="text-[var(--negative)]">Losses: {data.negative}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={`min-h-screen bg-[var(--tertiary)] text-[var(--dark)] p-8 ${plusJakartaSans.className}`}
    >
      <style jsx global>{`
        :root {
          --primary: #771ac9;
          --secondary: #e6d5fa;
          --tertiary: #f6f4fa;
          --dark: #212121;
          --white: #fff;
          --positive: #4caf50;
          --negative: #f44336;
        }
      `}</style>
      <Card className="max-w-4xl mx-auto bg-[var(--white)] text-[var(--dark)] shadow-lg">
        <CardHeader className="bg-[var(--primary)] text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">
            Investment Cycle Performance
          </CardTitle>
          <CardDescription className="text-[var(--secondary)]">
            How much money have you made/lost in this cycle?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-[var(--text)] opacity-70">
                Connected Account
              </p>
              <p className="font-mono">{account || "Not connected"}</p>
              <p className="text-sm text-[var(--text)] opacity-70 mt-2">
                Balance
              </p>
              <p>{parseFloat(balance).toFixed(2)} $OWN</p>
            </div>
            <div className="space-y-2 flex flex-col">
              <Button
                onClick={account ? disconnectWallet : connectWallet}
                variant="outline"
                className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--white)]"
              >
                {account ? "Disconnect Wallet" : "Connect Wallet"}
              </Button>
              {currentChainId !== SHIELD_TESTNET_CHAIN_ID && (
                <Button
                  onClick={switchToShieldTestnet}
                  variant="secondary"
                  className="bg-[var(--secondary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--white)]"
                >
                  Change to Shield Testnet
                </Button>
              )}
              {currentChainId === SHIELD_TESTNET_CHAIN_ID &&
                parseFloat(balance) == 0 && (
                  <Link
                    href="https://faucet.gateway.tech"
                    target="_blank"
                    className="block"
                  >
                    <Button
                      variant="secondary"
                      className="bg-[var(--secondary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--white)]"
                    >
                      Get Some Testnet Tokens
                    </Button>
                  </Link>
                )}
            </div>
          </div>

          <RadioGroup onValueChange={setSelectedRange} className="space-y-6">
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-[var(--positive)]">
                Positive Range
              </Label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {positiveValueRange.map((range) => (
                  <div key={range.id}>
                    <RadioGroupItem
                      value={range.id.toString()}
                      id={`range-${range.id}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`range-${range.id}`}
                      className="flex items-center justify-center rounded-md border-2 border-[var(--secondary)] bg-[var(--white)] p-4 hover:bg-[var(--secondary)] peer-data-[state=checked]:border-[var(--positive)] [&:has([data-state=checked])]:border-[var(--positive)]"
                    >
                      {range.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-[var(--negative)]">
                Negative Range
              </Label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {negativeValueRange.map((range) => (
                  <div key={range.id}>
                    <RadioGroupItem
                      value={range.id.toString()}
                      id={`range-${range.id}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`range-${range.id}`}
                      className="flex items-center justify-center rounded-md border-2 border-[var(--secondary)] bg-[var(--white)] p-4 hover:bg-[var(--secondary)] peer-data-[state=checked]:border-[var(--negative)] [&:has([data-state=checked])]:border-[var(--negative)]"
                    >
                      {range.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </RadioGroup>

          <Button
            disabled={
              currentChainId !== SHIELD_TESTNET_CHAIN_ID ||
              !selectedRange ||
              hasVoted ||
              loading
            }
            onClick={submitVote}
            className="w-full bg-[var(--primary)] text-[var(--white)] hover:bg-[var(--secondary)] hover:text-[var(--primary)]"
          >
            {loading ? "Submitting Vote..." : "Submit Vote"}
          </Button>
          {currentChainId !== SHIELD_TESTNET_CHAIN_ID && (
            <Label className="text-sm text-[var(--text)] opacity-70">
              Please connect to Shield Testnet to proceed
            </Label>
          )}
          {hasVoted && (
            <Label className="text-sm text-[var(--text)] opacity-70">
              You have already voted
            </Label>
          )}

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Voting Results</Label>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={votingResults}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine x={0} stroke="#000" />
                <Bar
                  dataKey="negative"
                  fill="var(--negative)"
                  stackId="stack"
                />
                <Bar
                  dataKey="positive"
                  fill="var(--positive)"
                  stackId="stack"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-[var(--text)] opacity-70">
          Powered by Gateway Protocol
        </CardFooter>
      </Card>
    </div>
  );
}
