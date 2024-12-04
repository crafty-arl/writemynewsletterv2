'use client'

import { Pen, Twitter, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"

export function FooterComponent() {
  return (
    <footer className="w-full bg-gradient-to-r from-white via-pink-100 to-orange-50 shadow-md">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Pen className="h-5 w-5 text-pink-800" />
            <h2 className="text-lg font-semibold text-pink-800">No Code Creative</h2>
          </div>
          <p className="text-sm text-pink-700">Powered by Craft The Future. Unleash your creativity without code.</p>
        </div>
        <div className="mt-8 pt-8 border-t border-pink-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-pink-700 text-center md:text-left">&copy; 2024 No Code Creative by Craft The Future. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="https://craftthefuture.xyz" className="text-pink-700 hover:text-orange-600 transition-colors">
              Craft The Future
            </Link>
            <Link href="https://blog.craftthefuture.xyz" className="text-pink-700 hover:text-orange-600 transition-colors">
              Blog
            </Link>
            <Link href="https://nocodecreative.xyz" className="text-pink-700 hover:text-orange-600 transition-colors">
              No Code Creative
            </Link>
            <Link href="https://twitter.com/craftthefuture_" className="text-pink-700 hover:text-orange-600 transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="https://www.linkedin.com/company/craft-the-future" className="text-pink-700 hover:text-orange-600 transition-colors">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="https://www.instagram.com/_craftthefuture_" className="text-pink-700 hover:text-orange-600 transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}