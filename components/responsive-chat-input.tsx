'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Progress } from "@/components/ui/progress";

export function ResponsiveChatInput({ onSubmit }: { onSubmit: (type: string, content: string) => void }) {
  const [inputValue, setInputValue] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const suggestions = [
    "Write an introduction for my newsletter",
    "Create a summary of the latest industry news",
    "Draft a thank you message for my subscribers"
  ];

  useEffect(() => {
    if (isSubmitting) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            router.push("/library");
            return 100;
          }
          return prev + (100 / 30);
        });
      }, 1000);

      return () => clearInterval(progressInterval);
    }
  }, [isSubmitting, router]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSubmit("newsletter", inputValue);
      setInputValue("");
      setIsSubmitting(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Write My Newsletter</h1>
      
      <div className="w-full max-w-2xl relative mb-8">
        <Input 
          type="text" 
          placeholder="Type your content idea..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pr-32 rounded-lg text-lg"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
          <Button size="icon" className="rounded-lg h-12 w-12 border-2 border-pink-500 border-orange-500 shadow-lg" onClick={handleSend}>
            <PaperPlaneIcon className="h-6 w-6" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>

      {isSubmitting && (
        <div className="w-full max-w-2xl mb-8">
          <Progress value={progress} />
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            className="rounded-lg text-lg py-2 px-6 border-2 border-pink-500 border-orange-500 shadow-lg"
            onClick={() => setInputValue(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}