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
          <div className="mt-7 flex justify-center md:mt-8 group gap-4">
            <Link
              href={ctaHref}
              target={ctaNewTab ? '_blank' : undefined}
              rel={ctaNewTab ? 'noopener noreferrer' : undefined}
              className="    group inline-flex items-center justify-center gap-4
    rounded-full bg-white px-6 py-3 text-[24px] text-[#0B0E2A]
    shadow-sm hover:shadow-md active:scale-[0.98]
    focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60
    transition-shadow delay-200"
            >
              {ctaLabel}

              <svg
                width="24"
                height="25"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="rotate-[305deg] hidden group-hover:block    /* smoother + GPU-accelerated enter */
      opacity-0 translate-x-1 scale-95
      group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100

      transform-gpu will-change-[transform,opacity]
      transition-[opacity,transform]
      duration-500 delay-200
      ease-[cubic-bezier(0.22,1,0.36,1)]  /* 'back' style ease-out */"
              >
                <path
                  d="M20.7806 13.4178L14.0306 20.1678C13.8899 20.3085 13.699 20.3876 13.5 20.3876C13.301 20.3876 13.1101 20.3085 12.9694 20.1678C12.8286 20.027 12.7496 19.8362 12.7496 19.6371C12.7496 19.4381 12.8286 19.2472 12.9694 19.1065L18.4397 13.6371H3.75C3.55109 13.6371 3.36032 13.5581 3.21967 13.4175C3.07902 13.2768 3 13.086 3 12.8871C3 12.6882 3.07902 12.4975 3.21967 12.3568C3.36032 12.2162 3.55109 12.1371 3.75 12.1371H18.4397L12.9694 6.66776C12.8286 6.52703 12.7496 6.33616 12.7496 6.13714C12.7496 5.93811 12.8286 5.74724 12.9694 5.60651C13.1101 5.46578 13.301 5.38672 13.5 5.38672C13.699 5.38672 13.8899 5.46578 14.0306 5.60651L20.7806 12.3565C20.8504 12.4262 20.9057 12.5089 20.9434 12.5999C20.9812 12.691 21.0006 12.7886 21.0006 12.8871C21.0006 12.9857 20.9812 13.0833 20.9434 13.1743C20.9057 13.2654 20.8504 13.3481 20.7806 13.4178Z"
                  fill="black"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
