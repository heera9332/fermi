'use client'
import Link from 'next/link'
import React, { useState, useCallback } from 'react'

import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav/index'
import { MobileMenu } from './MobileMenu'

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

        <div className="flex gap-4 md:gap-8 items-center">
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

          {/* Desktop CTA unchanged */}
          <Link
            href={data.cta.link}
            className="hidden group md:inline-flex items-center justify-center
            rounded-full bg-white px-4 py-3 text-[24px] text-[#0B0E2A]
            active:scale-[0.98]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60
            transition-all duration-50 ease-[cubic-bezier(0.22,1,0.36,1)] cta"
          >
            {data.cta.label}
            <span
              className="ml-0 max-w-0 overflow-hidden opacity-0
              group-hover:ml-3 group-hover:max-w-[40px] group-hover:opacity-100
              transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
              flex items-center"
            >
              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-[305deg] w-8 h-8  transition-transform duration-500"
              >
                <path
                  d="M20.7806 13.4178L14.0306 20.1678C13.8899 20.3085 13.699 20.3876 13.5 20.3876C13.301 20.3876 13.1101 20.3085 12.9694 20.1678C12.8286 20.027 12.7496 19.8362 12.7496 19.6371C12.7496 19.4381 12.8286 19.2472 12.9694 19.1065L18.4397 13.6371H3.75C3.55109 13.6371 3.36032 13.5581 3.21967 13.4175C3.07902 13.2768 3 13.086 3 12.8871C3 12.6882 3.07902 12.4975 3.21967 12.3568C3.36032 12.2162 3.55109 12.1371 3.75 12.1371H18.4397L12.9694 6.66776C12.8286 6.52703 12.7496 6.33616 12.7496 6.13714C12.7496 5.93811 12.8286 5.74724 12.9694 5.60651C13.1101 5.46578 13.301 5.38672 13.5 5.38672C13.699 5.38672 13.8899 5.46578 14.0306 5.60651L20.7806 12.3565C20.8504 12.4262 20.9057 12.5089 20.9434 12.5999C20.9812 12.691 21.0006 12.7886 21.0006 12.8871C21.0006 12.9857 20.9812 13.0833 20.9434 13.1743C20.9057 13.2654 20.8504 13.3481 20.7806 13.4178Z"
                  fill="black"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu portalized inline (keeps things simple) */}
      <div id="mobile-menu">
        <MobileMenu open={mobileOpen} onClose={closeMenu} data={data} />
      </div>
    </header>
  )
}
