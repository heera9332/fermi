// components/blocks/BenefitsGrid/Component.tsx
'use client'

import * as React from 'react'
import { BenefitsGridBlock as BenefitsGridBlockProps } from '@/payload-types'
import Image from 'next/image'

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ')

export default function BenefitsGridBlock(data: BenefitsGridBlockProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // trigger animation on mount
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24 md:px-8">
      <h2 className="max-w-4xl text-3xl font-semibold lh-130 text-black md:text-5xl">
        {data.heading}
      </h2>

      {data.intro ? <p className="mt-6 max-w-3xl text-[24px] lh-150">{data.intro}</p> : null}

      <div className="mt-12 grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-3">
        {data.items?.map((item, idx) => {
          const iconUrl = typeof item.icon !== 'string' ? item.icon?.url : '#'

          return (
            <article
              key={item.id || item.heading + idx}
              style={{
                transitionDelay: `${idx * 120}ms`, // stagger each card
              }}
              className={cx(
                // base styling
                `article-card relative overflow-hidden rounded-2xl border p-6 md:p-8
                 border-gray-200 bg-white hover:border-white transition-all duration-500
                  `,
                // animation state
                'transform-gpu transition-all duration-700 ease-out',
                mounted
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8 pointer-events-none',
              )}
            >
              <div className="flex flex-col items-start gap-4 relative z-10">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/5 bg-white">
                  {iconUrl ? (
                    <Image
                      src={iconUrl}
                      alt={''}
                      className="h-8 w-8 object-contain"
                      loading="lazy"
                      width={72}
                      height={72}
                    />
                  ) : (
                    <span className="text-xl">⬆️</span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg  font-medium !lg-150 text-black md:text-2xl">
                    {item.heading}
                  </h3>
                  <p className="mt-2 text-xl !lh-150 text-[#6B6B6B]">{item.body}</p>

                  {item.link?.url && item.link?.label ? (
                    <a
                      href={item.link.url}
                      target={item.link.newTab ? '_blank' : undefined}
                      rel={item.link.newTab ? 'noopener noreferrer' : undefined}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-900 underline underline-offset-4"
                    >
                      {item.link.label}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className="h-4 w-4"
                        fill="currentColor"
                      >
                        <path d="M11 3h6v6h-2V6.41l-7.29 7.3-1.42-1.42 7.3-7.29H11V3Z" />
                        <path d="M17 17H3V3h6v2H5v10h10v-4h2v6Z" />
                      </svg>
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
