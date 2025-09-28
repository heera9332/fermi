// src/blocks/HeroCtaShowcaseBlock.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'
import type { HeroCtaShowcaseBlock as HeroCtaShowcaseBlockProps, Media } from 'src/payload-types'

function mediaURL(m: Media | string): string | undefined {
  if (!m || typeof m === 'string') return undefined
  // Prefer responsive sizes if present
  const anyM = m as any
  return (
    anyM?.sizes?.xlarge?.url || anyM?.sizes?.large?.url || anyM?.sizes?.medium?.url || anyM?.url
  )
}

function mediaAlt(m: Media | string, fallback = ''): string {
  if (!m || typeof m === 'string') return fallback
  return m.alt ?? fallback
}

export const HeroCtaShowcaseBlock: React.FC<HeroCtaShowcaseBlockProps> = (data) => {
  const { title, titleHighlighted, content, cta, companies = [], sectionImage } = data
  const sectionMobileImg: Media | string = data.sectionImageMobile

  const bgSrc = mediaURL(sectionImage)
  const bgAlt = mediaAlt(sectionImage, 'background')

  return (
    <section className="relative  text-white bg-[#030531] pt-6 md:pt-16">
      <svg
        className="absolute top-0 w-full z-10 -mt-32 pointer-events-none hidden md:block"
        width="1439"
        height="880"
        viewBox="0 0 1439 880"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="79.5" y1="2.30872e-08" x2="79.4999" y2="1232" stroke="#494949" />
        <line x1="1359.5" y1="2.30872e-08" x2="1359.5" y2="1232" stroke="#494949" />
        <line x1="4.37114e-08" y1="163.5" x2="1440" y2="163.5" stroke="#494949" />
      </svg>

      <svg
        className="absolute top-0 w-full z-10 -mt-32 pointer-events-none block md:hidden"
        width="393"
        height="1019"
        viewBox="0 0 393 1019"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="20.5" y1="2.30872e-08" x2="20.4999" y2="1232" stroke="#494949" />
        <line x1="373.5" y1="2.30872e-08" x2="373.5" y2="1232" stroke="#494949" />
        <line x1="-522" y1="163.5" x2="918" y2="163.5" stroke="#494949" />
      </svg>

      {/* Background image + tint */}

      <div className="relative max-w-7xl mx-auto px-4 md:px-12 pt-4">
        {bgSrc ? (
          <>
            <Image
              src={bgSrc}
              alt={bgAlt}
              height={350}
              width={350}
              sizes="100vw"
              priority
              className="hidden md:block object-cover w-full md:rounded-2xl blur-[1px]"
            />
            {/* dark navy tint to increase contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030531] via-[#030531]/60 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="h-full w-full bg-[#030531]" />
        )}
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-10 md:pt-0 md:pb-0 pb-12">
        <div className="relative mx-auto flex min-h-[60vh] md:-mt-[60vh] max-w-4xl flex-col items-center justify-center   text-center md:pt-0">
          <div className="relative px-4 w-full">
            <Image
              className=" w-full object-contain md:rounded-2xl block md:hidden pointer-events-none z-0"
              src={sectionMobileImg?.url || '/assets/images/placeholder.webp'}
              alt={sectionMobileImg?.alt || 'ferm it'}
              height={512}
              width={512}
              sizes="100vw"
              priority
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#030531]/0 to-[#030531]/90 rounded-2xl md:rounded-2xl z-[1]" />
          </div>

          <div className="section-content relative z-[1]">
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
              <p className="mx-auto mt-4 max-w-3xl text-pretty !leading-[130%] text-xl md:text-2xl">
                {content}
              </p>
            )}

            {/* CTA */}
            {cta?.label && cta?.link && (
              <div className="mt-8">
                <Link
                  href={cta.link}
                  target={cta.newTab ? '_blank' : undefined}
                  rel={cta.newTab ? 'noopener noreferrer' : undefined}
                  className="group inline-flex items-center justify-center
                rounded-full bg-white px-6 py-3 text-[24px] text-[#0B0E2A]
                shadow-sm hover:shadow-md active:scale-[0.98]
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60
                transition-all duration-50 ease-[cubic-bezier(0.22,1,0.36,1)]"
                >
                  {cta.label}

                  <span
                    className="ml-0 max-w-0 overflow-hidden opacity-0
                  group-hover:ml-3 group-hover:max-w-[40px] group-hover:opacity-100
                  transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                  flex items-center"
                  >
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="rotate-[305deg] w-8 h-8  transition-transform duration-500"
                    >
                      <path
                        d="M20.7806 13.4178L14.0306 20.1678C13.8899 20.3085 13.699 20.3876 13.5 20.3876C13.301 20.3876 13.1101 20.3085 12.9694 20.1678C12.8286 20.027 12.7496 19.8362 12.7496 19.6371C12.7496 19.4381 12.8286 19.2472 12.9694 19.1065L18.4397 13.6371H3.75C3.55109 13.6371 3.36032 13.5581 3.21967 13.4175C3.07902 13.2768 3 13.086 3 12.8871C3 12.6882 3.07902 12.4975 3.21967 12.3568C3.36032 12.2162 3.55109 12.1371 3.75 12.1371H18.4397L12.9694 6.66776C12.8286 6.52703 12.7496 6.33616 12.7496 6.13714C12.7496 5.93811 12.8286 5.74724 12.9694 5.60651C13.1101 5.46578 13.301 5.38672 13.5 5.38672C13.699 5.38672 13.8899 5.46578 14.0306 5.60651L20.7806 12.3565C20.8504 12.4262 20.9057 12.5089 20.9434 12.5999C20.9812 12.691 21.0006 12.7886 21.0006 12.8871C21.0006 12.9857 20.9812 13.0833 20.9434 13.1743C20.9057 13.2654 20.8504 13.3481 20.7806 13.4178Z"
                        fill="black"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Companies (max 3) */}
        {companies && companies.length > 0 && (
          <div className="mx-auto pb-8 mt-2 grid max-w-6xl grid-cols-1 gap-0 md:gap-6 sm:grid-cols-3">
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
                  className="flex items-center gap-4 rounded-xl/40 px-4 md:py-3"
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
