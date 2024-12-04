'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PlusCircle, Send, Copy, MessageSquare, Sparkles, Smartphone, Monitor, X, Crown } from 'lucide-react'
import { HeaderComponent } from '@/components/header'
import { motion, AnimatePresence } from 'framer-motion'

// Update the message type definition
type Message = {
  text: string;
  sender: 'user' | 'ai';
  timestamp?: number;
}

// Update the thread type definition to include sessionId and threadId
type Thread = {
  id: string;
  threadId: string; // Added threadId
  name: string;
  content: string;
  messages: Message[];
  sessionId: string;
}

// Update sample newsletters to include threadId
const sampleNewsletters = [
  {
    id: '1',
    threadId: 'thread_tech_1', // Added unique threadId
    name: 'Weekly Tech Digest',
    content: `
      <div style="max-width: 100%; word-wrap: break-word;">
        <h1 style="color: #333; font-family: 'Poppins', sans-serif;">Weekly Tech Digest</h1>
        <p style="color: #666; font-family: 'Poppins', sans-serif;">Hello tech enthusiasts!</p>
        <h2 style="color: #0066cc; font-family: 'Poppins', sans-serif;">This week's highlights:</h2>
        <ul style="color: #333; font-family: 'Poppins', sans-serif;">
          <li>AI breakthroughs in natural language processing</li>
          <li>The latest smartphone releases and reviews</li>
          <li>Cybersecurity tips for remote work</li>
        </ul>
        <p style="color: #666; font-family: 'Poppins', sans-serif;">Stay tuned for more exciting tech news!</p>
      </div>
    `,
    messages: [] as Message[],
    sessionId: `tech_${Date.now()}`
  },
  {
    id: '2',
    threadId: 'thread_fitness_1', // Added unique threadId
    name: 'Monthly Fitness Update',
    content: `
      <div style="max-width: 100%; word-wrap: break-word;">
        <h1 style="color: #2ecc71; font-family: 'Poppins', sans-serif;">Monthly Fitness Update</h1>
        <p style="color: #333; font-family: 'Poppins', sans-serif;">Greetings health enthusiasts!</p>
        <h2 style="color: #27ae60; font-family: 'Poppins', sans-serif;">This month's focus:</h2>
        <ol style="color: #333; font-family: 'Poppins', sans-serif;">
          <li>The benefits of high-intensity interval training (HIIT)</li>
          <li>Nutrition tips for muscle recovery</li>
          <li>Mindfulness and its impact on physical health</li>
        </ol>
        <p style="color: #333; font-family: 'Poppins', sans-serif;">Remember, your health is your wealth!</p>
      </div>
    `,
    messages: [] as Message[],
    sessionId: `fitness_${Date.now()}`
  },
  {
    id: '3',
    threadId: 'thread_business_1', // Added unique threadId
    name: 'Quarterly Business Insights',
    content: `
      <div style="max-width: 100%; word-wrap: break-word;">
        <h1 style="color: #34495e; font-family: 'Poppins', sans-serif;">Quarterly Business Insights</h1>
        <p style="color: #555; font-family: 'Poppins', sans-serif;">Dear valued stakeholders,</p>
        <h2 style="color: #2980b9; font-family: 'Poppins', sans-serif;">Q2 2023 Highlights:</h2>
        <ul style="color: #333; font-family: 'Poppins', sans-serif;">
          <li>Market analysis and trends</li>
          <li>Financial performance overview</li>
          <li>Upcoming strategic initiatives</li>
        </ul>
        <p style="color: #555; font-family: 'Poppins', sans-serif;">Together, we're building a stronger future.</p>
      </div>
    `,
    messages: [] as Message[],
    sessionId: `business_${Date.now()}`
  }
]

