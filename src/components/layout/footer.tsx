'use client'

import { cn } from '@/lib/utils'
import { 
  BarChart3,
  Search,
  TrendingUp,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react'

const googleServices = [
  {
    title: 'Google Analytics',
    href: 'https://analytics.google.com',
    icon: BarChart3,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10'
  },
  {
    title: 'Search Console',
    href: 'https://search.google.com/search-console',
    icon: Search,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  {
    title: 'Google Trends',
    href: 'https://trends.google.com',
    icon: TrendingUp,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
]

const socialLinks = [
  {
    title: 'Facebook',
    href: 'https://facebook.com',
    icon: Facebook,
    color: 'text-blue-600'
  },
  {
    title: 'Instagram',
    href: 'https://instagram.com',
    icon: Instagram,
    color: 'text-pink-600'
  },
  {
    title: 'YouTube',
    href: 'https://youtube.com',
    icon: Youtube,
    color: 'text-red-600'
  },
]

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* 로고 */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">Xinh+</span>
          </div>

          {/* Google 서비스 */}
          <div className="flex justify-center gap-3">
            {googleServices.map((service) => (
              <a
                key={service.href}
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg",
                  "hover:opacity-80 transition-opacity",
                  service.bgColor
                )}
              >
                <service.icon className={cn("h-5 w-5", service.color)} />
                <span className={cn("text-sm font-medium", service.color)}>
                  {service.title}
                </span>
              </a>
            ))}
          </div>

          {/* 소셜 미디어 링크 */}
          <div className="flex items-center justify-end gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 rounded-full hover:bg-accent transition-colors",
                  social.color
                )}
              >
                <social.icon className="h-5 w-5" />
                <span className="sr-only">{social.title}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
} 