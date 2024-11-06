'use client'

import { HeaderComponent } from "@/components/header";
import { ResponsiveChatInput } from "@/components/responsive-chat-input";
import { FooterComponent } from "@/components/footer"; // Added FooterComponent import
import { useActiveAccount } from "thirdweb/react"; // Import useActiveAccount hook
import { ID } from "appwrite";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { useTheme } from "@/components/theme-provider"; // Import useTheme hook

export default function Home() {
  const account = useActiveAccount(); // Use the useActiveAccount hook to get the account
  const [isLoading, setIsLoading] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const router = useRouter();
  const { theme } = useTheme(); // Get the current theme from the useTheme hook

  const handleSubmitAndTest = async (gen_con_type: string, prompt: string) => {
    const docID = ID.unique(); // Generate a new unique ID for each submission
    console.log("handleSubmitAndTest called with:", { gen_con_type, prompt });
    setIsLoading(true);
    setProgressValue(0); // Reset progress value when submission starts
    try {
      console.log("Creating document content with docID:", docID);
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

      console.log("createDocResponse status:", createDocResponse.status);
      if (createDocResponse.ok) {
        console.log("Document created successfully");
      } else {
        console.error("Failed to create document");
      }

      console.log("Sending test API call with docID:", docID);
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

      console.log("testApiResponse status:", testApiResponse.status);
      if (testApiResponse.ok) {
        const result = await testApiResponse.json();
        console.log("Test response:", result);
      } else {
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
      }, 300); // Adjust the interval to achieve 30-60 seconds
    }
  };

  console.log("Rendering Home component with account:", account);

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'} min-h-screen`}>
      <HeaderComponent />
      {account ? (
        <>
          <ResponsiveChatInput onSubmit={handleSubmitAndTest} />
          {isLoading && <Progress value={progressValue} />} {/* Render Progress component only when loading */}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h2 className="text-2xl font-bold">Please log in to continue</h2>
        </div>
      )}
      <FooterComponent /> {/* Added FooterComponent */}
    </div>
  );
}
