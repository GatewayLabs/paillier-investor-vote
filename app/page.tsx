'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast, useToast } from '@/hooks/use-toast';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });

// Mock data for investment funds
const investmentFunds = [
  { id: 1, name: 'DeFi Growth Fund' },
  { id: 2, name: 'NFT Innovation Fund' },
  { id: 3, name: 'Web3 Infrastructure Fund' },
];

// Mock smart contract ABI (replace with your actual ABI)
const contractABI = [
  'function requestTokens() public',
  'function vote(uint256 fundId) public',
  'function getVotes() public view returns (uint256[])',
];

const contractAddress = '0x1234567890123456789012345678901234567890'; // Replace with your contract address

export default function InvestmentFundVoting() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [selectedFund, setSelectedFund] = useState('');
  const [votingResults, setVotingResults] = useState([]);
  const [contract, setContract] = useState<ethers.Contract>();
  const { toast } = useToast();

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const balance = await provider.getBalance(address);
        setBalance(ethers.formatEther(balance));

        const contractInstance = new ethers.Contract(
          contractAddress,
          contractABI,
          signer,
        );
        setContract(contractInstance);

        updateVotingResults();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        toast({
          title: 'Error',
          description: 'Failed to connect wallet. Please try again.',
          variant: 'destructive',
        });
      }
    } else {
      toast({
        title: 'Ethereum wallet not detected',
        description: 'Please install MetaMask or another Ethereum wallet.',
        variant: 'destructive',
      });
    }
  };

  const requestTokens = async () => {
    if (contract) {
      try {
        const tx = await contract.requestTokens();
        await tx.wait();
        toast({
          title: 'Tokens Requested',
          description: 'Tokens have been sent to your account.',
        });
        // Update balance after receiving tokens
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(account);
        setBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error('Failed to request tokens:', error);
        toast({
          title: 'Error',
          description: 'Failed to request tokens. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const vote = async () => {
    if (contract && selectedFund) {
      try {
        const tx = await contract.vote(selectedFund);
        await tx.wait();
        toast({
          title: 'Vote Submitted',
          description: 'Your vote has been recorded successfully.',
        });
        updateVotingResults();
      } catch (error) {
        console.error('Failed to vote:', error);
        toast({
          title: 'Error',
          description: 'Failed to submit vote. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const updateVotingResults = async () => {
    if (contract) {
      try {
        const votes = await contract.getVotes();
        setVotingResults(
          votes.map((v: any, i: number) => ({
            name: investmentFunds[i].name,
            votes: v.toNumber(),
          })),
        );
      } catch (error) {
        console.error('Failed to get voting results:', error);
      }
    }
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
        }
      `}</style>
      <Card className="max-w-4xl mx-auto bg-[var(--white)] text-[var(--dark)] shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Web3 Investment Fund Voting
          </CardTitle>
          <CardDescription>
            Connect your wallet, choose a fund, and cast your vote
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400">Connected Account</p>
              <p className="font-mono">{account || 'Not connected'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Balance</p>
              <p>{parseFloat(balance).toFixed(4)} ETH</p>
            </div>
            <Button
              onClick={connectWallet}
              variant="outline"
              className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--white)]"
            >
              {account ? 'Switch Wallet' : 'Connect Wallet'}
            </Button>
          </div>

          {parseFloat(balance) === 0 && (
            <Button
              onClick={requestTokens}
              variant="secondary"
              className="bg-[var(--secondary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--white)]"
            >
              Request Tokens
            </Button>
          )}

          <div className="space-y-4">
            <Label className="text-lg font-semibold">
              Select an Investment Fund
            </Label>
            <RadioGroup
              onValueChange={setSelectedFund}
              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              {investmentFunds.map((fund) => (
                <div key={fund.id}>
                  <RadioGroupItem
                    value={fund.id.toString()}
                    id={`fund-${fund.id}`}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={`fund-${fund.id}`}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-[var(--secondary)] bg-[var(--white)] p-4 hover:bg-[var(--secondary)] peer-data-[state=checked]:border-[var(--primary)] [&:has([data-state=checked])]:border-[var(--primary)]"
                  >
                    {fund.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button
            onClick={vote}
            disabled={!selectedFund}
            className="w-full bg-[var(--primary)] text-[var(--white)] hover:bg-[var(--secondary)] hover:text-[var(--primary)]"
          >
            Cast Vote
          </Button>

          <div className="space-y-4">
            <Label className="text-lg font-semibold">Voting Results</Label>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={votingResults}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votes" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-gray-400">
          Powered by Web3 Technology
        </CardFooter>
      </Card>
    </div>
  );
}
