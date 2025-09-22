// components/blocks/Archive/Component.tsx
'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ArchiveBlock as ArchiveBlockProps } from '@/payload-types'
import { usePathname } from 'next/navigation'

/**
 * Utility: join class names
 */
const cx = (...c: Array<string | false | undefined | null>) => c.filter(Boolean).join(' ')

/**
 * Try multiple common shapes to derive a media URL from a Payload doc
 */
function getMediaUrl(doc: any): string | null {
  const media = doc?.featuredImage || doc?.image || doc?.cover || doc?.thumbnail || doc?.media
  if (!media) return null

  const url =
    typeof media === 'string'
      ? media
      : media?.sizes?.card?.url ||
        media?.sizes?.large?.url ||
        media?.sizes?.feature?.url ||
        media?.url ||
        null

  if (!url) return null
  // If it's already absolute, use it; else prefix with site origin if you need.
  return url.startsWith('http') ? url : url
}

/**
 * Pulls array of docs (supports both "selection" and any pre-populated field names)
 */
function extractDocs(data: any): any[] {
  // When "populateBy = selection"
  if (Array.isArray(data?.selectedDocs)) return data.selectedDocs

  // When "populateBy = collection" you might have already-populated docs via loader
  // Adjust these keys based on your loader shape
  if (Array.isArray((data as any)?.docs)) return (data as any).docs
  if (Array.isArray((data as any)?.results)) return (data as any).results
  if (Array.isArray((data as any)?.items)) return (data as any).items

  return []
}

/**
 * Derive useful text fields
 */
function getDocTitle(doc: any): string {
  return doc?.title || doc?.name || 'Untitled'
}
function getDocExcerpt(doc: any): string {
  return doc?.excerpt || doc?.summary || doc?.description || doc?.subtitle || ''
}

function normalizePath(path: string | undefined | null) {
  if (!path) return '/'
  // strip domain, query and hash
  const stripped = String(path)
    .replace(/^https?:\/\/[^/]+/i, '')
    .split('#')[0]
    .split('?')[0]

  let norm = stripped.replace(/\/+$/, '') // drop trailing slashes
  if (norm === '' || norm === '/') return '/'

  // ensure single leading slash
  if (norm[0] !== '/') norm = '/' + norm

  // treat /home as root (optional; remove if you want /home distinct)
  if (norm === '/home') return '/'

  return norm
}

function isSameRoute(a: string | undefined, b: string | undefined) {
  return normalizePath(a) === normalizePath(b)
}

/**
 * Build a reasonable href. If your app has a different routing,
 * swap this to your own resolver (e.g. by reading doc._collection or block.relationTo).
 */
function getHref(doc: any, relationTo: string | undefined): string {
  const slug = doc?.slug || doc?.id || ''
  const base = relationTo || 'posts'
  return `/${base}/${slug}`
}

const headerAlignClass = (align?: string) =>
  align === 'center'
    ? 'items-center text-center'
    : align === 'right'
      ? 'items-end text-right'
      : 'items-start text-left'

