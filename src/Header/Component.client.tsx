'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'
import { Button } from '@/components/ui/button'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  return (
    <header
      className="header-dark container relative z-20 w-full max-w-full"
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="py-6 flex justify-between max-w-8xl mx-auto px-4">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex gap-4 md:gap-8 items-center">
          <HeaderNav data={data} />
          <Button className="  rounded-full font-normal cta">Fale Conosco</Button>
        </div>
      </div>
    </header>
  )
}
