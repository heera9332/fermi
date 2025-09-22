'use client'

import * as React from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

import type { HowWeWork } from '@/payload-types'

function mediaUrl(m?: any): string | null {
  if (!m) return null
  const u =
    typeof m === 'string'
      ? m
      : m?.sizes?.medium?.url || m?.sizes?.small?.url || m?.url || m?.thumbnailURL || null
  return u || null
}

type Props = Pick<HowWeWork, 'heading' | 'description' | 'steps'>

export function HowWeWorkMobile({ heading, description, steps = [] }: Props) {
  const prevRef = React.useRef<HTMLButtonElement | null>(null)
  const nextRef = React.useRef<HTMLButtonElement | null>(null)

  if (!steps.length) return null

  return (
    <section className="lg:hidden relative overflow-hidden bg-[#EDEDED] py-10">
      <div className="mx-auto w-[90%] max-w-7xl">
        {heading && <h2 className="font-black text-[32px] leading-[1.2]">{heading}</h2>}
        {description && (
          <p className="mt-3 text-[18px] leading-[1.6] text-black/70">{description}</p>
        )}

        <div className="relative mt-6">
          {/* Slider */}
          <Swiper
            modules={[Navigation, A11y]}
            slidesPerView={1}
            spaceBetween={16}
            onBeforeInit={(swiper) => {
              // attach custom nav buttons
              // @ts-expect-error: Swiper types allow this at runtime
              swiper.params.navigation.prevEl = prevRef.current
              // @ts-expect-error
              swiper.params.navigation.nextEl = nextRef.current
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
          >
            {steps.map((s, i) => {
              const url = mediaUrl(s.image)
              return (
                <SwiperSlide key={s.id ?? i}>
                  {/* Image panel (same look as desktop right panel) */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
                    {url ? (
                      <Image
                        src={url}
                        alt={s.image?.alt || s.heading || 'Preview'}
                        fill
                        className="object-cover rounded-2xl"
                        sizes="100vw"
                        priority={i === 0}
                      />
                    ) : (
                      <div className="h-full w-full rounded-2xl bg-black/5" />
                    )}
                  </div>

                  {/* Text below image */}
                  <div className="mx-auto mt-6 max-w-3xl">
                    <div className="text-xl sm:text-2xl font-black leading-[1.5]">
                      {String(i + 1).padStart(2, '0')} {s.heading}
                    </div>
                    {s.description && (
                      <p className="mt-3 text-base leading-7 text-black/70">{s.description}</p>
                    )}
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {/* Arrow navigation (matches your arrow vibe) */}
          <button
            ref={prevRef}
            aria-label="Previous"
            className="z-20
                       h-10 w-10 rounded-full bg-white shadow-sm
                       flex items-center justify-center
                       transition-all duration-300 active:scale-95
                       disabled:opacity-40"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" className="-rotate-180">
              <path
                d="M20.7806 13.4178L14.0306 20.1678C13.8899 20.3085 13.699 20.3876 13.5 20.3876C13.301 20.3876 13.1101 20.3085 12.9694 20.1678C12.8286 20.027 12.7496 19.8362 12.7496 19.6371C12.7496 19.4381 12.8286 19.2472 12.9694 19.1065L18.4397 13.6371H3.75C3.55109 13.6371 3.36032 13.5581 3.21967 13.4175C3.07902 13.2768 3 13.086 3 12.8871C3 12.6882 3.07902 12.4975 3.21967 12.3568C3.36032 12.2162 3.55109 12.1371 3.75 12.1371H18.4397L12.9694 6.66776C12.8286 6.52703 12.7496 6.33616 12.7496 6.13714C12.7496 5.93811 12.8286 5.74724 12.9694 5.60651C13.1101 5.46578 13.301 5.38672 13.5 5.38672C13.699 5.38672 13.8899 5.46578 14.0306 5.60651L20.7806 12.3565C20.8504 12.4262 20.9057 12.5089 20.9434 12.5999C20.9812 12.691 21.0006 12.7886 21.0006 12.8871C21.0006 12.9857 20.9812 13.0833 20.9434 13.1743C20.9057 13.2654 20.8504 13.3481 20.7806 13.4178Z"
                fill="black"
              />
            </svg>
          </button>

          <button
            ref={nextRef}
            aria-label="Next"
            className="z-20
                       h-10 w-10 rounded-full bg-white shadow-sm
                       flex items-center justify-center
                       transition-all duration-300 active:scale-95
                       disabled:opacity-40"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" className="rotate-[0deg]">
              <path
                d="M20.7806 13.4178L14.0306 20.1678C13.8899 20.3085 13.699 20.3876 13.5 20.3876C13.301 20.3876 13.1101 20.3085 12.9694 20.1678C12.8286 20.027 12.7496 19.8362 12.7496 19.6371C12.7496 19.4381 12.8286 19.2472 12.9694 19.1065L18.4397 13.6371H3.75C3.55109 13.6371 3.36032 13.5581 3.21967 13.4175C3.07902 13.2768 3 13.086 3 12.8871C3 12.6882 3.07902 12.4975 3.21967 12.3568C3.36032 12.2162 3.55109 12.1371 3.75 12.1371H18.4397L12.9694 6.66776C12.8286 6.52703 12.7496 6.33616 12.7496 6.13714C12.7496 5.93811 12.8286 5.74724 12.9694 5.60651C13.1101 5.46578 13.301 5.38672 13.5 5.38672C13.699 5.38672 13.8899 5.46578 14.0306 5.60651L20.7806 12.3565C20.8504 12.4262 20.9057 12.5089 20.9434 12.5999C20.9812 12.691 21.0006 12.7886 21.0006 12.8871C21.0006 12.9857 20.9812 13.0833 20.9434 13.1743C20.9057 13.2654 20.8504 13.3481 20.7806 13.4178Z"
                fill="black"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
