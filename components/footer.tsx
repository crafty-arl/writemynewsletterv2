'use client'

import { Pen, Twitter, Facebook, Instagram } from "lucide-react"
import Link from "next/link"
import { EnvelopeClosedIcon } from "@radix-ui/react-icons"

export function FooterComponent() {
  return (
    <footer className="w-full bg-gradient-to-r from-pink-800 to-orange-700 text-pink-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Pen className="h-5 w-5 text-orange-200" />
              <h2 className="text-lg font-semibold text-orange-100">WriteMyNewsletter</h2>
            </div>
            <p className="text-sm">Empowering your words, amplifying your reach.</p>
          </div>
          <div>
            <h3 className="text-orange-200 font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-orange-200 transition-colors">Features</Link></li>
              <li><Link href="#" className="text-sm hover:text-orange-200 transition-colors">Templates</Link></li>
              <li><Link href="#" className="text-sm hover:text-orange-200 transition-colors">Integrations</Link></li>
              <li><Link href="#" className="text-sm hover:text-orange-200 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-orange-200 font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-orange-200 transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-sm hover:text-orange-200 transition-colors">Tutorials</Link></li>
              <li><Link href="#" className="text-sm hover:text-orange-200 transition-colors">Support</Link></li>
              <li><Link href="#" className="text-sm hover:text-orange-200 transition-colors">API Docs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-orange-200 font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:text-orange-200 transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-sm hover:text-orange-200 transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-sm hover:text-orange-200 transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm hover:text-orange-200 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-pink-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-pink-300">&copy; 2024 WriteMyNewsletter. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-pink-300 hover:text-orange-200 transition-colors">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-pink-300 hover:text-orange-200 transition-colors">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link href="#" className="text-pink-300 hover:text-orange-200 transition-colors">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href="#" className="text-pink-300 hover:text-orange-200 transition-colors">
              <EnvelopeClosedIcon className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}