import CTAButton from '@/components/CTAButton'
import Image from 'next/image'
import Head from 'next/head'
import * as React from 'react'
import type { HeroCtaShowcaseBlock as HeroCtaShowcaseBlockProps, Media } from 'src/payload-types'

function mediaURL(m: Media | string): string | undefined {
  if (!m || typeof m === 'string') return undefined
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

  const mobileSrc =
    (sectionMobileImg as any)?.sizes?.large?.url ||
    (sectionMobileImg as any)?.sizes?.medium?.url ||
    (sectionMobileImg as any)?.url ||
    '/assets/images/placeholder.webp'
  const mobileAlt = (sectionMobileImg as any)?.alt || 'ferm it'

  return (
    <section className="relative  text-white bg-[#030531] pt-6 md:pt-16">
      {/* Preload only—no visual change */}
      <Head>
        {bgSrc && (
          <link
            rel="preload"
            as="image"
            href={bgSrc}
            sizes="(max-width: 1536px) 100vw, 1536px"
            // if you have srcset variants, you can add `imagesrcset=""` here
            fetchPriority="high"
          />
        )}
        {mobileSrc && (
          <link rel="preload" as="image" href={mobileSrc} sizes="100vw" fetchPriority="high" />
        )}
      </Head>

      <svg
        className="absolute top-0 w-full z-10 -mt-32 pointer-events-none hidden md:block"
        width="1439"
        height="880"
        viewBox="0 0 1439 880"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="79.5" y1="-100" x2="79.4999" y2="2000" stroke="#494949" />
        <line x1="1359.5" y1="2.30872e-08" x2="1359.5" y2="1232" stroke="#494949" />
        <line x1="-1000" y1="163.5" x2="5000" y2="163.5" stroke="#494949" />
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

      {/* Background image + tint (unchanged DOM/classes) */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-12 pt-4">
        {bgSrc ? (
          <>
            <Image
              src={bgSrc}
              alt={bgAlt}
              height={350}
              width={350}
              sizes="(max-width: 1536px) 100vw, 1536px"
              priority
              fetchPriority="high"
              className="hidden md:block object-cover w-full md:rounded-2xl blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030531] via-[#030531]/60 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="h-full w-full bg-[#030531]" />
        )}
      </div>

      {/* Content (unchanged structure/classes) */}
      <div className="max-w-7xl mx-auto px-8 sm:px-10 md:pt-0 pb-0">
        <div className="relative mx-auto flex min-h-[60vh] md:-mt-[60vh] max-w-4xl flex-col items-center justify-center   text-center md:pt-0">
          <div className="relative px-4 w-full">
            <Image
              className=" w-full object-contain md:rounded-2xl block md:hidden pointer-events-none z-0 blur-[1px]"
              src={mobileSrc}
              alt={mobileAlt}
              height={512}
              width={512}
              sizes="100vw"
              priority
              fetchPriority="high"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#030531]/0 to-[#030531]/90 rounded-2xl md:rounded-2xl z-[1]" />
          </div>

          <div className="section-content relative z-[1] -mt-12">
            {(title || titleHighlighted) && (
              <h1 className="text-balance font-semibold text-[40px] md:text-5xl !leading-[130%]">
                {title}{' '}
                <p>
                  {titleHighlighted && <span className="text-[#21F2C0]">{titleHighlighted}</span>}
                </p>
              </h1>
            )}

            {content && (
              <p className="mx-auto mt-4 max-w-3xl text-pretty !leading-[130%] text-xl md:text-2xl">
                {content}
              </p>
            )}

            {cta?.label && cta?.link && (
              <div className="mt-8 px-2 mb-4">
                <CTAButton
                  className="w-full"
                  type="button"
                  href={data.cta.link}
                  label={data.cta.label}
                />
              </div>
            )}
          </div>
        </div>

        {/* Companies (max 3) */}
        {companies && companies.length > 0 && (
          <div className="mx-auto pb-8 mt-2 grid max-w-6xl grid-cols-1 gap-2 md:gap-6 sm:grid-cols-3">
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
                      // keep your visual classes exactly the same
                      className="w-full h-full shrink-0 object-contain"
                      // make them low priority so they don't compete with LCP
                      loading="lazy"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 320px"
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
