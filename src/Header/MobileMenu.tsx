'use client'

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'

type Props = {
  open: boolean
  onClose: () => void
  data: HeaderType
}

export const MobileMenu: React.FC<Props> = ({ open, onClose, data }) => {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null)

  // Body scroll lock + focus
  useEffect(() => {
    const body = document.documentElement
    if (open) {
      body.classList.add('overflow-hidden')
      const t = setTimeout(() => firstLinkRef.current?.focus(), 0)
      return () => {
        clearTimeout(t)
        body.classList.remove('overflow-hidden')
      }
    }
    body.classList.remove('overflow-hidden')
  }, [open])

  // ESC to close
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const navItems = data?.navItems || []
  const cta = data?.cta

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[98] bg-black/80 transition-opacity duration-200 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed right-0 top-0 z-[9999] h-dvh w-[86%] max-w-sm bg-[#030531] text-white md:hidden
  shadow-xl transition-transform duration-300 will-change-transform
  ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <Link href="/" aria-label="Home" className="shrink-0 font-semibold text-lg">
            {data.brand || `Fermi`}
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            aria-label="Close menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <nav className="px-5 py-4">
          <ul className="space-y-2">
            {navItems.map(({ link }, i) => (
              <li key={i}>
                <CMSLink
                  {...link}
                  appearance="link"
                  ref={i === 0 ? firstLinkRef : undefined}
                  className="block text-[18px] py-3 px-2 rounded-md
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30
                       hover:bg-white/10"
                  onClick={onClose}
                />
              </li>
            ))}
          </ul>

          {cta?.link && cta?.label && (
            <Link
              href={cta.link}
              onClick={onClose}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full
                   bg-white px-5 py-3 !text-black text-[18px]
                   active:scale-[0.98] transition
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {cta.label}
            </Link>
          )}
        </nav>
      </div>
    </>
  )
}
