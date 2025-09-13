// src/blocks/HeroCtaShowcaseBlock.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'
import type { HeroCtaShowcaseBlock as HeroCtaShowcaseBlockProps } from 'src/payload-types'

type MediaDoc =
  | (NonNullable<HeroCtaShowcaseBlockProps['sectionImage']> & { url?: string })
  | { url?: string; alt?: string }
  | string
  | null
  | undefined

function mediaURL(m: MediaDoc): string | undefined {
  if (!m || typeof m === 'string') return undefined
  // Prefer responsive sizes if present
  const anyM = m as any
  return (
    anyM?.sizes?.xlarge?.url || anyM?.sizes?.large?.url || anyM?.sizes?.medium?.url || anyM?.url
  )
}

function mediaAlt(m: MediaDoc, fallback = ''): string {
  if (!m || typeof m === 'string') return fallback
  return (m as any)?.alt ?? fallback
}

function targetRel(newTab?: boolean) {
  return newTab ? { target: '_blank', rel: 'noreferrer noopener' } : {}
}

export const HeroCtaShowcaseBlock: React.FC<HeroCtaShowcaseBlockProps> = (data) => {
  const { title, titleHighlighted, content, cta, companies = [], sectionImage } = data

  const bgSrc = mediaURL(sectionImage)
  const bgAlt = mediaAlt(sectionImage, 'background')

  return (
    <section className="relative overflow-hidden text-white bg-[#030531] pt-16">
      {/* Background image + tint */}
      <div className="relative max-w-8xl mx-auto px-4 md:px-20">
        {bgSrc ? (
          <>
            <Image
              src={bgSrc}
              alt={bgAlt}
              height={1000}
              width={1000}
              sizes="100vw"
              priority
              className="object-cover w-full md:rounded-2xl"
            />
            {/* dark navy tint to increase contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030531] via-[#030531]/60 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="h-full w-full bg-[#030531]" />
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-10">
        <div className="relative mx-auto flex min-h-[60vh] md:-mt-[60vh] max-w-4xl flex-col items-center justify-center   text-center">
          {/* Title */}
          {(title || titleHighlighted) && (
            <h1 className="text-balance text-3xl font-semibold sm:text-4xl md:text-5xl !leading-[100%] md:!leading-[130%]">
              {title}{' '}
              <p>
                {titleHighlighted && <span className="text-[#21F2C0]">{titleHighlighted}</span>}
              </p>
            </h1>
          )}

          {/* Subtitle */}
          {content && (
            <p className="mx-auto mt-4 max-w-3xl text-pretty !leading-[130%]">{content}</p>
          )}

          {/* CTA */}
          {cta?.label && cta?.link && (
            <div className="mt-8">
              <Link
                href={cta.link}
                {...targetRel(cta.newTab)}
                className="inline-flex items-center rounded-full bg-white px-6 py-3  text-black shadow-sm transition  !leading-[100%] text-[18px]"
              >
                {cta.label}
              </Link>
            </div>
          )}
        </div>

        {/* Companies (max 3) */}
        {companies && companies.length > 0 && (
          <div className="mx-auto mb-8 mt-2 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-3">
            {companies.slice(0, 3).map((c, idx) => {
              const logo = (c as any)?.logo
              const logoSrc =
                (logo?.sizes?.small?.url ||
                  logo?.sizes?.square?.url ||
                  logo?.thumbnailURL ||
                  logo?.url) ??
                undefined
              const alt = logo?.alt || 'company'

              return (
                <div
                  key={(c as any)?.id ?? idx}
                  className="flex items-center gap-4 rounded-xl/40 px-4 py-3"
                >
                  {logoSrc ? (
                    <Image
                      src={logoSrc}
                      alt={alt}
                      width={1000}
                      height={1000}
                      className="w-full h-full shrink-0 object-contain"
                      quality={100}
                    />
                  ) : (
                    <div className="w-full h-full rink-0 rounded bg-white/10" />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
