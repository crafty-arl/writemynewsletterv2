"use client"

import AIEditor from '@/components/ai-editor'
import { useActiveAccount } from "thirdweb/react"
import { HeaderComponent } from '@/components/header'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useState } from 'react'

// Import types from ai-editor.tsx
type Message = {
  text: string;
  sender: 'user' | 'ai';
  timestamp?: number;
}

type Thread = {
  id: string;
  threadId: string;
  name: string;
  content: string;
  messages: Message[];
  sessionId: string;
}

export default function Home() {
  const account = useActiveAccount();
  const [userId, setUserId] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [activeThreadId, setActiveThreadId] = useState<string>('1');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showHtmlCode, setShowHtmlCode] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [isPro, setIsPro] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');

  useEffect(() => {
    if (account) {
      // Get last 4 digits of wallet address and create userId
      const last4Digits = account.address.slice(-4);
      const generatedUserId = `${last4Digits}wmn`;
      setUserId(generatedUserId);

      // Get existing session ID from localStorage if it exists
      const existingSessionId = localStorage.getItem('current_session_id');
      if (existingSessionId) {
        setSessionId(existingSessionId);
      } else {
        // Create a new session ID if none exists
        const timestamp = Date.now();
        const generatedSessionId = `${generatedUserId}_${timestamp}`;
        setSessionId(generatedSessionId);
        localStorage.setItem('current_session_id', generatedSessionId);
      }

      // Log session info for debugging
      console.log(JSON.stringify({
        walletAddress: account.address,
        userId: generatedUserId,
        sessionId: existingSessionId || sessionId
      }, null, 2));
    }
  }, [account]);

  // Handle thread selection
  const handleThreadChange = (threadId: string) => {
    setActiveThreadId(threadId);
  };

  return (
    <>
      {!account && <HeaderComponent />}
      <main className="min-h-screen bg-gradient-to-b from-white to-pink-50">
        {account ? (
          <>
            <div className="container mx-auto px-4 py-4">
              <p className="text-pink-700 font-medium">Connected Wallet: {account.address}</p>
              <p className="text-pink-700 font-medium">User ID: {userId}</p>
              <p className="text-pink-700 font-medium">Session ID: {sessionId}</p>
              <p className="text-pink-700 font-medium">Thread ID: {activeThreadId}</p>
            </div>
            <AIEditor 
              activeThreadId={activeThreadId} 
              onThreadChange={handleThreadChange}
              threads={threads}
              setThreads={setThreads}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              showHtmlCode={showHtmlCode}
              setShowHtmlCode={setShowHtmlCode}
              isPreviewOpen={isPreviewOpen}
              setIsPreviewOpen={setIsPreviewOpen}
              previewMode={previewMode}
              setPreviewMode={setPreviewMode}
              isPro={isPro}
              setIsPro={setIsPro}
              isStreaming={isStreaming}
              setIsStreaming={setIsStreaming}
              streamedResponse={streamedResponse}
              setStreamedResponse={setStreamedResponse}
            />
          </>
        ) : (
          <div className="container mx-auto px-4 py-20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-pink-800 leading-tight">
                  Have a Natural Conversation to Create Your <span className="text-orange-600">Perfect Newsletter</span>
                </h1>
                <p className="text-lg text-pink-700 max-w-xl">
                  Chat naturally with our AI assistant to refine and perfect your newsletter. Share your ideas, get suggestions, and iterate until you're completely satisfied - just like talking to a helpful colleague.
                </p>
                <div className="relative">
                  <p className="text-pink-600 font-medium">
                    Connect your wallet to start your conversation
                  </p>
                  <ArrowUpRight className="absolute -top-12 right-0 text-orange-500 w-12 h-12 animate-bounce" />
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-white rounded-lg shadow-xl p-6 space-y-4">
                  <h3 className="text-2xl font-semibold text-pink-800">Interactive Experience</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-pink-700">
                      <span className="mr-2">💬</span> Natural conversation flow
                    </li>
                    <li className="flex items-center text-pink-700">
                      <span className="mr-2">🔄</span> Real-time content refinement
                    </li>
                    <li className="flex items-center text-pink-700">
                      <span className="mr-2">💡</span> Smart suggestions and improvements
                    </li>
                    <li className="flex items-center text-pink-700">
                      <span className="mr-2">✨</span> Iterative perfection until you're satisfied
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
