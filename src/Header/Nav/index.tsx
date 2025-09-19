'use client'

import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="gap-4 md:gap-8 items-center md:flex-row flex-col hidden md:flex">
      {navItems.map(({ link }, i) => {
        return (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className="font-normal text-[20px] lh-150 relative 
             after:absolute after:bottom-0 after:left-0 
             after:h-[2px] after:w-full after:origin-left 
             after:scale-x-0 after:bg-current after:transition-transform 
             after:duration-300 hover:after:scale-x-100"
          />
        )
      })}
    </nav>
  )
}
