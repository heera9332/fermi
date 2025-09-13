'use client'
import Link from 'next/link'
import React, { useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { Button } from '@/components/ui/button'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [_mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="header-dark container relative z-20 w-full max-w-full">
      <div className="py-6 flex justify-between max-w-8xl mx-auto px-4">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex gap-4 md:gap-8 items-center">
          <HeaderNav data={data} />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-menu-icon lucide-menu block md:hidden cursor-pointer"
            onClick={() => setMobileOpen}
          >
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
          </svg>

          <Button className="h-14 rounded-full px-6 cta hidden md:block font-normal text-[20px] lh-130">
            Fale Conosco
          </Button>
        </div>
      </div>
    </header>
  )
}
