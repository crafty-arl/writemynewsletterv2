'use client'

import { HeaderComponent } from "@/components/header";
import { FooterComponent } from "@/components/footer";
import { useTheme } from "@/components/theme-provider";
import { NewsletterViewer } from "@/components/newsletter-viewer";
export default function Library() {
  const { theme } = useTheme();

  return (
    <div className={`${theme === 'dark' ? 'bg-background' : 'bg-white'} min-h-screen grid grid-rows-[auto_1fr_auto]`}>
      <HeaderComponent />
      <NewsletterViewer />
      <FooterComponent />
    </div>
  );
}