export default function ArchiveBlock(data: ArchiveBlockProps) {
  console.log('archive data > ', data)
  const pathname = usePathname()
  console.log('path name > ', pathname)
  const docs = extractDocs(data) || []
  const limit = typeof data.limit === 'number' ? data.limit : 10
  const visible = docs.slice(0, limit)
  const cta = data.link

  const currentPath = normalizePath(pathname)
  const filterPath = normalizePath('/' + (data.postTypeFilter ?? '')) // "/posts" from "posts"

  // true if we are on the same archive page as the block's post type
  const isSelfArchive = isSameRoute(currentPath, filterPath)

  // show CTA except when on its own archive; but DO show on home
  const showCTA = !isSelfArchive || isSameRoute(currentPath, '/')

  return (
    <section className="relative overflow-hidden w-full bg-[#030531]">
      {/* dotted background layer */}
      <Image
        src="/assets/icons/svg/dots.svg"
        alt=""
        width={1000}
        height={1000}
        className="object-contain absolute top-0 w-full"
        priority={false}
      />
      <div className="relative mx-auto max-w-7xl px-6 md:px-8 py-14 md:py-20">
        {/* Header */}
        <header
          className={cx(
            'flex flex-col gap-4',
            headerAlignClass((data as any).headerAlignment || 'left'),
          )}
        >
          <h2 className="text-3xl md:text-5xl font-semibold text-white lh-130">{data.heading}</h2>
          {data.description ? (
            <p className="max-w-3xl text-base md:text-lg  text-white/80">{data.description}</p>
          ) : null}
        </header>

        {/* Cards */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {visible.map((doc: any, idx: number) => {
            const mediaUrl =
              getMediaUrl(doc) ||
              // fallback: 720x450 looks close to the mock 16:10-16:9-ish box
              'https://placehold.co/720x450'

            return (
              <article
                key={doc?.id || doc?.slug || idx}
                className={cx(
                  'group relative overflow-hidden rounded-2xl bg-[#1c1d388b] hover:bg-[#1C1D38] p-2 transition-colors',
                )}
              >
                {/* Media with fixed aspect ratio */}
                <div className="relative w-full aspect-[16/10] overflow-hidden">
                  {/* Use <img> to allow external placeholder without next.config */}
                  <Image
                    width={1000}
                    height={1000}
                    src={mediaUrl}
                    alt={getDocTitle(doc)}
                    className="h-full w-full object-cover rounded-2xl"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Text block */}
                <div className={`p-4 ${data.postTypeFilter === 'posts' ? 'h-72' : ''}`}>
                  <h3 className="text-white text-[24px] font-medium lh-150">
                    <Link
                      href={getHref(doc, (data as any).relationTo)}
                      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    >
                      {getDocTitle(doc)}
                    </Link>
                  </h3>
                  {getDocExcerpt(doc) ? (
                    <p className="mt-2 text-[20px] text-white/80 lh-150 font-regular">
                      {getDocExcerpt(doc)}
                    </p>
                  ) : null}
                </div>

                {data.postTypeFilter === 'posts' && (
                  <div className="post-meta">
                    <div className="border border-[#797979] h-0 mx-4" />
                    <div className="grid grid-cols-2">
                      <div className="text-[18px] text-white p-4">
                        <p>Escrito por</p>
                        <p>{doc.author.name}</p>
                      </div>
                      <div className="text-[18px] text-white p-4">
                        <p>Publicado em</p>
                        <p>{new Date(doc.publishedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Full-card clickable area for better UX */}
                <Link
                  href={getHref(doc, (data as any).relationTo)}
                  className="absolute inset-0"
                  aria-label={getDocTitle(doc)}
                />
              </article>
            )
          })}
        </div>

        {/* CTA bottom-right => not show if archive of self post like posts block has on /posts page */}
        {showCTA && data.link?.url && data.link?.label ? (
          <div className="mt-10 md:mt-12 flex justify-end">
            <Link
              href={data.link.url}
              target={data.link.newTab ? '_blank' : undefined}
              rel={data.link.newTab ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition"
            >
              <span className="text-base md:text-lg lh-150">{data.link.label}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.3172 10.4423L11.6922 16.0673C11.5749 16.1846 11.4159 16.2505 11.25 16.2505C11.0841 16.2505 10.9251 16.1846 10.8078 16.0673C10.6905 15.95 10.6247 15.791 10.6247 15.6251C10.6247 15.4593 10.6905 15.3002 10.8078 15.1829L15.3664 10.6251H3.125C2.95924 10.6251 2.80027 10.5593 2.68306 10.442C2.56585 10.3248 2.5 10.1659 2.5 10.0001C2.5 9.83434 2.56585 9.67537 2.68306 9.55816C2.80027 9.44095 2.95924 9.3751 3.125 9.3751H15.3664L10.8078 4.81729C10.6905 4.70002 10.6247 4.54096 10.6247 4.3751C10.6247 4.20925 10.6905 4.05019 10.8078 3.93292C10.9251 3.81564 11.0841 3.74976 11.25 3.74976C11.4159 3.74976 11.5749 3.81564 11.6922 3.93292L17.3172 9.55792C17.3753 9.61596 17.4214 9.68489 17.4529 9.76077C17.4843 9.83664 17.5005 9.91797 17.5005 10.0001C17.5005 10.0822 17.4843 10.1636 17.4529 10.2394C17.4214 10.3153 17.3753 10.3842 17.3172 10.4423Z"
                  fill="white"
                />
              </svg>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  )
}
