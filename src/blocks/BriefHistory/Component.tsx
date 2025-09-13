// components/blocks/BenefitsGrid/Component.tsx
import * as React from 'react'
import { BenefitsGridBlock as BenefitsGridBlockProps } from '@/payload-types'
import Image from 'next/image'
const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ')

export default function BenefitsGridBlock(data: BenefitsGridBlockProps) {
  return (
    <section className={`mx-auto max-w-7xl px-6 py-16 md:px-8`}>
      <h2 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-black md:text-5xl">
        {data.heading}
      </h2>

      {data.intro ? <p className="mt-6 max-w-3xl text-[24px] leading-8">{data.intro}</p> : null}

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {data.items.map((item, idx) => {
          const iconUrl = typeof item.icon !== 'string' ? item.icon.url : '#'
          return (
            <article
              key={item.id || item.heading + idx}
              className={cx('relative overflow-hidden rounded-2xl border p-6 md:p-8')}
            >
              <div className="flex flex-col items-start gap-4">
                <div
                  className={cx(
                    'flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/5 bg-[#1C1D38] ',
                  )}
                >
                  {iconUrl ? (
                    // If you prefer next/image, swap to <Image> here.
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
                  <h3 className="text-lg font-medium text-black text-[24px]">{item.heading}</h3>
                  <p className="mt-2 text-[20px] leading-relaxed text-[#6B6B6B]">{item.body}</p>

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
