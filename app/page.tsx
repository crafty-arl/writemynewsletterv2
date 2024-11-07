'use client'

import { HeaderComponent } from "@/components/header";
import { ResponsiveChatInput } from "@/components/responsive-chat-input";
import { FooterComponent } from "@/components/footer";
import { useActiveAccount } from "thirdweb/react";
import { ID } from "appwrite";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/components/theme-provider";

export default function Home() {
  const account = useActiveAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await fetch("/api/checkWalletExist");
        if (response.ok) {
          const data = await response.json();

          if (!data.documents[0]?.username || !data.documents[0]?.email) {
            router.push("/signup");
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

  const handleSubmitAndTest = async (gen_con_type: string, prompt: string) => {
    const docID = ID.unique();
    setIsLoading(true);
    setProgressValue(0);
    try {
      const createDocResponse = await fetch("/api/createDocContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: docID,
          data: {
            gen_con_type,
            wallet_addr: account?.address,
            content_gen_date_time: new Date().toISOString(),
            prompt,
          },
          permissions: ["read(\"any\")"],
        }),
      });

      if (!createDocResponse.ok) {
        console.error("Failed to create document");
      }

      const testApiResponse = await fetch("/api/writeMyNewsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wallet_address: account?.address,
          prompt,
          docID: docID,
        }),
      });

      if (!testApiResponse.ok) {
        console.error("Failed to send test request");
      }
    } catch (error) {
      console.error("Error in handleSubmitAndTest:", error);
    } finally {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        setProgressValue(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          router.push("/library");
        }
      }, 300);
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'} min-h-screen`}>
      <HeaderComponent />
      {account ? (
        <>
          <ResponsiveChatInput onSubmit={handleSubmitAndTest} />
          {isLoading && <Progress value={progressValue} />}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold">Please log in to continue</h2>
        </div>
      )}
      <FooterComponent />
    </div>
  );
}