export default function AIEditor() {
  const [activeThread, setActiveThread] = useState('1')
  const [threads, setThreads] = useState(sampleNewsletters)
  const [inputMessage, setInputMessage] = useState('')
  const [showHtmlCode, setShowHtmlCode] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewMode, setPreviewMode] = useState('desktop')
  const [isPro, setIsPro] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamedResponse, setStreamedResponse] = useState('')

  const activeNewsletter = threads.find(t => t.id === activeThread) || threads[0]

  // Update useEffect to sync with page.tsx session and thread IDs
  useEffect(() => {
    const currentSessionId = localStorage.getItem('current_session_id');
    const currentThreadId = localStorage.getItem('current_thread_id');
    if (currentSessionId && currentThreadId) {
      setThreads(prevThreads => prevThreads.map(thread => ({
        ...thread,
        sessionId: currentSessionId,
        threadId: currentThreadId
      })));
    }
  }, []);

  // Update useEffect to handle both session and thread ID changes
  useEffect(() => {
    if (activeThread) {
      const activeThreadData = threads.find(t => t.id === activeThread);
      if (activeThreadData?.sessionId && activeThreadData?.threadId) {
        localStorage.setItem('current_session_id', activeThreadData.sessionId);
        localStorage.setItem('current_thread_id', activeThreadData.threadId);
      }
    }
  }, [activeThread, threads]);

  const simulateStreaming = (text: string) => {
    setIsStreaming(true)
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setStreamedResponse(prev => prev + text[index])
        index++
      } else {
        clearInterval(interval)
        const updatedThreads = threads.map(thread =>
          thread.id === activeThread
            ? { ...thread, messages: [...thread.messages, { text: text, sender: 'ai' }] }
            : thread
        )
        setThreads(updatedThreads)
        setIsStreaming(false)
        setStreamedResponse('')
      }
    }, 20)
  }

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userMessage: Message = {
        text: inputMessage,
        sender: 'user',
        timestamp: Date.now()
      }

      // Update the thread with the new message
      const updatedThreads = threads.map(thread =>
        thread.id === activeThread
          ? {
              ...thread,
              messages: [...thread.messages, userMessage]
            }
          : thread
      )
      setThreads(updatedThreads)
      setInputMessage('')

      // Simulate AI response
      const aiResponse = `I've added your content: "${inputMessage}". What else would you like to add to the newsletter?`
      setTimeout(() => {
        const aiMessage: Message = {
          text: aiResponse,
          sender: 'ai',
          timestamp: Date.now()
        }
        
        // Update threads with AI response
        setThreads(prevThreads => 
          prevThreads.map(thread =>
            thread.id === activeThread
              ? {
                  ...thread,
                  messages: [...thread.messages, aiMessage]
                }
              : thread
          )
        )
      }, 500)
    }
  }

  const handleNewThread = () => {
    const currentSessionId = localStorage.getItem('current_session_id');
    const newThreadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newThread = {
      id: (threads.length + 1).toString(),
      threadId: newThreadId,
      name: `New Newsletter ${threads.length + 1}`,
      content: '<div style="max-width: 100%; word-wrap: break-word;"><h1>New Newsletter</h1><p>Start typing your content here...</p></div>',
      messages: [] as Message[],
      sessionId: currentSessionId || `newsletter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    setThreads([...threads, newThread])
    setActiveThread(newThread.id)
    localStorage.setItem('current_thread_id', newThreadId)
  }

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(activeNewsletter.content)
      .then(() => alert('HTML copied to clipboard!'))
      .catch(err => console.error('Failed to copy HTML: ', err))
  }

  // Optional: Add useEffect to persist messages to localStorage
  useEffect(() => {
    const savedThreads = localStorage.getItem('newsletter-threads')
    if (savedThreads) {
      setThreads(JSON.parse(savedThreads))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('newsletter-threads', JSON.stringify(threads))
  }, [threads])

  // Update the thread selection handler to include threadId
  const handleThreadClick = (threadId: string) => {
    setActiveThread(threadId);
    const selectedThread = threads.find(t => t.id === threadId);
    if (selectedThread?.sessionId && selectedThread?.threadId) {
      localStorage.setItem('current_session_id', selectedThread.sessionId);
      localStorage.setItem('current_thread_id', selectedThread.threadId);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <HeaderComponent />
      
      {/* Pro Subscription Button */}
      <div className="fixed top-20 right-4 z-50">
        <Button
          onClick={() => setIsPro(!isPro)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white shadow-lg rounded-full px-6"
        >
          <Crown className="h-4 w-4 mr-2" />
          {isPro ? 'Pro Active' : 'Upgrade to Pro'}
        </Button>
      </div>
      
      {/* Main Editor Area */}
      <div className="flex flex-1 p-4">
        <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl flex overflow-hidden">
          {/* Left sidebar: Threads */}
          <div className="hidden md:flex w-72 border-r border-gray-100 flex-col bg-white/80 backdrop-blur-sm">
            <div className="p-6 border-b border-gray-100">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">WriteMyNewsletter</h1>
            </div>
            <div className="flex-1 overflow-auto">
              <ScrollArea className="h-full px-3">
                {threads.map(thread => (
                  <Button
                    key={thread.id}
                    variant={activeThread === thread.id ? "secondary" : "ghost"}
                    className={`w-full justify-start px-4 py-3 text-left mb-2 rounded-xl transition-all ${
                      activeThread === thread.id ? 'shadow-md bg-gradient-to-r from-pink-100 to-purple-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleThreadClick(thread.id)}
                  >
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center">
                        <Sparkles className="mr-2 h-4 w-4" />
                        {thread.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 truncate w-full">
                        Thread ID: {thread.threadId}
                      </div>
                    </div>
                  </Button>
                ))}
              </ScrollArea>
            </div>
            <div className="p-4 border-t border-gray-100">
              <Button onClick={handleNewThread} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Newsletter
              </Button>
            </div>
          </div>

          {/* Mobile Thread Selector */}
          <div className="md:hidden p-4 border-b border-gray-100">
            <select 
              className="w-full p-2 border rounded-xl bg-white shadow-sm"
              value={activeThread}
              onChange={(e) => {
                setActiveThread(e.target.value)
              }}
            >
              {threads.map(thread => (
                <option key={thread.id} value={thread.id}>
                  {thread.name}
                </option>
              ))}
            </select>
          </div>

          {/* Middle and Right sections */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-gray-50/30">
            {/* Chat History */}
            <div className="flex-1 flex flex-col min-h-0">
              <ScrollArea className="flex-1 p-6">
                {activeNewsletter.messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-6 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                  >
                    <div
                      className={`inline-block p-4 rounded-2xl max-w-[80%] shadow-md ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                          : 'bg-white'
                      }`}
                    >
                      {message.text}
                    </div>
                  </motion.div>
                ))}
                {isStreaming && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-left"
                  >
                    <div className="inline-block p-4 rounded-2xl max-w-[80%] shadow-md bg-white">
                      {streamedResponse}
                    </div>
                  </motion.div>
                )}
              </ScrollArea>
              <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your newsletter content..."
                    className="rounded-xl shadow-sm border-gray-200 focus:ring-pink-500 focus:border-pink-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-md">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Preview Panel */}
            <div className="border-t lg:border-l lg:border-t-0 border-gray-100 h-1/2 lg:h-auto lg:w-1/3 bg-white flex flex-col">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {showHtmlCode ? 'HTML Code' : 'Newsletter Preview'}
                </h2>
                <div className="flex items-center space-x-3">
                  <Switch
                    id="show-html"
                    checked={showHtmlCode}
                    onCheckedChange={setShowHtmlCode}
                    className="data-[state=checked]:bg-pink-500"
                  />
                  <Label htmlFor="show-html" className="text-gray-600">Show HTML</Label>
                  <Button 
                    variant="outline"
                    onClick={() => setIsPreviewOpen(true)}
                    className="ml-2"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="flex-1 p-6">
                {showHtmlCode ? (
                  <pre className="text-sm bg-gray-50 p-4 rounded-xl whitespace-pre-wrap break-all">
                    <code>{activeNewsletter.content}</code>
                  </pre>
                ) : (
                  <div
                    className="prose prose-pink max-w-none"
                    style={{ 
                      width: '100%',
                      maxWidth: '100%',
                      overflowWrap: 'break-word',
                      wordWrap: 'break-word'
                    }}
                    dangerouslySetInnerHTML={{ __html: activeNewsletter.content }}
                  />
                )}
              </ScrollArea>
              <Separator className="bg-gray-100" />
              <div className="p-4">
                <Button variant="outline" onClick={handleCopyHtml} className="w-full rounded-xl border-gray-200 hover:bg-gray-50 hover:border-pink-500 transition-colors">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy HTML
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Button
                    variant={previewMode === 'desktop' ? 'secondary' : 'ghost'}
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    Desktop
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'secondary' : 'ghost'}
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Mobile
                  </Button>
                </div>
                <Button variant="ghost" onClick={() => setIsPreviewOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-gray-50">
                <div className={`bg-white shadow-2xl transition-all duration-300 ${
                  previewMode === 'mobile' ? 'w-[375px] h-[667px]' : 'w-full max-w-4xl'
                } rounded-lg overflow-auto`}>
                  <div 
                    className="p-6" 
                    style={{ 
                      width: '100%',
                      maxWidth: '100%',
                      overflowWrap: 'break-word',
                      wordWrap: 'break-word'
                    }}
                    dangerouslySetInnerHTML={{ __html: activeNewsletter.content }} 
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
