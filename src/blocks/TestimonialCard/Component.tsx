// src/blocks/TestimonialCardBlock.tsx
'use client'

import Image from 'next/image'
import * as React from 'react'
import type { TestimonialCardBlock as TestimonialCardBlockProps } from '@/payload-types'

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

export const TestimonialCardBlock = (data: TestimonialCardBlockProps) => {
  const { quote, author, company, disableInnerContainer } = data

  const avatarSrc = mediaURL(author?.avatar)
  const avatarAlt = mediaAlt(author?.avatar, author?.name || 'avatar')

  const companyLogoSrc = mediaURL(company?.logo)
  const companyLogoAlt = mediaAlt(company?.logo, 'company')

  const Container: React.FC<React.PropsWithChildren> = ({ children }) =>
    disableInnerContainer ? (
      <>{children}</>
    ) : (
      <div className="mx-auto max-w-8xl px-6">{children}</div>
    )

  return (
    <section className="bg-[#EDEDED] py-12 sm:py-16 lg:py-24">
      <Container>
        <div className="relative mx-auto w-full max-w-4xl pl-4 pr-8 md:px-0">
          {/* stacked “paper” layers (behind) */}
          <div className="pointer-events-none absolute bottom-20 left-12 md:-top-6 md:-right-6 w-[90%] md:w-full h-full rounded-2xl bg-[#CDCDCDB2]/70 z-0"></div>
          <div className="pointer-events-none absolute -top-4 left-14 md:-top-12 md:-right-12 w-[90%] md:w-full h-full rounded-2xl bg-[#CDCDCDB2]/70 z-0"></div>

          {/* main card */}
          <article className="relative z-10 rounded-2xl bg-white p-5 shadow-sm sm:p-6 md:p-8">
            {/* quote */}
            {quote && (
              <blockquote className="pb-4 text-balance text-base/7 sm:text-lg/8 md:text-2xl/9">
                {quote}
              </blockquote>
            )}

            <hr className="my-2 border-black/10" />

            {/* footer row */}
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
                    <div className="truncate text-sm font-semibold sm:text-base">{author.name}</div>
                  )}
                  {author?.role && (
                    <div className="truncate text-xs text-black/60 sm:text-sm">{author.role}</div>
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
                    className="h-10 w-auto max-w-[160px] object-contain sm:h-14 sm:max-w-[200px]"
                  />
                ) : company?.link ? (
                  <span className="block truncate text-sm text-black/60 sm:text-base max-w-[200px]">
                    {company.link}
                  </span>
                ) : null}
              </div>
            </div>
          </article>
        </div>
      </Container>
    </section>
  )
}
