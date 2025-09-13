'use client'

import * as React from 'react'
import Image from 'next/image'
import type { HowWeWork } from '@/payload-types'

function mediaUrl(m?: any): string | null {
  if (!m) return null
  const u =
    typeof m === 'string'
      ? m
      : m?.sizes?.medium?.url || m?.sizes?.small?.url || m?.url || m?.thumbnailURL || null
  return u || null
}

export const HowWeWorkBlock: React.FC<HowWeWork> = (data) => {
  const { heading, description, steps = [] } = data || {}
  const [active, setActive] = React.useState(0)
  if (!steps.length) return null

  return (
    <section className="relative overflow-hidden bg-[#EDEDED] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-[90%] max-w-7xl">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* LEFT SIDE */}
          <div className="lg:col-span-5">
            {heading && <h2 className="font-black lh-130 text-[40px]">{heading}</h2>}
            {description && <p className="mt-4 text-[24px] lh-150 text-black/70">{description}</p>}

            <ol className="mt-8 space-y-2 sm:space-y-3">
              {steps.map((s, i) => {
                const num = (i + 1).toString().padStart(2, '0')
                const selected = i === active
                return (
                  <li key={s.id ?? i}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={[
                        'group flex w-full items-center justify-between gap-3 rounded-md px-3 py-3 text-left transition-colors sm:px-4 text-[24px] lh-150',
                        selected ? 'bg-white' : 'hover:bg-white/60 focus:bg-white/60',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'flex min-w-0 items-center gap-3',
                          selected ? 'text-black' : 'text-black/35',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'h-6 w-px shrink-0 rounded transition-all sm:h-7',
                            selected ? 'bg-black' : 'bg-black/20',
                          ].join(' ')}
                          aria-hidden
                        />
                        <span className="font-medium tabular-nums">{num}</span>
                        <span className="truncate font-medium sm:text-lg">{s.heading}</span>
                      </span>

                      <span
                        className={[
                          'shrink-0 transition-opacity',
                          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50',
                        ].join(' ')}
                      >
                        →
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-7">
            {/* IMAGE PANEL */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-xl">
                {steps.map((s, i) => {
                  const url = mediaUrl(s.image)
                  const isActive = i === active
                  return (
                    <div
                      key={s.id ?? i}
                      className={`absolute inset-0 transition-all duration-500 ease-out ${
                        isActive
                          ? 'opacity-100 translate-y-0'
                          : 'opacity-0 -translate-y-12 pointer-events-none'
                      }`}
                    >
                      {url ? (
                        <Image
                          src={url}
                          alt={s.image?.alt || s.heading || 'Preview'}
                          fill
                          className="rounded-xl object-cover"
                          sizes="(min-width: 1024px) 720px, 100vw"
                          priority={i === 0}
                        />
                      ) : (
                        <div className="h-full w-full rounded-xl bg-black/5" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* STEP CONTENT BELOW IMAGE */}
            <div
              key={active}
              className="mx-auto mt-8 max-w-3xl transition-all duration-500 ease-out opacity-0 -translate-y-4 animate-[fadeIn_0.5s_forwards]"
            >
              <div className="text-2xl font-black lh-150 sm:text-3xl md:text-4xl">
                {String(active + 1).padStart(2, '0')} {steps[active]?.heading}
              </div>
              {steps[active]?.description && (
                <p className="mt-4 text-lg leading-8 text-black/70">{steps[active].description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
