'use client'

import { HeaderComponent } from "@/components/header";
import { FooterComponent } from "@/components/footer";
import { useTheme } from "@/components/theme-provider";
import { Boxes } from "@/components/ui/background-boxes";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

export default function LandingPage() {
  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'text-white' : 'text-black'} relative overflow-hidden min-h-screen flex flex-col`}>
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Boxes className="w-screen h-screen opacity-50" />
      </div>
      <div className="relative z-10 flex-grow">
        <HeaderComponent />
        <main className="flex flex-col items-center justify-center flex-grow px-4 sm:px-8 mt-8">
          <BentoGrid className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <BentoGridItem
              className="col-span-1 md:col-span-3 p-4 border border-black"
              title="Write my newsletter"
              description="Create engaging content for your audience."
              icon={<span role="img" aria-label="newsletter">✉️</span>}
            />
            <BentoGridItem
              className="p-4 border border-black"
              title="Blog 1"
              description="Read our latest insights and updates."
              icon={<span role="img" aria-label="blog">📝</span>}
            />
            <BentoGridItem
              className="p-4 border border-black"
              title="Blog 2"
              description="Discover tips and tricks for your projects."
              icon={<span role="img" aria-label="blog">📝</span>}
            />
            <BentoGridItem
              className="p-4 border border-black"
              title="Blog 3"
              description="Stay updated with the latest trends."
              icon={<span role="img" aria-label="blog">📝</span>}
            />
          </BentoGrid>
        </main>
      </div>
      <div className="flex-grow-0" style={{ flexBasis: '20%' }}></div>
      <FooterComponent />
    </div>
  );
}
