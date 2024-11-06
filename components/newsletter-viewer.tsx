'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Code, Copy, Eye } from "lucide-react"
import { Panel, PanelGroup } from 'react-resizable-panels' // Removed unused PanelResizeHandle import
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { useActiveAccount } from "thirdweb/react"
import { useTheme } from "@/components/theme-provider"

type Newsletter = {
  id: number
  topic: string
  html: string
}

export function NewsletterViewer() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCode, setShowCode] = useState(false)
  const account = useActiveAccount()
  const { theme } = useTheme()

  useEffect(() => {
    const fetchNewsletters = async () => {
      if (account?.address) {
        const response = await fetch(`/api/listMyContent?walletAddress=${account.address}`)
        const data = await response.json()
        const fetchedNewsletters: Newsletter[] = data.content_gen_values.map((html: string, index: number) => ({
          id: index + 1,
          topic: `Newsletter ${index + 1}`,
          html: decodeURIComponent(html.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))),
        }))
        setNewsletters(fetchedNewsletters.reverse()) // Show newsletters in reverse order (last to first)
        setCurrentIndex(0) // Reset current index when newsletters are fetched
      }
    }

    fetchNewsletters()
  }, [account?.address])

  const currentNewsletter = newsletters[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : newsletters.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < newsletters.length - 1 ? prevIndex + 1 : 0))
  }

  const copyCode = () => {
    navigator.clipboard.writeText(currentNewsletter.html)
  }

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      <div className="flex justify-between p-4">
        <Button onClick={goToPrevious} variant="outline">
          <ChevronLeftIcon className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={goToNext} variant="outline">
          Next <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <PanelGroup direction="horizontal" className="flex-grow">
        <Panel minSize={30}>
          <Card className="m-4 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">
                {currentNewsletter?.topic || "No Newsletter Selected"}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <Switch
                  checked={showCode}
                  onCheckedChange={setShowCode}
                  aria-label="Toggle code view"
                />
                <Eye className="h-4 w-4" />
                <Copy className="h-4 w-4 cursor-pointer" onClick={copyCode} />
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              {currentNewsletter && (
                <div className="border rounded-lg overflow-hidden h-full">
                  <ScrollArea className="h-full w-full">
                    {showCode ? (
                      <pre className={`p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} text-sm h-full`}>
                        <code>{currentNewsletter.html}</code>
                      </pre>
                    ) : (
                      <iframe
                        srcDoc={currentNewsletter.html}
                        title={`Newsletter: ${currentNewsletter.topic}`}
                        className="w-full h-full border-none"
                      />
                    )}
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </Panel>
      </PanelGroup>
      <div className="flex justify-between p-4">
        <Button onClick={goToPrevious} variant="outline">
          <ChevronLeftIcon className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button onClick={goToNext} variant="outline">
          Next <ChevronRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}