"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
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
  investmentFunds,
  contractABI,
  SHIELD_TESTNET_CHAIN_ID,
  contractAddress,
  publicKey,
} from "./helpers";
import { decryptVotes } from "./actions";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExternalLink } from "lucide-react";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function Voting() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [hasVoted, setHasVoted] = useState(false);
  const [votingResults, setVotingResults] = useState<
    {
      id: number;
      name: string;
      votes: number | undefined;
    }[]
  >([]);
  const [selectedFund, setSelectedFund] = useState<string>();
  const [contract, setContract] = useState<ethers.Contract>();
  const [currentChainId, setCurrentChainId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        setTransactionHash("");
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
        initializeVotingResults();
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

    if (contract && selectedFund) {
      try {
        const encryptedVoteVector = investmentFunds.map((range, i) => {
          const voteValue =
            i === parseInt(selectedFund) ? BigInt(1) : BigInt(0);
          const encryptedVote = publicKey.encrypt(voteValue);
          let hexString = encryptedVote.toString(16);
          if (hexString.length % 2) {
            hexString = "0" + hexString; // Ensure even length
          }
          return "0x" + hexString;
        });

        const tx = await contract.vote(encryptedVoteVector);
        await tx.wait();

        setTransactionHash(tx.hash);
        setIsModalOpen(true);
        updateVotingResults();
        setSelectedFund(undefined);
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
    const initialResults = investmentFunds.map((fund, index) => ({
      id: index,
      name: fund,
      votes: 0,
    }));
    setVotingResults(initialResults);
  };

  const updateVotingResults = async () => {
    try {
      const votes = await decryptVotes();
      const updatedResults = investmentFunds.map((fund, index) => ({
        id: index,
        name: fund,
        votes: votes[index],
      }));
      setVotingResults(updatedResults.sort((a, b) => b.votes - a.votes));
    } catch (error) {
      console.error("Failed to update voting results:", error);
      toast({
        title: "Error",
        description: "Failed to fetch voting results. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#0D0D14] text-white ${plusJakartaSans.className}`}
    >
      {/* Navbar */}
      <nav className="border-b border-gray-800">
        <div className="max-w-screen-2xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="w-32" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-6 py-12 flex flex-col lg:flex-row">
        {/* Left Section - 70% */}
        <div className="w-full lg:w-[70%] lg:pr-12 relative z-10">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Secret Ballot</h1>
              <p className="text-gray-400">
                <span className="font-bold">How it works:</span> Gateway ensures
                true ballot secrecy by encrypting your vote directly on-chain.
                Your vote remains encrypted - even to validators - while still
                being fully usable by smart contracts. This gives the full power
                of blockchain composability while enabling selective disclosure.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="step-1"
                className="bg-[#1A1A24] rounded-lg border border-gray-800"
              >
                <AccordionTrigger className="px-6 text-xl">
                  Step 1: Get tokens for Gateway Shield Testnet
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4">
                    <p className="text-gray-400">
                      To participate in voting, you'll need some tokens from the
                      Gateway Shield Testnet faucet.
                    </p>
                    <Button asChild variant="secondary">
                      <a
                        href="https://faucet.gateway.tech/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        Visit Faucet <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="step-2"
                className="bg-[#1A1A24] rounded-lg border border-gray-800"
              >
                <AccordionTrigger className="px-6 text-xl">
                  Step 2: Connect Your Wallet
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-400">
                          Connected Account
                        </p>
                        <p className="font-mono">
                          {account || "Not connected"}
                        </p>
                      </div>
                      <Button
                        onClick={account ? disconnectWallet : connectWallet}
                        variant="secondary"
                      >
                        {account ? "Disconnect Wallet" : "Connect Wallet"}
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="step-3"
                className="bg-[#1A1A24] rounded-lg border border-gray-800"
              >
                <AccordionTrigger className="px-6 text-xl">
                  Step 3: Cast a confidential vote
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4">
                    <Label className="text-lg">
                      Which investment fund do you prefer the most?
                    </Label>
                    <ScrollArea className="h-[400px] rounded-md border border-gray-800 p-4">
                      <RadioGroup
                        onValueChange={setSelectedFund}
                        className="grid grid-cols-2 gap-4 md:grid-cols-3"
                      >
                        {investmentFunds.map((fund) => (
                          <div key={fund}>
                            <RadioGroupItem
                              value={fund}
                              id={`fund-${fund}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`fund-${fund}`}
                              className="flex items-center justify-center rounded-md border-2 border-gray-800 bg-[#1A1A24] p-4 hover:bg-[#252533] peer-data-[state=checked]:border-purple-500 [&:has([data-state=checked])]:border-purple-500"
                            >
                              {fund}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </ScrollArea>
                    <Button
                      onClick={submitVote}
                      disabled={!selectedFund || !account}
                      variant="secondary"
                      className="w-full"
                    >
                      Cast Vote
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="step-4"
                className="bg-[#1A1A24] rounded-lg border border-gray-800"
              >
                <AccordionTrigger className="px-6 text-xl">
                  Step 4: Check the results!
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800">
                          <TableHead className="w-[50px] text-gray-400">
                            Rank
                          </TableHead>
                          <TableHead className="text-gray-400">Fund</TableHead>
                          <TableHead className="text-right text-gray-400">
                            Votes
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {votingResults.map((result, index) => (
                          <TableRow key={result.id} className="border-gray-800">
                            <TableCell className="font-medium">
                              {index + 1}
                            </TableCell>
                            <TableCell>{result.name}</TableCell>
                            <TableCell className="text-right">
                              {result.votes}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="lg:block lg:w-[30%]">
          <img
            src="/image.png"
            alt="Description"
            className="absolute inset-0 h-full object-cover w-[60%] left-[40%]"
            style={{
              maskImage:
                "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
            }}
          />
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="mb-4">Congratulations! 🥳</DialogTitle>
              <DialogDescription className="space-y-4">
                <p>
                  You have successfully cast your vote. All of your data is
                  encrypted!
                </p>
                <p>
                  Check your transaction here:{" "}
                  <a
                    href={`https://gateway-shield-testnet.explorer.caldera.xyz/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary)] hover:text-[var(--secondary)] underline break-all text-sm inline"
                  >
                    {transactionHash}
                  </a>
                </p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
