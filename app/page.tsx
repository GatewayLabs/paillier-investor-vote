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

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

const pizzaToppings = [
  { id: 0, name: "Pepperoni" },
  { id: 1, name: "Italian sausage" },
  { id: 2, name: "Mushrooms" },
  { id: 3, name: "Green peppers" },
  { id: 4, name: "Onions" },
  { id: 5, name: "Black olives" },
  { id: 6, name: "Spinach" },
  { id: 7, name: "Tomatoes" },
  { id: 8, name: "Artichoke hearts" },
  { id: 9, name: "Jalapeños" },
  { id: 10, name: "Eggplant" },
  { id: 11, name: "Broccoli" },
  { id: 12, name: "Sun-dried tomatoes" },
  { id: 13, name: "Pineapple" },
  { id: 14, name: "Buffalo chicken" },
  { id: 15, name: "BBQ sauce" },
  { id: 16, name: "Goat cheese" },
  { id: 17, name: "Fresh basil" },
  { id: 18, name: "Caramelized onions" },
  { id: 19, name: "Roasted red peppers" },
  { id: 20, name: "Feta cheese" },
  { id: 21, name: "Ricotta" },
  { id: 22, name: "Hot honey" },
];

const contractABI = [
  "function vote(uint256[] toppingIds) public",
  "function getVotes() public view returns (uint256[])",
];

const contractAddress = "0x1234567890123456789012345678901234567890";

const SHIELD_TESTNET_CHAIN_ID = "0xa5b5a";

export default function PizzaToppingsVoting() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [selectedToppings, setSelectedToppings] = useState<number[]>([]);
  const [votingResults, setVotingResults] = useState<
    {
      name: string;
      votes: number;
    }[]
  >(() => pizzaToppings.map((topping) => ({ name: topping.name, votes: 0 })));
  const [contract, setContract] = useState<ethers.Contract>();
  const [currentChainId, setCurrentChainId] = useState<string>();
  const { toast } = useToast();

  useEffect(() => {
    connectWallet();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(ethers.getAddress(accounts[0]));
      updateBalance(accounts[0]);
    } else {
      setAccount("");
      setBalance("0");
    }
  };

  const handleChainChanged = (chainId: string) => {
    setCurrentChainId(chainId);
    connectWallet();
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
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
          pizzaToppings.map((topping) => ({ name: topping.name, votes: 0 }))
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
                  rpcUrls: ["https://rpc.shield-testnet.com"],
                  blockExplorerUrls: ["https://explorer.shield-testnet.com"],
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

  const handleToppingToggle = (toppingId: number) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingId)
        ? prev.filter((id) => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const submitVote = async () => {
    if (selectedToppings.length === 0) {
      toast({
        title: "No toppings selected",
        description: "Please select at least one topping before voting.",
        variant: "destructive",
      });
      return;
    }

    if (contract) {
      try {
        const tx = await contract.vote(selectedToppings);
        await tx.wait();
        toast({
          title: "Vote Submitted",
          description: "Your pizza topping preferences have been recorded!",
        });
        updateVotingResults();
        setSelectedToppings([]);
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
  };

  const updateVotingResults = async () => {
    if (contract) {
      try {
        const votes = await contract.getVotes();
        setVotingResults(
          pizzaToppings.map((topping, index) => ({
            name: topping.name,
            votes: votes[index].toNumber(),
          }))
        );
      } catch (error) {
        console.error("Failed to get voting results:", error);
      }
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#FFF5E6] text-[#4A3200] p-8 ${plusJakartaSans.className}`}
    >
      <style jsx global>{`
        :root {
          --primary: #ff6b35;
          --secondary: #ffd700;
          --background: #fff5e6;
          --text: #4a3200;
          --accent: #ff9f1c;
        }
      `}</style>
      <Card className="max-w-4xl mx-auto bg-[var(--background)] text-[var(--text)] shadow-lg border-2 border-[var(--accent)]">
        <CardHeader className="bg-[var(--primary)] text-white">
          <CardTitle className="text-3xl font-bold">
            What Are Your Favorite Pizza Toppings?
          </CardTitle>
          <CardDescription className="text-[var(--secondary)]">
            Select all that make your mouth water!
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
            <div className="space-y-2">
              <Button
                onClick={account ? disconnectWallet : connectWallet}
                variant="outline"
                className="w-full border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
              >
                {account ? "Disconnect Wallet" : "Connect Wallet"}
              </Button>
              {currentChainId !== SHIELD_TESTNET_CHAIN_ID && (
                <Button
                  onClick={switchToShieldTestnet}
                  variant="outline"
                  className="w-full border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
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
                      variant="outline"
                      className="w-full border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white"
                    >
                      Get Some Testnet Tokens
                    </Button>
                  </Link>
                )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {pizzaToppings.map((topping) => (
              <div
                key={topping.id}
                className={`flex items-center justify-center p-4 rounded-md border-2 cursor-pointer transition-all duration-200 ${
                  selectedToppings.includes(topping.id)
                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                    : "border-[var(--accent)] hover:border-[var(--primary)]"
                }`}
                onClick={() => handleToppingToggle(topping.id)}
              >
                <Label className="cursor-pointer text-center">
                  {topping.name}
                </Label>
              </div>
            ))}
          </div>

          <Button
            disabled={currentChainId !== SHIELD_TESTNET_CHAIN_ID}
            onClick={submitVote}
            className="w-full bg-[var(--accent)] text-white hover:bg-[var(--primary)]"
          >
            Submit Your Vote
          </Button>
          {currentChainId !== SHIELD_TESTNET_CHAIN_ID && (
            <Label className="text-sm text-[var(--text)] opacity-70">
              Please connect to Shield Testnet to proceed
            </Label>
          )}

          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Current Pizza Topping Rankings
            </Label>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={votingResults
                  .sort((a, b) => b.votes - a.votes)
                  .slice(0, 10)}
              >
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  interval={0}
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votes" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-[var(--text)] opacity-70">
          Powered by Pizza Lovers Everywhere
        </CardFooter>
      </Card>
    </div>
  );
}
