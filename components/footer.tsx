'use client'

import { Pen, Twitter, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"

export function FooterComponent() {
  return (
    <footer className="w-full bg-gradient-to-r from-pink-800 to-orange-700 text-pink-200 relative z-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Pen className="h-5 w-5 text-orange-200" />
              <h2 className="text-lg font-semibold text-orange-100">No Code Creative</h2>
            </div>
            <p className="text-sm">Powered by Craft The Future. Unleash your creativity without code.</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-100">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-sm text-pink-300 hover:text-orange-200 transition-colors">
                Home
              </Link>
              <Link href="/app" className="text-sm text-pink-300 hover:text-orange-200 transition-colors">
                Start Writing
              </Link>
              <Link href="/examples" className="text-sm text-pink-300 hover:text-orange-200 transition-colors">
                Examples
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-100">Company</h3>
            <div className="flex flex-col space-y-2">
              <Link href="https://craftthefuture.xyz" className="text-sm text-pink-300 hover:text-orange-200 transition-colors">
                Craft The Future
              </Link>
              <Link href="https://blog.craftthefuture.xyz" className="text-sm text-pink-300 hover:text-orange-200 transition-colors">
                Blog
              </Link>
              <Link href="https://nocodecreative.xyz" className="text-sm text-pink-300 hover:text-orange-200 transition-colors">
                No Code Creative
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-orange-100">Connect</h3>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="https://twitter.com/craftthefuture_" 
                className="text-pink-300 hover:text-orange-200 transition-colors flex items-center space-x-2"
              >
                <Twitter className="h-5 w-5" />
                <span className="text-sm">Twitter</span>
              </Link>
              <Link 
                href="https://www.linkedin.com/company/craft-the-future" 
                className="text-pink-300 hover:text-orange-200 transition-colors flex items-center space-x-2"
              >
                <Linkedin className="h-5 w-5" />
                <span className="text-sm">LinkedIn</span>
              </Link>
              <Link 
                href="https://www.instagram.com/_craftthefuture_" 
                className="text-pink-300 hover:text-orange-200 transition-colors flex items-center space-x-2"
              >
                <Instagram className="h-5 w-5" />
                <span className="text-sm">Instagram</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-pink-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-pink-300 text-center sm:text-left">
              &copy; {new Date().getFullYear()} No Code Creative by Craft The Future. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-pink-300">
              <Link href="/privacy" className="hover:text-orange-200 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-orange-200 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}