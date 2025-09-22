'use client'

import * as React from 'react'
import Image from 'next/image'
import type { HowWeWork } from '@/payload-types'
import { HowWeWorkMobile } from './HowWeWorkMobile'

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

  const hoverTimer = React.useRef<number | null>(null)

  if (!steps.length) return null

  function armHover(i: number) {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
    // small delay prevents flicker while moving the mouse vertically
    hoverTimer.current = window.setTimeout(() => setActive(i), 10)
  }

  function clearHoverTimer() {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current)
  }

  return (
    <section className="relative overflow-hidden bg-[#EDEDED] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-[90%] max-w-7xl">
        <HowWeWorkMobile heading={heading} description={description} steps={steps} />

        <div className="hidden lg:grid grid-cols-12 gap-12">
          {/* LEFT SIDE */}
          <div className="lg:col-span-5">
            {heading && <h2 className="font-black lh-130 text-[40px]">{heading}</h2>}
            {description && <p className="mt-4 text-[24px] lh-150 text-black/70">{description}</p>}

            <ol className="mt-8 space-y-2 sm:space-y-3">
              {steps.map((s, i) => {
                const num = (i + 1).toString().padStart(2, '0')
                const selected = i === active
                return (
                  <li
                    key={s.id ?? i}
                    onMouseLeave={clearHoverTimer}
                    className={selected ? 'border-l border-black' : ''}
                  >
                    <button
                      type="button"
                      onMouseEnter={() => armHover(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={[
                        // layout
                        'group relative flex w-full items-center justify-between gap-3 rounded-md px-3 md:py-4 md:px-4 text-left',
                        'text-[24px] lh-150',
                        // smooth bg + subtle shadow
                        'transition-[background-color,box-shadow,transform] duration-300 ease-out ',
                        // press feel
                        'active:scale-[0.99]',
                        // focus ring
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10',
                      ].join(' ')}
                    >
                      {/* left divider + text */}
                      <span className="flex min-w-0 items-center gap-3">
                        <span
                          className={[
                            'font-medium tabular-nums',
                            'transition-colors duration-300 ease-out',
                            selected ? 'text-black' : 'text-black/40',
                          ].join(' ')}
                        >
                          {num}
                        </span>

                        <span
                          className={[
                            'truncate font-medium sm:text-lg',
                            'transition-colors duration-300 ease-out',
                            selected ? 'text-black' : 'text-black/60 group-hover:text-black/80',
                          ].join(' ')}
                          title={s.heading ?? ''}
                        >
                          {s.heading}
                        </span>
                      </span>

                      {/* chevron that reservers no space initially and slides in */}
                      {selected && (
                        <svg
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20.7806 13.4178L14.0306 20.1678C13.8899 20.3085 13.699 20.3876 13.5 20.3876C13.301 20.3876 13.1101 20.3085 12.9694 20.1678C12.8286 20.027 12.7496 19.8362 12.7496 19.6371C12.7496 19.4381 12.8286 19.2472 12.9694 19.1065L18.4397 13.6371H3.75C3.55109 13.6371 3.36032 13.5581 3.21967 13.4175C3.07902 13.2768 3 13.086 3 12.8871C3 12.6882 3.07902 12.4975 3.21967 12.3568C3.36032 12.2162 3.55109 12.1371 3.75 12.1371H18.4397L12.9694 6.66776C12.8286 6.52703 12.7496 6.33616 12.7496 6.13714C12.7496 5.93811 12.8286 5.74724 12.9694 5.60651C13.1101 5.46578 13.301 5.38672 13.5 5.38672C13.699 5.38672 13.8899 5.46578 14.0306 5.60651L20.7806 12.3565C20.8504 12.4262 20.9057 12.5089 20.9434 12.5999C20.9812 12.691 21.0006 12.7886 21.0006 12.8871C21.0006 12.9857 20.9812 13.0833 20.9434 13.1743C20.9057 13.2654 20.8504 13.3481 20.7806 13.4178Z"
                            fill="black"
                          />
                        </svg>
                      )}
                    </button>
                  </li>
                )
              })}
            </ol>
          </div>
          {/* RIGHT SIDE */}
          <div className="lg:col-span-7">
            {steps.map((s, i) => {
              if (i !== active) return null
              const url = mediaUrl(s.image)
              return (
                <div
                  key={i}
                  className="
                    will-change-[transform,opacity] transform-gpu
                    transition-all duration-500 ease-[cubic-bezier(0.1,1,0.1,1)]
                    opacity-0 -translate-y-6
                  "
                >
                  {/* IMAGE PANEL */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                    {url ? (
                      <Image
                        src={url}
                        alt={s.image?.alt || s.heading || 'Preview'}
                        fill
                        className="rounded-xl object-cover"
                        sizes="(min-width: 1024px) 720px, 100vw"
                        priority={i === 0}
                        onLoad={(e) => {
                          // trigger the animation by removing the hidden state
                          e.currentTarget.parentElement?.parentElement?.classList.remove(
                            'opacity-0',
                            '-translate-y-6',
                          )
                          e.currentTarget.parentElement?.parentElement?.classList.add(
                            'opacity-100',
                            'translate-y-0',
                          )
                        }}
                      />
                    ) : (
                      <div className="h-full w-full rounded-2xl bg-black/5" />
                    )}
                  </div>

                  {/* STEP CONTENT BELOW IMAGE */}
                  <div className="mx-auto mt-8 max-w-3xl relative z-20">
                    <div className="text-2xl font-black lh-150 sm:text-3xl md:text-4xl">
                      {String(i + 1).padStart(2, '0')} {s.heading}
                    </div>
                    {s.description && (
                      <p className="mt-4 text-lg leading-8 text-black/70">{s.description}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
