'use client'

import { Pen, Twitter, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"

export function FooterComponent() {
  return (
    <footer className="w-full bg-gradient-to-r from-pink-800 to-orange-700 text-pink-200">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Pen className="h-5 w-5 text-orange-200" />
            <h2 className="text-lg font-semibold text-orange-100">No Code Creative</h2>
          </div>
          <p className="text-sm">Powered by Craft The Future. Unleash your creativity without code.</p>
        </div>
        <div className="mt-8 pt-8 border-t border-pink-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-pink-300 text-center md:text-left">&copy; 2024 No Code Creative by Craft The Future. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="https://craftthefuture.xyz" className="text-pink-300 hover:text-orange-200 transition-colors">
              Craft The Future
            </Link>
            <Link href="https://blog.craftthefuture.xyz" className="text-pink-300 hover:text-orange-200 transition-colors">
              Blog
            </Link>
            <Link href="https://nocodecreative.xyz" className="text-pink-300 hover:text-orange-200 transition-colors">
              No Code Creative
            </Link>
            <Link href="https://twitter.com/craftthefuture_" className="text-pink-300 hover:text-orange-200 transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="https://www.linkedin.com/company/craft-the-future" className="text-pink-300 hover:text-orange-200 transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="https://www.instagram.com/_craftthefuture_" className="text-pink-300 hover:text-orange-200 transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}