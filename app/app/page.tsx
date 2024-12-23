import AIEditor from '@/components/ai-editor'
import { HeaderComponent } from '@/components/header'
import { FooterComponent } from '@/components/footer'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderComponent />
      <main className="flex-1 relative">
        <AIEditor />
      </main>
      <FooterComponent />
    </div>
  )
}
