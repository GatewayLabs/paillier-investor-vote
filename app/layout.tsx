import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Secret Ballot - Powered by Gateway Protocol",
  description:
    "Test out encrypted state with secret ballot, powered by Gateway Protocol's compute network.",
};

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
