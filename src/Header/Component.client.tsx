'use client'
import Link from 'next/link'
import React, { useState, useCallback } from 'react'

import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav/index'
import { MobileMenu } from './MobileMenu'
import CTAButton from '@/components/CTAButton'

interface HeaderClientProps {
  data: Header
  isHeaderDark: boolean
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, isHeaderDark }) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const openMenu = useCallback(() => setMobileOpen(true), [])
  const closeMenu = useCallback(() => setMobileOpen(false), [])
  const toggleMenu = useCallback(() => setMobileOpen((v) => !v), [])

  return (
    <header
      className={`container relative z-10 w-full max-w-full ${isHeaderDark ? 'header-dark' : 'header-light'}`}
    >
      <div className="py-6 flex justify-between max-w-7xl mx-auto px-4 md:px-8">
        <Link href="/" aria-label="Go to home">
          <Logo />
        </Link>

        <div className="flex md:gap-8 items-center">
          {/* Desktop nav remains the same */}
          <HeaderNav data={data} />

          {/* Mobile trigger */}
          <button
            type="button"
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
            className="block md:hidden p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          </button>

          <div className="rounded-full  bg-transparent hover:bg-[linear-gradient(189.22deg,rgba(58,255,208,0)_1.35%,#3AFFD0_93.77%)] p-[1px]">
            <CTAButton
              className="hidden md:inline-flex"
              type="button"
              href={data.cta.link}
              label={data.cta.label}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu portalized inline (keeps things simple) */}
      <div id="mobile-menu">
        <MobileMenu open={mobileOpen} onClose={closeMenu} data={data} />
      </div>
    </header>
  )
}
