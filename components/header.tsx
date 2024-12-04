"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Menu, X, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";
import { useWalletBalance } from "thirdweb/react";
import { mumbai } from "thirdweb/chains";
import { useTheme } from "@/components/theme-provider"
import { LoginPayload, VerifyLoginPayloadParams } from "thirdweb/auth";

export const dynamic = "force-dynamic";

// Create the client with your clientId
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string, // Replace with your actual clientId
});

const wallets = [
  inAppWallet({
    auth: {
      options: ["email", "phone"],
    },
  }),
  createWallet("io.metamask")
];

export function HeaderComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const account = useActiveAccount();
  const { data: balance } = useWalletBalance({
    client,
    chain: mumbai,
    address: account?.address,
  });
  const { theme, setTheme } = useTheme()

  return (
    <header className="w-full bg-gradient-to-r from-white via-pink-100 to-orange-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-semibold text-pink-800">No Code Creative</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link className="text-pink-700 hover:text-orange-600 transition-colors text-sm font-medium" href="/">
              Write My Newsletter
            </Link>
            <Link className="text-pink-700 hover:text-orange-600 transition-colors text-sm font-medium" href="/gallery">
              Gallery
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <ConnectButton
              client={client}
              wallets={wallets}
              connectModal={{
                size: "compact",
                showThirdwebBranding: false,
              }}
              auth={{
                async doLogin(params: VerifyLoginPayloadParams) {
                  console.log("Do login - Wallet address:", params.payload.address);
                  
                  try {
                    const response = await fetch(`/api/login?walletAddress=${params.payload.address}`);
                    
                    if (response.redirected) {
                      window.location.href = response.url;
                    } else {
                      const data = await response.json();
                      console.log("Login successful:", data);
                      if (account) {
                        console.log("Wallet balance:", balance?.displayValue, balance?.symbol);
                      }
                    }
                  } catch (error) {
                    console.error("Login error:", error);
                  }
                },
                async doLogout() {
                  console.log("Do logout - Hello World!");
                },
                async getLoginPayload(params: { address: string; chainId: number }): Promise<LoginPayload> {
                  return {
                    domain: "example.com",
                    address: params.address,
                    statement: "Sign in with Ethereum to the app.",
                    uri: "https://example.com/login",
                    version: "1",
                    chain_id: params.chainId.toString(),
                    nonce: "123",
                    issued_at: new Date().toISOString(),
                    expiration_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
                    invalid_before: new Date().toISOString(),
                    resources: ["https://example.com/api"],
                  };
                },
                async isLoggedIn(address: string) {
                  console.log("Is logged in - Wallet address:", address);
                  return true;
                },
              }}
            />
            <button
              className="md:hidden text-pink-700 hover:text-orange-600 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Button 
              variant="outline"
              className="border-pink-300 hover:border-orange-300"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="px-4 pt-2 pb-4 space-y-2 bg-pink-50">
            <Link className="block text-pink-700 hover:text-orange-600 transition-colors text-sm py-2 font-medium" href="/">
              Write My Newsletter
            </Link>
            <Link className="block text-pink-700 hover:text-orange-600 transition-colors text-sm py-2 font-medium" href="/gallery">
              Gallery
            </Link>
            <ConnectButton
              client={client}
              wallets={wallets}
              connectModal={{
                size: "compact",
                showThirdwebBranding: false,
              }}
              auth={{
                async doLogin(params: VerifyLoginPayloadParams) {
                  console.log("Do login - Wallet address:", params.payload.address);
                },
                async doLogout() {
                  console.log("Do logout - Hello World!");
                },
                async getLoginPayload(params: { address: string; chainId: number }): Promise<LoginPayload> {
                  return {
                    domain: "example.com",
                    address: params.address,
                    statement: "Sign in with Ethereum to the app.",
                    uri: "https://example.com/login",
                    version: "1",
                    chain_id: params.chainId.toString(),
                    nonce: "123",
                    issued_at: new Date().toISOString(),
                    expiration_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
                    invalid_before: new Date().toISOString(),
                    resources: ["https://example.com/api"],
                  };
                },
                async isLoggedIn(address: string) {
                  console.log("Is logged in - Wallet address:", address);
                  return true;
                },
              }}
            />
          </nav>
        </div>
      )}
    </header>
  )
}