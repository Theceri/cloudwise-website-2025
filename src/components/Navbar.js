'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { NAVIGATION_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import QuoteForm from './QuoteForm'
import { Button } from './ui/button'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/*
          Main Header Flex Container:
          - Default (mobile): 'flex justify-between' to put logo left, hamburger right.
          - Desktop (md:): 'md:justify-center' to allow desktop nav to center,
            but we'll use absolute positioning for logo/button on desktop.
        */}
        <div className="flex justify-between items-center h-20 relative md:justify-center">

          {/* Logo */}
          {/* On mobile: part of flex (left). On desktop: absolute left. */}
          <Link
            href="/"
            className="flex items-center md:absolute md:left-0" // Add md:absolute and md:left-0
          >
            <Image
              src="/logo1.png"
              alt="Cloudwise"
              width={240}
              height={90}
            />
          </Link>

          {/* Desktop Navigation - Hidden on mobile, centered on desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {NAVIGATION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-text-body hover:text-brand-secondary transition-colors',
                  pathname === link.href && 'text-brand-secondary font-large'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Get a Quote Button - Hidden on mobile. On desktop: absolute right. */}
          <div className="hidden md:block md:absolute md:right-1"> {/* Add md:absolute and md:right-1 */}
            <QuoteForm
              trigger={
                <Button className="bg-brand-primary hover:bg-brand-primary/90 text-[#97D6DF]">
                  Get a Quote
                </Button>
              }
            />
          </div>

          {/* Mobile menu button - Only visible on mobile, positioned by flexbox */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-body hover:text-brand-secondary p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Conditionally rendered based on isOpen state */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-b border-gray-200">
            {NAVIGATION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium text-text-body hover:text-brand-secondary hover:bg-gray-50',
                  pathname === link.href && 'text-brand-secondary bg-gray-50'
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}