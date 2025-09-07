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
    <section className="bg-[#EFEFEF] py-12 sm:py-16 lg:py-24">
      <Container>
        <div className="relative mx-auto max-w-4xl">
          {/* stacked “paper” layers */}
          <div className="pointer-events-none absolute inset-x-6 -top-5 -z-10 hidden h-40 rounded-2xl bg-black/5 sm:block" />
          <div className="pointer-events-none absolute inset-x-3 -top-2 -z-10 hidden h-44 rounded-2xl bg-black/5 sm:block" />

          {/* main card */}
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/10 sm:p-8">
            {/* quote */}
            {quote && (
              <blockquote className="text-pretty text-lg/8 sm:text-xl/8 md:text-2xl/9 pb-4">
                {quote}
              </blockquote>
            )}

            {/* divider */}
            <hr className="my-2 border-black/10" />

            {/* footer row */}
            <div className="flex items-center justify-between gap-6 pt-6">
              {/* author */}
              <div className="flex min-w-0 items-center gap-3">
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt={avatarAlt}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-black/10" />
                )}

                <div className="min-w-0">
                  {author?.name && (
                    <div className="truncate text-sm font-semibold md:text-base">{author.name}</div>
                  )}
                  {author?.role && (
                    <div className="truncate text-xs text-black/60 md:text-sm">{author.role}</div>
                  )}
                </div>
              </div>

              {/* company logo (right) */}
              <div className="shrink-0">
                {companyLogoSrc ? (
                  <Image
                    src={companyLogoSrc}
                    alt={companyLogoAlt}
                    width={1000}
                    height={1000}
                    className="w-full h-16 object-cover"
                  />
                ) : // if no logo, show text if provided (your “link” is being used as company name in sample data)
                company?.link ? (
                  <span className="text-sm text-black/60">{company.link}</span>
                ) : null}
              </div>
            </div>
          </article>
        </div>
      </Container>
    </section>
  )
}
