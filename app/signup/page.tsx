"use client"

import { HeaderComponent } from "@/components/header";
import { useActiveAccount } from "thirdweb/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ID } from "appwrite";

export default function SignUpPage() {
  const account = useActiveAccount();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkAccountExistence = async () => {
      if (account) {
        try {
          const checkWalletResponse = await fetch(`/api/login?walletAddress=${account.address}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          const checkWalletResult = await checkWalletResponse.json();

          if (checkWalletResult.exists) {
            router.push("/");
          }
        } catch (error) {
          console.error("Error checking wallet existence:", error);
        }
      }
    };

    checkAccountExistence();
  }, [account, router]);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await fetch("/api/checkWalletExist");
        if (response.ok) {
          const data = await response.json();

          // If wallet data exists, redirect to home page
          if (data.documents.length > 0) {
            router.push("/");
          }
        } else {
          console.error("Failed to fetch wallet data");
        }
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchWalletData();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/createDoc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: ID.unique(),
          data: {
            uuid: ID.unique(),
            wallet_addr: account?.address,
            account_created: new Date().toISOString(),
            username: username,
            email: email,
          },
          permissions: ["read(\"any\")"],
        }),
      });

      if (response.ok) {
        alert("Account created successfully!");
        router.push("/");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  if (!account) {
    return (
      <>
        <HeaderComponent />
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-xl text-gray-600">Please connect your wallet to sign up.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeaderComponent />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-800">Write My Newsletter</h2>
              <p className="text-xl text-gray-600">
                A decentralized AI-powered content generator. Your data, safe your way, for all your storytelling needs.
              </p>
              <ul className="list-disc pl-6 space-y-4 text-gray-700 text-lg">
                <li>Secure and decentralized data storage</li>
                <li>AI-powered content generation</li>
                <li>Customizable templates for various storytelling needs</li>
                <li>Full control over your data and privacy</li>
              </ul>
            </div>
            <div className="space-y-8">
              <div className="grid gap-4">
                <Label htmlFor="username" className="text-lg font-semibold">Username</Label>
                <Input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid gap-4">
                <Label htmlFor="email" className="text-lg font-semibold">Email</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button type="submit" className="w-full py-4 text-lg font-semibold bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200">Get Started</Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
