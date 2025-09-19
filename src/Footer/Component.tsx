// src/components/site-footer.tsx
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Footer as FooterType } from '@/payload-types'

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
    <footer aria-labelledby="footer-heading" className="relative mt-auto text-white py-20">
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
        <section className="mx-auto max-w-5xl px-6 pb-16 text-center md:pb-20">
          {footerData.cta.title && (
            <h2 className="mx-auto px-4 md:px-40 text-[30px] font-semibold md:text-[40px] !leading-[150%]">
              {footerData.cta.title}
            </h2>
          )}
          {footerData.cta.subtitle && (
            <p className="mx-auto mt-4 max-w-2xl text-pretty  leading-[150%] text-white font-normal">
              {footerData.cta.subtitle}
            </p>
          )}
          {footerData.cta.button?.label && footerData.cta.button?.link && (
            <div className="mt-8">
              <Link
                href={footerData.cta.button.link}
                target={footerData.cta.button.newTab ? '_blank' : undefined}
                rel={footerData.cta.button.newTab ? 'noopener noreferrer' : undefined}
                className=" group inline-flex items-center justify-center gap-4
                  rounded-full bg-white px-6 py-3 text-[24px] text-[#0B0E2A]
                  shadow-sm hover:shadow-md active:scale-[0.98]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60
                  transition-shadow delay-200"
              >
                {footerData.cta.button.label}

                <svg
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="rotate-[305deg] hidden group-hover:block    
                  opacity-0 translate-x-1 scale-95
                  group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100

                  transform-gpu will-change-[transform,opacity]
                  transition-[opacity,transform]
                  duration-500 delay-200
                  ease-[cubic-bezier(0.22,1,0.36,1)]  /* 'back' style ease-out */"
                >
                  <path
                    d="M20.7806 13.4178L14.0306 20.1678C13.8899 20.3085 13.699 20.3876 13.5 20.3876C13.301 20.3876 13.1101 20.3085 12.9694 20.1678C12.8286 20.027 12.7496 19.8362 12.7496 19.6371C12.7496 19.4381 12.8286 19.2472 12.9694 19.1065L18.4397 13.6371H3.75C3.55109 13.6371 3.36032 13.5581 3.21967 13.4175C3.07902 13.2768 3 13.086 3 12.8871C3 12.6882 3.07902 12.4975 3.21967 12.3568C3.36032 12.2162 3.55109 12.1371 3.75 12.1371H18.4397L12.9694 6.66776C12.8286 6.52703 12.7496 6.33616 12.7496 6.13714C12.7496 5.93811 12.8286 5.74724 12.9694 5.60651C13.1101 5.46578 13.301 5.38672 13.5 5.38672C13.699 5.38672 13.8899 5.46578 14.0306 5.60651L20.7806 12.3565C20.8504 12.4262 20.9057 12.5089 20.9434 12.5999C20.9812 12.691 21.0006 12.7886 21.0006 12.8871C21.0006 12.9857 20.9812 13.0833 20.9434 13.1743C20.9057 13.2654 20.8504 13.3481 20.7806 13.4178Z"
                    fill="black"
                  />
                </svg>
              </Link>
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
                      <li key={`${i}-${j}`} className="">
                        <Link
                          href={l.link || '#'}
                          {...extTarget(l?.newTab)}
                          className="transition hover:opacity-70 relative 
             after:absolute after:bottom-0 after:left-0 
             after:h-[2px] after:w-full after:origin-left 
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
             after:h-[2px] after:w-full after:origin-left 
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
             after:h-[2px] after:w-full after:origin-left 
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
