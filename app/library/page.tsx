'use client'

import { HeaderComponent } from "@/components/header";
import { FooterComponent } from "@/components/footer";
import { useTheme } from "@/components/theme-provider";
import { NewsletterViewer } from "@/components/newsletter-viewer";
import { useActiveAccount } from "thirdweb/react";

export default function Library() {
  const { theme } = useTheme();
  const account = useActiveAccount();

  return (
    <div className={`${theme === 'dark' ? 'bg-background' : 'bg-white'} min-h-screen grid grid-rows-[auto_1fr_auto]`}>
      <HeaderComponent />
      {account ? (
        <NewsletterViewer />
      ) : (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px-96px)]">
          <h2 className="text-2xl font-bold">Please log in to view your library</h2>
          <p className="text-lg mt-4">If you don&apos;t have any newsletters, please go to the Create tab to get started.</p>
        </div>
      )}
      <FooterComponent />
    </div>
  );
}
