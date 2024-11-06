"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Pen, Menu, X, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";
import { useWalletBalance } from "thirdweb/react";
import { mumbai } from "thirdweb/chains";
import { useTheme } from "@/components/theme-provider"
import { LoginPayload, VerifyLoginPayloadParams } from "thirdweb/auth";

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
    <header className="w-full bg-gradient-to-r from-pink-800 to-orange-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Pen className="h-5 w-5 text-orange-200" />
            <h1 className="text-base font-semibold text-orange-100">WriteMyNewsletter</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link className="text-pink-200 hover:text-orange-200 transition-colors text-sm" href="/">
              Create
            </Link>
            <Link className="text-pink-200 hover:text-orange-200 transition-colors text-sm" href="/library">
              Library
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
              className="md:hidden text-pink-200 hover:text-orange-200 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Button 
              variant="outline"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="px-4 pt-2 pb-4 space-y-2 bg-pink-900">
            <Link className="block text-pink-200 hover:text-orange-200 transition-colors text-sm py-2" href="/">
              Create
            </Link>
            <Link className="block text-pink-200 hover:text-orange-200 transition-colors text-sm py-2" href="/library">
              Library
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