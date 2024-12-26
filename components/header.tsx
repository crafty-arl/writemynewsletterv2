"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Menu, X, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { ConnectButton } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { useActiveAccount } from "thirdweb/react";
import { useTheme } from "@/components/theme-provider"
import { LoginPayload, VerifyLoginPayloadParams } from "thirdweb/auth";
import { useRouter } from 'next/navigation';

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

// Declare the global variable outside the component
let globalUniqueId: string | null = null;

export function HeaderComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const account = useActiveAccount();
  const router = useRouter();
  
  const generateUniqueId = (address: string) => {
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
      const char = address.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).slice(0, 8);
  };

  // Poll for wallet and generate ID
  useEffect(() => {
    const checkWallet = async () => {
      if (account?.address && !globalUniqueId) {
        globalUniqueId = generateUniqueId(account.address);
        
        console.log("Wallet address:", account.address);
        console.log("Generated unique ID:", globalUniqueId);
      }
    };

    checkWallet();

    const interval = setInterval(() => {
      if (!account?.address || !globalUniqueId) {
        checkWallet();
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [account]);

  const { theme, setTheme } = useTheme()

  return (
<<<<<<< HEAD
    <header className="sticky top-0 w-full bg-gradient-to-r from-pink-800 to-orange-700 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <h1 className="text-base sm:text-lg font-semibold text-orange-100 whitespace-nowrap">No Code Creative</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link className="text-pink-200 hover:text-orange-200 transition-colors text-sm font-medium" href="/">
              Home
            </Link>
            <Link className="text-pink-200 hover:text-orange-200 transition-colors text-sm font-medium" href="/app">
              Start Writing
=======
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
>>>>>>> bd17043a1184dcbd365c7f5b3bb099553dc21b37
            </Link>
          </nav>
          <div className="flex items-center">
            <div className="hidden sm:block">
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
                      const uniqueId = generateUniqueId(params.payload.address);
                      console.log("Generated unique ID:", uniqueId);
                      
                      const response = await fetch(`/api/login?walletAddress=${params.payload.address}&uniqueId=${uniqueId}`);
                      
                      if (response.redirected) {
                        window.location.href = response.url;
                      } else {
                        const data = await response.json();
                        console.log("Login successful:", data);
                        if (account) {
                          console.log("Account connected:", account.address);
                          setTimeout(() => {
                            console.log("Starting refresh sequence...");
                            router.push('/');
                            console.log("Router navigation triggered");
                            router.refresh();
                            console.log("Router refresh triggered");
                            window.location.reload();
                            console.log("Full page reload triggered");
                          }, 100);
                          console.log("Refresh sequence scheduled");
                        }
                      }
                    } catch (error) {
                      console.error("Login error:", error);
                    }
<<<<<<< HEAD
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
            </div>
            <div className="flex items-center ml-2 space-x-2">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="text-pink-200 hover:text-orange-200"
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <button
                className="md:hidden text-pink-200 hover:text-orange-200 transition-colors p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
=======
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
>>>>>>> bd17043a1184dcbd365c7f5b3bb099553dc21b37
          </div>
        </div>
      </div>
      {isMenuOpen && (
<<<<<<< HEAD
        <div className="md:hidden absolute w-full bg-pink-900 shadow-lg">
          <nav className="container mx-auto px-4 py-3 space-y-3">
            <Link 
              className="block text-pink-200 hover:text-orange-200 transition-colors text-sm font-medium py-2" 
              href="/"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              className="block text-pink-200 hover:text-orange-200 transition-colors text-sm font-medium py-2" 
              href="/app"
              onClick={() => setIsMenuOpen(false)}
            >
              Start Writing
=======
        <div className="md:hidden">
          <nav className="px-4 pt-2 pb-4 space-y-2 bg-pink-50">
            <Link className="block text-pink-700 hover:text-orange-600 transition-colors text-sm py-2 font-medium" href="/">
              Write My Newsletter
            </Link>
            <Link className="block text-pink-700 hover:text-orange-600 transition-colors text-sm py-2 font-medium" href="/gallery">
              Gallery
>>>>>>> bd17043a1184dcbd365c7f5b3bb099553dc21b37
            </Link>
            <div className="sm:hidden py-2">
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
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
// Export the global unique ID for use in other components
export const getGlobalUniqueId = () => globalUniqueId;