'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Code, Copy, Eye } from "lucide-react"
import { Panel, PanelGroup } from 'react-resizable-panels'
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
        setNewsletters(fetchedNewsletters.reverse())
        setCurrentIndex(0)
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
      {newsletters.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>No newsletters found</h2>
          <p className={`text-lg mt-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Please go to the Create tab to get started generating newsletters.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between p-2 md:p-4">
            <Button onClick={goToPrevious} variant="outline" className="flex items-center">
              <ChevronLeftIcon className="mr-1 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Previous</span>
            </Button>
            <Button onClick={goToNext} variant="outline" className="flex items-center">
              <span className="hidden md:inline">Next</span> <ChevronRightIcon className="ml-1 md:ml-2 h-4 w-4" />
            </Button>
          </div>
          <PanelGroup direction="horizontal" className="flex-grow">
            <Panel minSize={30}>
              <Card className="m-2 md:m-4 h-full">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 pb-2">
                  <CardTitle className={`text-lg md:text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
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
                          <pre className={`p-2 md:p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'} text-xs md:text-sm h-full`}>
                            <code>{currentNewsletter.html}</code>
                          </pre>
                        ) : (
                          <iframe
                            srcDoc={currentNewsletter.html}
                            title={`Newsletter: ${currentNewsletter.topic}`}
                            className={`w-full h-full border-none ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
                          />
                        )}
                      </ScrollArea>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Panel>
          </PanelGroup>
          <div className="flex justify-between p-2 md:p-4">
            <Button onClick={goToPrevious} variant="outline" className="flex items-center">
              <ChevronLeftIcon className="mr-1 md:mr-2 h-4 w-4" /> <span className="hidden md:inline">Previous</span>
            </Button>
            <Button onClick={goToNext} variant="outline" className="flex items-center">
              <span className="hidden md:inline">Next</span> <ChevronRightIcon className="ml-1 md:ml-2 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}