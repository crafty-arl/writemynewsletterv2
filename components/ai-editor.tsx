'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PlusCircle, Send, Copy, MessageSquare, Menu, Trash2, X, FileText, ChevronRight } from 'lucide-react'
import { getGlobalUniqueId } from '@/components/header'
import { databases } from '@/app/app';
import { Query } from 'appwrite';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

// Define message type to fix type errors
type Message = {
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

// Update Newsletter type to match database schema
type Newsletter = {
  id: string;
  name: string;
  content_gen_html: string[];
  content_gen_date: string[];
  newsletter_prompt: string[];
  ai_responses: string[];
}

// Create a default newsletter object
const defaultNewsletter: Newsletter = {
  id: '',
  name: 'No Newsletter Selected',
  content_gen_html: [],
  content_gen_date: [],
  newsletter_prompt: [],
  ai_responses: []
};

// Sample newsletter data
const sampleNewsletters: Newsletter[] = [
  {
    id: '1',
    name: 'Weekly Tech Digest',
    content_gen_html: [],
    content_gen_date: [],
    newsletter_prompt: [],
    ai_responses: []
  },
  {
    id: '2', 
    name: 'Monthly Fitness Update',
    content_gen_html: [],
    content_gen_date: [],
    newsletter_prompt: [],
    ai_responses: []
  },
  {
    id: '3',
    name: 'Quarterly Business Insights',
    content_gen_html: [],
    content_gen_date: [],
    newsletter_prompt: [],
    ai_responses: []
  }
]

export default function AIEditor() {
  const userId = getGlobalUniqueId();
  const [activeThread, setActiveThread] = useState('1')
  const [threads, setThreads] = useState<Newsletter[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const [showNewThreadDialog, setShowNewThreadDialog] = useState(false)
  const [newThreadName, setNewThreadName] = useState('')
  const [isLoadingNewsletter, setIsLoadingNewsletter] = useState(false)
  const [isAITyping, setIsAITyping] = useState(false)
  const [showHtmlCode, setShowHtmlCode] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [isHuman, setIsHuman] = useState(false)
  const [verificationAnswer, setVerificationAnswer] = useState('')
  const [verificationError, setVerificationError] = useState('')

  // Find active newsletter with fallback to default
  const activeNewsletter = threads.find(t => t.id === activeThread) || defaultNewsletter;

  // Fetch threads for the logged-in user
  useEffect(() => {
    if (!userId) return;

    const fetchUserThreads = async () => {
      try {
        console.log('Fetching threads for user:', userId);
        const response = await databases.listDocuments(
          'users',
          '672ba0120006819e97fd',
          [
            Query.equal('unique_id', userId),
            Query.limit(100)
          ]
        );
        
        console.log('Found documents:', response.documents);
        
        // Safely map documents to Newsletter type
        const userThreads: Newsletter[] = response.documents.map(doc => ({
          id: doc.$id || '',
          name: doc.threadid?.[1] || doc.threadid?.[0] || 'Untitled',
          content_gen_html: Array.isArray(doc.content_gen_html) ? doc.content_gen_html : [],
          content_gen_date: Array.isArray(doc.content_gen_date) ? doc.content_gen_date : [],
          newsletter_prompt: Array.isArray(doc.newsletter_prompt) ? doc.newsletter_prompt : [],
          ai_responses: Array.isArray(doc.ai_responses) ? doc.ai_responses : []
        }));
        
        console.log('Processed threads:', userThreads);
        setThreads(userThreads);
        if (userThreads.length > 0) {
          setActiveThread(userThreads[0].id);
        }
      } catch (error) {
        console.error('Error fetching threads:', error);
      }
    };

    fetchUserThreads();
  }, [userId]);

  const handleVerification = () => {
    const answer = verificationAnswer.trim().toLowerCase();
    if (answer === 'yes') {
      setIsHuman(true);
      setVerificationError('');
    } else {
      setVerificationError('Incorrect answer. Please try again.');
    }
  };

  // Don't render anything until wallet is connected or human verification is complete
  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <div className="w-full max-w-md space-y-6 bg-card p-6 rounded-lg shadow-lg border border-border">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Human Verification Required</h2>
            <p className="text-muted-foreground">Please verify that you are human before proceeding.</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification" className="text-foreground">
                Are you a robot? (Answer "yes" or "no")
              </Label>
              <Input
                id="verification"
                type="text"
                value={verificationAnswer}
                onChange={(e) => setVerificationAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full"
              />
              {verificationError && (
                <p className="text-sm text-destructive">{verificationError}</p>
              )}
            </div>
            
            <Button 
              onClick={handleVerification}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Verify
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const createDatabaseDocument = async (documentId: string) => {
    try {
      const displayName = newThreadName.trim() || `Thread ${Date.now()}`;
      const result = await databases.createDocument(
        'users',
        '672ba0120006819e97fd',
        documentId,
        {
          unique_id: getGlobalUniqueId(),
          threadid: [documentId, displayName],
          content_gen_html: [],
          content_gen_date: [],
          newsletter_prompt: [],
          ai_responses: []
        },
        ["read(\"any\")"]
      );
      console.log('Document created:', result);
      return result;
    } catch (error) {
      console.error('Error creating document:', error);
      return null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (activeNewsletter.newsletter_prompt.length >= 20) {
      alert('You have reached the limit of 20 messages per thread. Please create a new thread to continue.');
      return;
    }

    setIsLoadingNewsletter(true);
    setIsAITyping(true);
    const timestamp = new Date().toISOString();
    const currentDocumentId = activeNewsletter.id;
    const messageText = inputMessage.trim();
    
    // Create user message with timestamp
    const userMessage: Message = {
      text: messageText,
      sender: 'user',
      timestamp
    };
    
    // Clear input immediately for better UX
    setInputMessage('');

    // Update local state immediately to show user message
    setThreads(prevThreads => 
      prevThreads.map(thread => 
        thread.id === activeThread
          ? {
              ...thread,
              newsletter_prompt: [...thread.newsletter_prompt, JSON.stringify({
                text: messageText,
                sender: 'user',
                timestamp: timestamp
              })]
            }
          : thread
      )
    );

    try {
      // Send data to webhook with timestamp
      const response = await fetch('https://api.craftthefuture.xyz/webhook-test/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          threadId: activeThread,
          documentId: currentDocumentId,
          prompt: messageText,
          timestamp: timestamp,
          message: JSON.stringify(userMessage) // Send the full message object
        })
      });
      
      if (!response.ok) {
        throw new Error(`Webhook error: ${response.status}`);
      }
      
      const webhookResponse = await response.json();
      console.log('Raw webhook response:', webhookResponse); // Debug log

      // Extract response data correctly - handle array format
      const responseData = Array.isArray(webhookResponse) ? webhookResponse[0] : webhookResponse;
      
      // Log initial webhook response with more detail
      console.log('🚀 Webhook response received:', {
        raw: webhookResponse,
        responseData: responseData,
        html: responseData?.html ? {
          length: responseData.html.length,
          preview: responseData.html.substring(0, 100)
        } : 'None',
        ai_response: responseData?.output?.ai_response ? {
          preview: responseData.output.ai_response.substring(0, 100)
        } : 'None',
        body: responseData?.body || 'None'
      });

      // Get current database state first
      try {
        const currentThread = await databases.getDocument(
          'users',
          '672ba0120006819e97fd',
          currentDocumentId
        );

        // Log current database state
        console.log('📂 Current database state:', {
          thread_id: currentThread.$id,
          arrays: {
            content_gen_html: currentThread.content_gen_html?.length || 0,
            content_gen_date: currentThread.content_gen_date?.length || 0,
            newsletter_prompt: currentThread.newsletter_prompt?.length || 0,
            ai_responses: currentThread.ai_responses?.length || 0
          }
        });

        // Create update payload with the HTML from the array response
        const dbUpdatePayload = {
          unique_id: userId,
          threadid: [currentDocumentId, activeNewsletter.name || 'Untitled'],
          content_gen_html: responseData?.html 
            ? [...(currentThread.content_gen_html || []), responseData.html]
            : currentThread.content_gen_html || [],
          content_gen_date: [...(currentThread.content_gen_date || []), new Date().toISOString()],
          newsletter_prompt: [...(currentThread.newsletter_prompt || []), JSON.stringify({
            text: messageText,
            sender: 'user',
            timestamp: new Date().toISOString()
          })],
          ai_responses: [...(currentThread.ai_responses || []), JSON.stringify({
            timestamp: new Date().toISOString(),
            response: responseData?.output?.ai_response || '',
            type: 'ai'
          })]
        };

        // Log the HTML content being stored
        console.log('📝 HTML Content:', {
          raw: responseData?.html,
          isEncoded: responseData?.html?.includes('%'),
          decoded: responseData?.html ? decodeURIComponent(responseData.html) : 'None'
        });

        // Update database
        const result = await databases.updateDocument(
          'users',
          '672ba0120006819e97fd',
          currentDocumentId,
          dbUpdatePayload
        );

        // Log success with array details
        console.log('✅ Database updated successfully:', {
          id: result.$id,
          arrays: {
            content_gen_html: {
              length: result.content_gen_html?.length || 0,
              latest_present: result.content_gen_html?.[result.content_gen_html.length - 1] ? 'Yes' : 'No'
            },
            content_gen_date: {
              length: result.content_gen_date?.length || 0,
              latest: result.content_gen_date?.[result.content_gen_date.length - 1]
            },
            newsletter_prompt: {
              length: result.newsletter_prompt?.length || 0,
              latest_present: result.newsletter_prompt?.[result.newsletter_prompt.length - 1] ? 'Yes' : 'No'
            },
            ai_responses: {
              length: result.ai_responses?.length || 0,
              latest_present: result.ai_responses?.[result.ai_responses.length - 1] ? 'Yes' : 'No'
            }
          }
        });

        // Update local state
        setThreads(prevThreads => 
          prevThreads.map(thread => 
            thread.id === activeThread
              ? {
                  ...thread,
                  content_gen_html: dbUpdatePayload.content_gen_html,
                  content_gen_date: dbUpdatePayload.content_gen_date,
                  newsletter_prompt: dbUpdatePayload.newsletter_prompt,
                  ai_responses: dbUpdatePayload.ai_responses
                }
              : thread
          )
        );

        // Update iframe content immediately after state update
        window.requestAnimationFrame(() => {
          const previewIframe = document.querySelector('iframe[title="Newsletter Content"]') as HTMLIFrameElement;
          if (previewIframe && responseData?.html) {
            try {
              // Always try to decode the HTML content
              const htmlContent = decodeURIComponent(responseData.html);
              console.log('🖼️ Updating iframe with HTML content');
              previewIframe.srcdoc = htmlContent;
              // Automatically show preview when new content arrives
              setShowSidebar(true);
            } catch (error) {
              console.error('Error decoding HTML for preview:', error);
              // Fallback to using the raw HTML if decoding fails
              previewIframe.srcdoc = responseData.html;
              setShowSidebar(true);
            }
          }
          setIsLoadingNewsletter(false);
          setIsAITyping(false);
        });

      } catch (error) {
        console.error('❌ Database update error:', {
          error,
          thread_id: currentDocumentId,
          user_id: userId
        });
        setIsLoadingNewsletter(false);
        setIsAITyping(false);
      }
      
    } catch (error) {
      console.error('❌ Error sending webhook:', error);
      setIsAITyping(false);
      setIsLoadingNewsletter(false);
      
      // Fallback to database update for user message if webhook fails
      try {
        await databases.updateDocument(
          'users',
          '672ba0120006819e97fd',
          currentDocumentId,
          {
            newsletter_prompt: [...activeNewsletter.newsletter_prompt, JSON.stringify(userMessage)]
          }
        );
        console.log('✅ Fallback database update successful');
      } catch (dbError) {
        console.error('❌ Error updating document:', dbError);
      }
    }
  };

  const handleNewThreadClick = () => {
    setShowNewThreadDialog(true)
  }

  const handleNewThread = async () => {
    if (threads.length >= 5) {
      alert('You can only have up to 5 active threads. Please delete an existing thread to create a new one.');
      setShowNewThreadDialog(false);
      return;
    }

    const timestamp = Date.now();
    // Format the thread name to be Appwrite-compliant
    const formatThreadName = (name: string) => {
      return name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\.\-_]/g, '_') // Allow periods and hyphens
        .replace(/^[^a-z0-9]/g, '')  // Remove leading special chars
        .slice(0, 20);               // Shorter name to allow for timestamp
    };
    
    // Keep original name for display
    const displayName = newThreadName.trim() || `Thread ${timestamp}`;
    
    // Format name for document ID
    const shortTimestamp = Math.floor(timestamp / 1000).toString(36); // Convert timestamp to base36 for shorter string
    const documentId = newThreadName.trim() 
      ? `${formatThreadName(newThreadName)}-${shortTimestamp}`
      : `t-${shortTimestamp}-${userId.slice(0, 8)}`;
    
    // Create document in database
    await createDatabaseDocument(documentId);
    
    const newThread: Newsletter = {
      id: documentId,
      name: displayName,
      content_gen_html: [],
      content_gen_date: [],
      newsletter_prompt: [],
      ai_responses: []
    }
    
    setThreads([...threads, newThread])
    setActiveThread(newThread.id)
    setShowSidebar(false)
    setShowNewThreadDialog(false)
    setNewThreadName('')
  }

  const handleCopyHtml = () => {
    const html = activeNewsletter.content_gen_html[previewIndex];
    if (!html) return;
    
    try {
      const isEncoded = html.includes('%') && !html.includes('<');
      const decodedHtml = isEncoded ? decodeURIComponent(html) : html;
      navigator.clipboard.writeText(decodedHtml)
        .then(() => alert('HTML copied to clipboard!'))
        .catch(err => console.error('Failed to copy HTML: ', err));
    } catch (error) {
      console.error('Error decoding HTML for copy:', error);
      navigator.clipboard.writeText(html)
        .then(() => alert('HTML copied to clipboard!'))
        .catch(err => console.error('Failed to copy HTML: ', err));
    }
  };

  const handleDeleteMessage = async (message: Message, index: number, type: 'prompt' | 'response') => {
    try {
      const documentId = activeNewsletter.id;
      if (!documentId) {
        console.error('No active thread selected');
        return;
      }

      // Create new arrays without the deleted message
      const updatedThreads = threads.map(thread => {
        if (thread.id === activeThread) {
          const updatedThread = { ...thread };
          if (type === 'prompt') {
            updatedThread.newsletter_prompt = thread.newsletter_prompt.filter((_, i) => i !== index);
          } else {
            updatedThread.ai_responses = thread.ai_responses.filter((_, i) => i !== index);
          }
          return updatedThread;
        }
        return thread;
      });

      // Update the database
      await databases.updateDocument(
        'users',
        '672ba0120006819e97fd',
        documentId,
        {
          [type === 'prompt' ? 'newsletter_prompt' : 'ai_responses']: 
            type === 'prompt' 
              ? activeNewsletter.newsletter_prompt.filter((_, i) => i !== index)
              : activeNewsletter.ai_responses.filter((_, i) => i !== index)
        }
      );

      // Update local state
      setThreads(updatedThreads);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleDeleteThread = async (threadId: string) => {
    try {
      // Delete the document from the database
      await databases.deleteDocument(
        'users',
        '672ba0120006819e97fd',
        threadId
      );
      
      // Update local state
      const updatedThreads = threads.filter(thread => thread.id !== threadId);
      setThreads(updatedThreads);
      
      // If we deleted the active thread, select another one
      if (threadId === activeThread && updatedThreads.length > 0) {
        setActiveThread(updatedThreads[0].id);
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
    }
  };

  return (
    <>
      <Dialog open={showNewThreadDialog} onOpenChange={setShowNewThreadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Newsletter</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="relative">
              <Input
                value={newThreadName}
                onChange={(e) => setNewThreadName(e.target.value.slice(0, 30))}
                placeholder="Enter thread name..."
                className="w-full"
                onKeyPress={(e) => e.key === 'Enter' && handleNewThread()}
                maxLength={30}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {newThreadName.length}/30
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewThreadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleNewThread}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col min-h-[100dvh] bg-background text-foreground relative z-0">
        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center justify-between p-2 bg-primary sticky top-0 z-[60]">
          <Button 
            variant="ghost"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-primary-foreground">Write My Newsletter</h1>
          <div className="w-10" /> {/* Spacer for alignment */}
        </div>

        {/* Mobile overlay */}
        {(showSidebar) && (
          <div 
            className="fixed inset-0 bg-background/90 z-[70] lg:hidden"
            onClick={() => {
              setShowSidebar(false);
            }}
          />
        )}

        <div className="flex-1 flex relative">
          {/* Left sidebar: Threads */}
          <div 
            className={`
              ${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
              lg:translate-x-0
              fixed lg:relative
              top-0 lg:top-auto
              left-0
              h-[100dvh] lg:h-full
              w-[280px] lg:w-72
              bg-background
              border-r border-border
              z-[80]
              transition-transform
              duration-200
              flex flex-col
              overflow-hidden
              pt-[48px] lg:pt-0
              shadow-lg lg:shadow-none
            `}
          >
            <div className="hidden lg:block p-2 border-b border-border bg-primary">
              <h1 className="text-xl font-bold text-primary-foreground">Write My Newsletter</h1>
              {userId && (
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-primary-foreground/80">ID: {userId}</p>
                  <p className="text-sm text-primary-foreground/80">
                    ({threads.length}/5 threads)
                  </p>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                {threads.map(thread => (
                  <div key={thread.id} className="relative group">
                    <Button
                      variant={activeThread === thread.id ? "secondary" : "ghost"}
                      className={`w-full justify-start px-4 py-2 text-left ${
                        activeThread === thread.id 
                          ? 'bg-secondary text-secondary-foreground' 
                          : 'text-foreground hover:bg-secondary/50'
                      }`}
                      onClick={() => {
                        setActiveThread(thread.id)
                        setShowSidebar(false)
                      }}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span className="truncate">{thread.name}</span>
                    </Button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteThread(thread.id);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete thread"
                    >
                      <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                ))}
              </ScrollArea>
            </div>
            <div className="p-2 border-t">
              <Button onClick={handleNewThreadClick} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Newsletter
              </Button>
            </div>
          </div>

          {/* Middle: Chat History */}
          <div className="flex-1 flex flex-col min-w-0 relative z-10">
            <div className="hidden lg:block p-2 border-b border-border bg-primary">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-primary-foreground truncate">
                    {activeNewsletter?.name || 'No Newsletter Selected'}
                  </h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-sm text-primary-foreground/80 truncate">
                      Thread ID: {activeNewsletter?.id || ''}
                    </p>
                    <p className="text-sm text-primary-foreground/80">
                      ({activeNewsletter.newsletter_prompt.length}/20 messages)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {showSidebar ? (
              // Newsletter Preview
              <div className="flex-1 flex flex-col">
                <div className="p-2 border-b border-border bg-primary flex justify-between items-center sticky top-[48px] lg:top-0 z-20">
                  <div className="flex items-center space-x-2 overflow-x-auto">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const newIndex = Math.max(0, previewIndex - 1);
                          setPreviewIndex(newIndex);
                        }}
                        disabled={previewIndex === 0}
                        className="h-7 w-7 p-0 hover:bg-secondary/80 text-secondary-foreground"
                      >
                        ←
                      </Button>
                      <span className="text-xs text-primary-foreground whitespace-nowrap px-1">
                        {activeNewsletter.content_gen_html.length > 0 ? `${previewIndex + 1}/${activeNewsletter.content_gen_html.length}` : '0/0'}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const newIndex = Math.min(activeNewsletter.content_gen_html.length - 1, previewIndex + 1);
                          setPreviewIndex(newIndex);
                        }}
                        disabled={previewIndex >= activeNewsletter.content_gen_html.length - 1}
                        className="h-7 w-7 p-0 hover:bg-secondary/80 text-secondary-foreground"
                      >
                        →
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCopyHtml}
                      className="h-7 px-2 hover:bg-secondary/80 text-secondary-foreground whitespace-nowrap"
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden relative">
                  {activeNewsletter.content_gen_html[previewIndex] ? (
                    <iframe
                      srcDoc={(() => {
                        const html = activeNewsletter.content_gen_html[previewIndex];
                        try {
                          const decodedHtml = decodeURIComponent(html);
                          return `
                            <!DOCTYPE html>
                            <html>
                              <head>
                                <meta charset="utf-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <style>
                                  * {
                                    box-sizing: border-box;
                                    margin: 0;
                                    padding: 0;
                                  }
                                  html, body {
                                    width: 100%;
                                    height: 100%;
                                    margin: 0;
                                    padding: 0;
                                    background: #ffffff;
                                  }
                                  body {
                                    padding: 2rem;
                                    max-width: 800px;
                                    margin: 0 auto;
                                    overflow-y: auto;
                                    -webkit-overflow-scrolling: touch;
                                    color: #000000;
                                    font-size: 16px;
                                    line-height: 1.6;
                                    font-family: system-ui, -apple-system, sans-serif;
                                  }
                                  img {
                                    max-width: 100%;
                                    height: auto;
                                    display: block;
                                    margin: 1.5rem auto;
                                  }
                                  p {
                                    margin: 1rem 0;
                                  }
                                  h1, h2, h3, h4, h5, h6 {
                                    margin: 2rem 0 1rem;
                                    line-height: 1.3;
                                  }
                                  h1 { font-size: 2rem; }
                                  h2 { font-size: 1.75rem; }
                                  h3 { font-size: 1.5rem; }
                                  h4 { font-size: 1.25rem; }
                                  h5, h6 { font-size: 1rem; }
                                  a {
                                    color: #2563eb;
                                    text-decoration: none;
                                  }
                                  a:hover {
                                    text-decoration: underline;
                                  }
                                  ul, ol {
                                    margin: 1rem 0;
                                    padding-left: 2rem;
                                  }
                                  li {
                                    margin: 0.5rem 0;
                                  }
                                  blockquote {
                                    margin: 1.5rem 0;
                                    padding: 1rem 1.5rem;
                                    border-left: 4px solid #e5e7eb;
                                    background: #f9fafb;
                                  }
                                  pre {
                                    margin: 1.5rem 0;
                                    padding: 1rem;
                                    background: #f9fafb;
                                    border-radius: 0.375rem;
                                    overflow-x: auto;
                                  }
                                  code {
                                    font-family: ui-monospace, monospace;
                                    font-size: 0.9em;
                                  }
                                  table {
                                    width: 100%;
                                    border-collapse: collapse;
                                    margin: 1.5rem 0;
                                  }
                                  th, td {
                                    padding: 0.75rem;
                                    border: 1px solid #e5e7eb;
                                    text-align: left;
                                  }
                                  th {
                                    background: #f9fafb;
                                  }
                                  @media (max-width: 640px) {
                                    body {
                                      padding: 1rem;
                                      font-size: 14px;
                                    }
                                    h1 { font-size: 1.75rem; }
                                    h2 { font-size: 1.5rem; }
                                    h3 { font-size: 1.25rem; }
                                    h4, h5, h6 { font-size: 1rem; }
                                  }
                                </style>
                              </head>
                              <body>
                                ${decodedHtml}
                              </body>
                            </html>
                          `;
                        } catch (error) {
                          return html;
                        }
                      })()}
                      className="absolute inset-0 w-full h-full border-none"
                      style={{ background: '#ffffff' }}
                      title="Newsletter Content"
                      sandbox="allow-scripts allow-forms allow-popups allow-modals"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No newsletter content available
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Chat History
              <>
                <ScrollArea className="flex-1 p-2">
                  {(() => {
                    try {
                      return activeNewsletter.newsletter_prompt.map((msg, i) => {
                        try {
                          const userMessage = JSON.parse(msg);
                          const aiResponse = activeNewsletter.ai_responses[i];
                          const messages = [];

                          // Add user message
                          messages.push({
                            text: userMessage.text || msg,
                            sender: 'user' as const,
                            timestamp: userMessage.timestamp || new Date().toISOString(),
                            type: 'prompt' as const,
                            index: i
                          });

                          // Try to add AI response if it exists
                          if (aiResponse) {
                            try {
                              const parsed = JSON.parse(aiResponse);
                              if (parsed.response) {
                                messages.push({
                                  text: parsed.response,
                                  sender: 'ai' as const,
                                  timestamp: parsed.timestamp || new Date().toISOString(),
                                  type: 'response' as const,
                                  index: i
                                });
                              }
                            } catch (error) {
                              console.log('Error parsing AI response:', aiResponse);
                              if (aiResponse) {
                                messages.push({
                                  text: aiResponse,
                                  sender: 'ai' as const,
                                  timestamp: new Date().toISOString(),
                                  type: 'response' as const,
                                  index: i
                                });
                              }
                            }
                          }

                          return messages;
                        } catch (error) {
                          console.log('Error parsing prompt message:', msg);
                          return [{
                            text: typeof msg === 'string' ? msg : 'Invalid message',
                            sender: 'user' as const,
                            timestamp: new Date().toISOString(),
                            type: 'prompt' as const,
                            index: i
                          }];
                        }
                      }).flat()
                      .sort((a, b) => {
                        const timeA = new Date(a.timestamp).getTime();
                        const timeB = new Date(b.timestamp).getTime();
                        if (timeA === timeB) {
                          return a.sender === 'user' ? -1 : 1;
                        }
                        return timeA - timeB;
                      })
                      .map((message) => (
                        <div 
                          key={`${message.type}-${message.timestamp}-${message.index}`} 
                          className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                        >
                          <div className={`inline-block p-3 rounded-lg max-w-[80%] relative group ${
                            message.sender === 'user' 
                              ? 'bg-primary text-primary-foreground shadow-sm' 
                              : 'bg-muted text-muted-foreground shadow-sm'
                          }`}>
                            {message.text}
                            <button
                              onClick={() => handleDeleteMessage(message, message.index, message.type)}
                              className="absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                              title={`Delete ${message.type}`}
                            >
                              <X className="h-4 w-4 text-destructive hover:text-destructive/80" />
                            </button>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(message.timestamp).toLocaleString()}
                          </div>
                          {/* Add Newsletter Dialog Card after AI responses */}
                          {message.sender === 'ai' && message.index < activeNewsletter.content_gen_html.length && (
                            <div className="mt-3">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full max-w-[300px] bg-card hover:bg-accent hover:text-accent-foreground transition-colors duration-200 border-border/50 shadow-sm group relative overflow-hidden"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    <div className="flex items-center space-x-3 w-full relative">
                                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                                        <FileText className="h-4 w-4" />
                                      </div>
                                      <div className="flex-1 text-left">
                                        <div className="flex items-center space-x-1">
                                          <p className="text-sm font-medium">Newsletter</p>
                                          <span className="text-xs text-muted-foreground">v{message.index + 1}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Click to preview</p>
                                      </div>
                                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    </div>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl h-[80vh] p-0">
                                  <DialogHeader className="sr-only">
                                    <DialogTitle>Newsletter Preview</DialogTitle>
                                  </DialogHeader>
                                  <iframe
                                    srcDoc={(() => {
                                      const html = activeNewsletter.content_gen_html[message.index];
                                      try {
                                        const decodedHtml = decodeURIComponent(html);
                                        return `
                                          <!DOCTYPE html>
                                          <html>
                                            <head>
                                              <meta charset="utf-8">
                                              <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                              <style>
                                                * {
                                                  box-sizing: border-box;
                                                  margin: 0;
                                                  padding: 0;
                                                }
                                                html, body {
                                                  width: 100%;
                                                  height: 100%;
                                                  margin: 0;
                                                  padding: 0;
                                                  background: #ffffff;
                                                }
                                                body {
                                                  padding: 2rem;
                                                  max-width: 800px;
                                                  margin: 0 auto;
                                                  overflow-y: auto;
                                                  -webkit-overflow-scrolling: touch;
                                                  color: #000000;
                                                  font-size: 16px;
                                                  line-height: 1.6;
                                                  font-family: system-ui, -apple-system, sans-serif;
                                                }
                                                img {
                                                  max-width: 100%;
                                                  height: auto;
                                                  display: block;
                                                  margin: 1.5rem auto;
                                                }
                                                p {
                                                  margin: 1rem 0;
                                                }
                                                h1, h2, h3, h4, h5, h6 {
                                                  margin: 2rem 0 1rem;
                                                  line-height: 1.3;
                                                }
                                                h1 { font-size: 2rem; }
                                                h2 { font-size: 1.75rem; }
                                                h3 { font-size: 1.5rem; }
                                                h4 { font-size: 1.25rem; }
                                                h5, h6 { font-size: 1rem; }
                                                a {
                                                  color: #2563eb;
                                                  text-decoration: none;
                                                }
                                                a:hover {
                                                  text-decoration: underline;
                                                }
                                                ul, ol {
                                                  margin: 1rem 0;
                                                  padding-left: 2rem;
                                                }
                                                li {
                                                  margin: 0.5rem 0;
                                                }
                                                blockquote {
                                                  margin: 1.5rem 0;
                                                  padding: 1rem 1.5rem;
                                                  border-left: 4px solid #e5e7eb;
                                                  background: #f9fafb;
                                                }
                                                pre {
                                                  margin: 1.5rem 0;
                                                  padding: 1rem;
                                                  background: #f9fafb;
                                                  border-radius: 0.375rem;
                                                  overflow-x: auto;
                                                }
                                                code {
                                                  font-family: ui-monospace, monospace;
                                                  font-size: 0.9em;
                                                }
                                                table {
                                                  width: 100%;
                                                  border-collapse: collapse;
                                                  margin: 1.5rem 0;
                                                }
                                                th, td {
                                                  padding: 0.75rem;
                                                  border: 1px solid #e5e7eb;
                                                  text-align: left;
                                                }
                                                th {
                                                  background: #f9fafb;
                                                }
                                                @media (max-width: 640px) {
                                                  body {
                                                    padding: 1rem;
                                                    font-size: 14px;
                                                  }
                                                  h1 { font-size: 1.75rem; }
                                                  h2 { font-size: 1.5rem; }
                                                  h3 { font-size: 1.25rem; }
                                                  h4, h5, h6 { font-size: 1rem; }
                                                }
                                              </style>
                                            </head>
                                            <body>
                                              ${decodedHtml}
                                            </body>
                                          </html>
                                        `;
                                      } catch (error) {
                                        return html;
                                      }
                                    })()}
                                    className="w-full h-full border-none bg-white"
                                    title="Newsletter Content"
                                    sandbox="allow-scripts allow-forms allow-popups allow-modals"
                                  />
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                          {isLoadingNewsletter && message.sender === 'user' && (
                            <div className="mt-3">
                              <div className="w-full max-w-[300px] bg-card border border-border/50 rounded-md p-3 shadow-sm">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-primary/10">
                                    <Skeleton className="h-4 w-4 translate-x-2 translate-y-2" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="space-y-1.5">
                                      <Skeleton className="h-4 w-24" />
                                      <Skeleton className="h-3 w-16" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ));
                    } catch (error) {
                      console.error('Error rendering chat messages:', error);
                      return null;
                    }
                  })()}
                  {isAITyping && (
                    <div className="mb-4 text-left">
                      <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg max-w-[80%] text-muted-foreground shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  {isLoadingNewsletter && (
                    <div className="mb-4 text-left">
                      <div className="bg-card rounded-lg shadow-sm p-4 border border-border max-w-[300px]">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </div>
                  )}
                </ScrollArea>
                <div className="p-2 border-t border-border bg-background">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Type your content..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="focus-visible:ring-primary bg-background border-border"
                    />
                    <Button onClick={handleSendMessage} className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 shadow-sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
