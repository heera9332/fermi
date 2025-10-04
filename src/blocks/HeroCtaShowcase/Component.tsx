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
    <section className="relative  text-white bg-[#030531]">
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

      <div className="border-[#494949] border-b hidden md:block">
        <div className="w-full max-w-7xl mx-auto h-64 md:pt-0 pt-16 hidden md:block relative z-[99999] -mt-56">
          <div className="border-x-[1px] border-[#494949] border-b h-full"></div>
        </div>
      </div>

      {/* only in mobile */}
      <div className="md:hidden border-b  h-36 absolute -top-28 w-full z-50">
        <div className="mx-4 border-x-[1px] border-[#494949] px-4 h-full"></div>
      </div>
      {/* Background image + tint (unchanged DOM/classes) */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-12 pt-6 hidden md:block border-x-[1px] border-[#494949]  py-16">
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
      <div className="max-w-7xl mx-4 md:mx-auto px-4 mt:-mt-32  md:px-10  pt-12 md:pt-0 pb-0 border-x-[1px] border-[#494949] relative">
        <div className="relative mx-auto flex min-h-[60vh] md:-mt-[60vh] max-w-4xl flex-col items-center justify-end text-center">
          <div className="relative w-full">
            <Image
              className="w-full object-contain rounded-xl block md:hidden pointer-events-none z-0 blur-[1px] mt-2"
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

          <div className="section-content relative z-[1] -mt-12 px-0">
            {(title || titleHighlighted) && (
              <h1 className="font-semibold text-[40px] md:text-5xl !leading-[130%]">
                {title} <br className="hidden md:inline-block" />
                {titleHighlighted && <span className="text-[#21F2C0]">{titleHighlighted}</span>}
              </h1>
            )}

            {content && (
              <p className="mx-auto mt-4 max-w-3xl text-pretty !leading-[130%] text-xl md:text-2xl">
                {content}
              </p>
            )}

            {cta?.label && cta?.link && (
              <div className="mt-8 mb-4">
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
          <div className="mx-auto mt-2 grid max-w-6xl grid-cols-1 gap-2 md:gap-6 sm:grid-cols-3">
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
