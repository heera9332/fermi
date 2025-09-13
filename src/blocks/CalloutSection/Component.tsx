// components/blocks/CalloutSection/Component.tsx
'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { CalloutSectionBlock as CalloutSectionBlockProps } from '@/payload-types'

export default function CalloutSectionBlock(data: CalloutSectionBlockProps) {
  const heading = data.heading || ''
  const highlight = data.headingHighlighted || ''
  const description = data.description || ''
  const ctaLabel = data.cta?.label || 'Saiba Mais'
  const ctaHref = data.cta?.link || '#'
  const ctaNewTab = Boolean(data.cta?.newTab)

  return (
    <section className="relative w-full overflow-hidden bg-[#030531]">
      {/* dotted background layer */}
      <Image
        src="/assets/icons/svg/dots.svg"
        alt=""
        width={1000}
        height={1000}
        className="object-contain absolute top-0 w-full pointer-events-none"
        priority={false}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-24">
        {/* callout card */}

        <div className="mx-auto max-w-5xl rounded-[28px]   bg-gradient-to-b from-[#040f4a] via-[#091f7f] to-[#003896] px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.25)] md:px-12 md:py-12">
          {/* heading */}
          <h2 className="text-center text-[24px] font-semibold text-white md:text-[40px] lh-130">
            {heading} <span className="text-[#21F2C0]">{highlight}</span>
          </h2>

          {/* description */}
          {description ? (
            <p className="mx-auto mt-4 max-w-3xl text-center text-white md:mt-5 text-[24px] !lh-150">
              {description}
            </p>
          ) : null}

          {/* CTA */}
          <div className="mt-7 flex justify-center md:mt-8">
            <Link
              href={ctaHref}
              target={ctaNewTab ? '_blank' : undefined}
              rel={ctaNewTab ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[24px] text-[#0B0E2A] shadow-sm transition-[transform,box-shadow] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 active:scale-[0.98]"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
