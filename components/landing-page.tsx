'use client'

import { motion } from 'framer-motion'
import { Laptop, Pencil, Zap, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LandingPageComponent() {
  const apps = [
    { icon: <Zap className="text-yellow-500" />, name: 'AI Assistant', description: 'Boost your productivity with AI-powered tools' },
    { icon: <Laptop className="text-blue-500" />, name: 'App Builder', description: 'Create stunning apps without coding' },
    { icon: <Pencil className="text-green-500" />, name: 'Blog Editor', description: 'Craft engaging content effortlessly' },
  ]

  const blogs = [
    { title: 'The Future of No-Code Development', excerpt: 'Explore how AI is revolutionizing the way we create...', date: 'May 15, 2024' },
    { title: 'Designing for Accessibility in No-Code Platforms', excerpt: 'Learn best practices for inclusive design...', date: 'May 10, 2024' },
    { title: 'Boosting Creativity with AI Tools', excerpt: 'Discover how AI can enhance your creative process...', date: 'May 5, 2024' },
  ]

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white text-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <main className="mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-bold mb-6">NoCode Creative</h1>
          <p className="mb-8 max-w-3xl mx-auto">
            Empower your creativity with AI-driven tools. No coding required.
          </p>
          <Button className="text-lg">
            Explore Our Tools
            <ChevronRight className="ml-2" />
          </Button>
        </div>

        <section className="mb-20">
          <h2 className="font-bold mb-8 text-center">Our Creative Suite</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {apps.map((app, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {app.icon}
                      <span>{app.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{app.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-8 text-center">Latest from Our Blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle>{blog.title}</CardTitle>
                    <CardDescription>{blog.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{blog.excerpt}</p>
                    <Button variant="ghost" className="group">
                      Read More
                      <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}