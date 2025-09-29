'use client'

import * as React from 'react'
import Image from 'next/image'
import type { AboutSplitBlock as Props } from '@/payload-types'

function mediaUrl(m?: any): string | null {
  if (!m) return null
  const u =
    typeof m === 'string'
      ? m
      : m?.sizes?.large?.url || m?.sizes?.og?.url || m?.url || m?.thumbnailURL || null
  return u ? (u.startsWith('http') ? u : u) : null // keep relative for Next to serve
}

export default function AboutSplitBlock(data: Props) {
  return (
    <section className="w-full bg-[#F2F3F4] relative section overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-20">
        <div className="flex gap-12 flex-col md:flex-row justify-between">
          {/* Text */}
          <div className="md:pt-12 md:pb-12 w-full md:w-[60%]">
            <h2 className="text-[32px] md:text-[40px] font-semibold tracking-[-0.01em] text-[#0A0A0A] leading-130 md:leading-150">
              {data.heading}
            </h2>
            {data.subheading ? (
              <p className="mt-3 text-xl md:text-2xl font-medium text-[#0A0A0A] leading-150">
                {data.subheading}
              </p>
            ) : null}
            {data.description ? (
              <div className="mt-7 space-y-5 text-xl md:text-2xl leading-150">
                {data.description
                  .split(/\n{2,}/) // paragraphs if author presses Enter twice
                  .map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
              </div>
            ) : null}
          </div>

          {/* Image */}
          <div className="md:justify-self-end h-full  w-full md:w-[40%]">
            {typeof data.image !== 'string' && (
              <Image
                src={data.image.url || '/assets/images/placeholder.png'}
                alt={data.image?.alt || ''}
                width={1000}
                height={1000}
                className="object-contain md:max-w-[500px] w-full rounded-xl"
                priority={false}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
