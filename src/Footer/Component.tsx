// src/components/site-footer.tsx
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Footer as FooterType } from '@/payload-types'
import CTAButton from '@/components/CTAButton'

const ICONS: Record<string, string> = {
  x: '/assets/icons/svg/x.svg',
  instagram: '/assets/icons/svg/insta.svg',
  youtube: '/assets/icons/svg/yt.svg',
  linkedin: '/assets/icons/svg/linkedin.svg',
}

function extTarget(newTab?: boolean) {
  return newTab ? { target: '_blank', rel: 'noreferrer noopener' } : {}
}

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 3)()) as FooterType

  // Background image (works with Payload local or cloud-storage adapters):
  const bgUrl =
    typeof footerData?.footerBackground === 'object' &&
    footerData.footerBackground &&
    'url' in footerData.footerBackground
      ? (footerData.footerBackground as any).url
      : undefined

  return (
    <footer
      id="footer"
      aria-labelledby="footer-heading"
      className="relative mt-auto text-white py-20"
    >
      {/* Background layer */}
      <div className="absolute inset-0 -z-10">
        {bgUrl ? (
          <>
            <Image
              src={bgUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-top"
            />
            {/* Subtle tint to match Figma dark backdrop */}
            <div className="absolute inset-0 bg-[#030531]/60" />
          </>
        ) : (
          <div className="h-full w-full bg-[#030531]" />
        )}
      </div>

      {/* CTA */}
      {footerData?.cta?.enabled && (
        <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-16 text-center md:pb-20">
          {footerData.cta.title && (
            <h2 className="cta mx-auto px-4 sm:px-6 md:px-40 text-[32px] font-semibold md:text-[40px] leading-150">
              {footerData.cta.title}
            </h2>
          )}
          {footerData.cta.subtitle && (
            <p className="mx-auto mt-4 max-w-2xl  text-lg leading-150 text-white font-normal">
              {footerData.cta.subtitle}
            </p>
          )}
          {footerData.cta.button?.label && footerData.cta.button?.link && (
            <div className="mt-8">
              <CTAButton
                className="w-full md:w-fit"
                type="button"
                href={footerData.cta.button.link}
                label={footerData.cta.button.label}
                newTab={footerData.cta.button.newTab || false}
              />
            </div>
          )}
        </section>
      )}

      {/* White rounded card (links + brand) */}
      <div className="mx-auto max-w-8xl px-4 md:px-36 pb-14">
        <div className="mx-auto rounded-3xl bg-white p-6 text-neutral-900 shadow-xl ring-1 ring-black/5 md:p-8 lg:p-10">
          <div className="grid gap-10 md:grid-cols-3">
            {/* Brand + Socials */}
            <div className="md:col-span-1">
              {footerData.brand && <div className="text-5xl font-bold">{footerData.brand}</div>}

              {Array.isArray(footerData.social) && footerData.social.length > 0 && (
                <div className="mt-4 flex items-center gap-4">
                  {footerData.social.map((s) => {
                    const key = `${s.platform}-${s.url}`
                    const icon = ICONS[s.platform] // fallbacks to undefined => hidden
                    if (!icon) return null
                    return (
                      <Link
                        key={key}
                        href={s.url || '#'}
                        {...extTarget(true)}
                        aria-label={s.platform}
                      >
                        {/* Keep icons as img since they’re in /public */}
                        <Image
                          width={56}
                          height={56}
                          src={icon}
                          alt={s.platform ?? 'social'}
                          className="h-6 w-6"
                        />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Link Columns */}
            <div className="md:col-span-2 grid gap-10 sm:grid-cols-2">
              {(footerData.columns ?? []).map((col, i) => (
                <nav key={i} aria-label={col?.title ?? `footer-column-${i}`}>
                  {col?.title && <div className="text-[16px] font-medium">{col.title}</div>}
                  <ul className="mt-4 space-y-2 text-[16px] flex flex-col">
                    {(col?.links ?? []).map((l, j) => (
                      <li key={`${i}-${j}`}>
                        <Link
                          href={l.link || '#'}
                          {...extTarget(l?.newTab)}
                          className="transition hover:opacity-70 relative 
                          after:absolute after:bottom-0 after:left-0 
                            after:w-full after:origin-left 
                          after:scale-x-0 after:bg-current after:transition-transform 
                          after:duration-300 hover:after:scale-x-100 inline-block"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}

              {/* Optional extra column for contact if you want it separated */}
              {footerData.contact?.email || footerData.contact?.phone ? (
                <div className="sm:col-span-1">
                  <div className="text-[16px] font-medium">Contacto</div>
                  <ul className="mt-4 space-y-2 text-[16px]">
                    {footerData.contact?.email && (
                      <li>
                        <Link
                          href={`mailto:${footerData.contact.email}`}
                          className="transition hover:opacity-70 relative 
                          after:absolute after:bottom-0 after:left-0 
                            after:w-full after:origin-left 
                          after:scale-x-0 after:bg-current after:transition-transform 
                          after:duration-300 hover:after:scale-x-100 inline-block"
                        >
                          {footerData.contact.email}
                        </Link>
                      </li>
                    )}
                    {footerData.contact?.phone && (
                      <li>
                        <Link
                          href={`tel:${footerData.contact.phone.replace(/\s+/g, '')}`}
                          className="transition hover:opacity-70 relative 
                          after:absolute after:bottom-0 after:left-0 
                          first: after:w-full after:origin-left 
                          after:scale-x-0 after:bg-current after:transition-transform 
                          after:duration-300 hover:after:scale-x-100 inline-block"
                        >
                          {footerData.contact.phone}
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
