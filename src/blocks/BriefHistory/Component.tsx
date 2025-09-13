// components/blocks/BriefHistory/Component.tsx
import * as React from 'react'
import Image from 'next/image'
import type { BriefHistory } from '@/payload-types'

type Props = BriefHistory

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ')

function getMediaUrl(m?: any): string | null {
  if (!m) return null
  const url =
    typeof m === 'string'
      ? m
      : m?.sizes?.large?.url || m?.sizes?.og?.url || m?.url || m?.thumbnailURL || null
  if (!url) return null
  return url.startsWith('http') ? url : url // keep relative for Next to serve
}

export default function BriefHistoryBlock(data: Props) {
  console.log('history data > ', data)
  const url = getMediaUrl(data.sectionImage) || 'https://placehold.co/960x540/svg?text=Grafico'
  const alt = typeof data.sectionImage !== 'string' ? data.sectionImage?.alt : 'Gráfico'

  return (
    <section className="w-full bg-[#EDEDED]">
      <div className="mx-auto max-w-7xl px-6 md:px-8 py-12 md:p-20">
        {/* Heading + description */}
        <header className="">
          <h2
            className="text-[28px] font-semibold text-[#0A0A0A] md:text-[40px] md:mr-20"
            style={{ lineHeight: '130%' }}
          >
            {data.heading}
          </h2>
          {data.description ? (
            <p className="mt-4  md:text-[24px] !lh-150 ">{data.description}</p>
          ) : null}
        </header>

        {/* Chart card */}
        <figure className={cx('mt-10 md:mt-12 ')} aria-labelledby="chart-title">
          <div className="relative">
            {/* Image */}
            <div className="w-full border border-[#E0E0E0]">
              {/* Keep a stable aspect on load to prevent CLS */}
              <div className="relative w-full aspect-[16/10]">
                {/* If your Next config allows your Payload domain, keep <Image />; otherwise swap to <img> */}
                <Image
                  src={url}
                  alt={alt || 'history'}
                  fill
                  sizes="(min-width: 1024px) 1024px"
                  className="object-contain md:object-contain"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </figure>
      </div>
    </section>
  )
}
