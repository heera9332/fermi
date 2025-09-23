// src/blocks/TestimonialCardBlock.tsx
'use client'

import * as React from 'react'
import Image from 'next/image'
import type { TestimonialCardBlock as TestimonialCardBlockProps } from '@/payload-types'

// Swiper (React)
import { Swiper, SwiperSlide } from 'swiper/react'
import { A11y, Keyboard, EffectCards, Autoplay } from 'swiper/modules'

// Swiper styles
import 'swiper/css'
import 'swiper/css/effect-cards'

// ---- Media helpers (unchanged) ----
type MediaAny =
  | (NonNullable<TestimonialCardBlockProps['author']>['avatar'] & { url?: string })
  | (NonNullable<TestimonialCardBlockProps['company']>['logo'] & { url?: string })
  | { url?: string; alt?: string }
  | string
  | null
  | undefined

function mediaURL(m: MediaAny): string | undefined {
  if (!m || typeof m === 'string') return undefined
  const a: any = m
  return a?.sizes?.small?.url || a?.sizes?.square?.url || a?.thumbnailURL || a?.url
}

function mediaAlt(m: MediaAny, fallback = ''): string {
  if (!m || typeof m === 'string') return fallback
  return (m as any)?.alt ?? fallback
}

// ---- Local item type (robust to schema typos) ----
type QuoteItem = {
  quote?: string | null
  author?: {
    name?: string | null
    role?: string | null
    avatar?: MediaAny
  } | null
  company?: {
    logo?: MediaAny
    link?: string | null
    newTab?: boolean | null
  } | null
}

export const TestimonialCardBlock = (data: TestimonialCardBlockProps) => {
  // Support both `quotes` and the current `quetes`
  const items: QuoteItem[] = (data as any).quotes ?? (data as any).quetes ?? []
  if (!Array.isArray(items) || items.length === 0) return null

  return (
    <section className="bg-[#EDEDED] py-24 md:py-48 overflow-hidden relative section z-10">
      <div className="ml-4 mr-8 md:mx-auto max-w-7xl  md:px-6">
        <Swiper
          modules={[A11y, Keyboard, EffectCards, Autoplay]}
          effect="cards"
          grabCursor
          // nice defaults for EffectCards; keep subtle
          cardsEffect={{
            slideShadows: true,
            perSlideOffset: 3,
          }}
          keyboard={{ enabled: true }}
          a11y={{ enabled: true }}
          loop
          autoplay={{ delay: 6000, disableOnInteraction: true, pauseOnMouseEnter: true }}
          className="max-w-5xl mx-auto"
        >
          {items.map((item, idx) => {
            const { quote, author, company } = item || {}
            const avatarSrc = mediaURL(author?.avatar)
            const avatarAlt = mediaAlt(author?.avatar, author?.name || 'avatar')
            const companyLogoSrc = mediaURL(company?.logo)
            const companyLogoAlt = mediaAlt(company?.logo, 'company')

            return (
              <SwiperSlide key={idx} className="!p-0 rounded-2xl">
                <div className="relative w-full">
                  {/* main card — your original design */}
                  <article className="relative z-10 rounded-2xl bg-white p-5 shadow-sm sm:p-6 md:p-8">
                    {quote && (
                      <blockquote className="pb-4 text-balance text-base/7 sm:text-lg/8 md:text-2xl/9">
                        {quote}
                      </blockquote>
                    )}

                    <hr className="my-2 border-black/10" />

                    <div className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between sm:pt-6">
                      {/* author */}
                      <div className="flex min-w-0 items-center gap-3">
                        {avatarSrc ? (
                          <Image
                            src={avatarSrc}
                            alt={avatarAlt}
                            width={48}
                            height={48}
                            className="h-10 w-10 rounded-full object-cover sm:h-12 sm:w-12"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-black/10 sm:h-12 sm:w-12" />
                        )}

                        <div className="min-w-0">
                          {author?.name && (
                            <div className="truncate text-sm font-semibold sm:text-base">
                              {author.name}
                            </div>
                          )}
                          {author?.role && (
                            <div className="truncate text-xs text-black/60 sm:text-sm">
                              {author.role}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* company */}
                      <div className="shrink-0">
                        {companyLogoSrc ? (
                          <Image
                            src={companyLogoSrc}
                            alt={companyLogoAlt}
                            width={240}
                            height={64}
                            className="h-16 w-auto max-w-[160px] object-contain md:max-w-[200px]"
                          />
                        ) : company?.link ? (
                          <span className="block max-w-[200px] truncate text-sm text-black/60 sm:text-base">
                            {company.link}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </article>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </section>
  )
}
