// components/blocks/CalloutSection/Component.tsx
'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { CalloutSectionBlock as CalloutSectionBlockProps } from '@/payload-types'
import CTAButton from '@/components/CTAButton'

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
        src="/assets/icons/svg/dots-mobile.svg"
        alt=""
        width={1000}
        height={1000}
        className="object-contain absolute top-0 w-full pointer-events-none block md:hidden"
        priority={false}
      />

      <Image
        src="/assets/icons/svg/dots.svg"
        alt=""
        width={1000}
        height={1000}
        className="object-contain absolute top-0 w-full pointer-events-none hidden md:block"
        priority={false}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-16 md:py-24">
        {/* callout card */}

        <div className="mx-auto max-w-5xl rounded-[28px]   bg-gradient-to-b from-[#040f4a] via-[#091f7f] to-[#003896] px-6 py-8 shadow-[0_8px_30px_rgba(0,0,0,0.25)] md:px-12 md:py-12">
          {/* heading */}
          <h2 className="text-center text-[32px] font-semibold text-white md:text-[40px] leading-130 md:leading-150">
            {heading} <span className="text-[#21F2C0]">{highlight}</span>
          </h2>

          {/* description */}
          {description ? (
            <p className="mx-auto mt-4 max-w-3xl text-center text-white md:mt-5 text-xl md:text-2xl leading-150">
              {description}
            </p>
          ) : null}

          {/* CTA */}
          <div className="mt-7 flex justify-center md:mt-8 gap-4">
            <CTAButton
              newTab={data.cta.newTab || false}
              type="button"
              href={data.cta.link}
              label={data.cta.label}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
