// components/blocks/Archive/Component.tsx
'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ArchiveBlock as ArchiveBlockProps, SinglePostGlobalSetting } from '@/payload-types'
import { usePathname } from 'next/navigation'

const cx = (...c: Array<string | false | undefined | null>) => c.filter(Boolean).join(' ')

/** Media resolver */
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
  return url?.startsWith('http') ? url : url
}

/** Get initial docs (preloaded/selected) */
function extractDocs(data: any): any[] {
  if (Array.isArray(data?.selectedDocs)) return data.selectedDocs
  if (Array.isArray((data as any)?.docs)) return (data as any).docs
  if (Array.isArray((data as any)?.results)) return (data as any).results
  if (Array.isArray((data as any)?.items)) return (data as any).items
  return []
}

/** Basic fields */
function getDocTitle(doc: any): string {
  const title = doc?.title || doc?.name || 'Untitled'
  const clean = String(title).trim()

  if (clean.length > 72) {
    return clean.slice(0, 69).trimEnd() + '…'
  }

  return clean
}

function getDocExcerpt(doc: any): string {
  const text = doc?.excerpt || doc?.summary || doc?.description || doc?.subtitle || ''

  const clean = String(text).trim()

  // Limit to 160 chars like WP excerpt
  if (clean.length > 120) {
    return clean.slice(0, 117).trimEnd() + '…'
  }

  return clean
}

/** Routing utils */
function normalizePath(path: string | undefined | null) {
  if (!path) return '/'
  const stripped = String(path)
    .replace(/^https?:\/\/[^/]+/i, '')
    .split('#')[0]
    .split('?')[0]
  let norm = stripped.replace(/\/+$/, '')
  if (norm === '' || norm === '/') return '/'
  if (norm[0] !== '/') norm = '/' + norm
  if (norm === '/home') return '/'
  return norm
}
function isSameRoute(a: string | undefined, b: string | undefined) {
  return normalizePath(a) === normalizePath(b)
}

/** Href builder (match your routes) */
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

/** Debounce hook */
function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function ArchiveBlock(data: ArchiveBlockProps & SinglePostGlobalSetting) {
  const pathname = usePathname()
  const searchSettings = data.search
  console.log(searchSettings)
  const docsInitial = extractDocs(data) || []
  const limit = typeof data.limit === 'number' ? data.limit : 10
  const cta = data.link

  const postType = data.postTypeFilter || 'posts'
  const archivePath = normalizePath('/' + postType) // '/posts' or '/projects'
  const currentPath = normalizePath(pathname)
  const isOnArchive = isSameRoute(currentPath, archivePath)

  /** Visibility rules */
  const showSearch = isOnArchive // search ONLY on its own archive
  const showCTA = !isOnArchive && !!(cta?.url && cta?.label) // CTA ONLY off-archive

  /** SEARCH STATE */
  const [q, setQ] = React.useState<string>('')
  const debouncedQ = useDebouncedValue(q, 350)
  const [results, setResults] = React.useState<any[]>(docsInitial.slice(0, limit))
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Query only the selected collection (no mixing)
  React.useEffect(() => {
    const run = async () => {
      if (!showSearch) {
        // not on archive: stick to initial docs
        setResults(docsInitial.slice(0, limit))
        setIsLoading(false)
        setError(null)
        return
      }

      if (!debouncedQ) {
        // on archive with empty query: optionally show initial docs or latest from API
        setResults(docsInitial.slice(0, limit))
        setIsLoading(false)
        setError(null)
        return
      }

      setIsLoading(true)
      setError(null)
      try {
        const url = new URL(`/api/posts`, window.location.origin)
        url.searchParams.set('limit', String(limit))
        url.searchParams.set('depth', '1')
        // OR search across common fields; adjust for your schema
        url.searchParams.set('where[or][0][title][like]', debouncedQ)
        url.searchParams.set('where[or][0][postType][equals]', postType)

        const res = await fetch(url.toString(), { method: 'GET', credentials: 'include' })
        if (!res.ok) throw new Error(`Search failed: ${res.status}`)
        const json = await res.json()
        console.log(json)
        const items = Array.isArray(json?.docs) ? json.docs : json?.results || json?.items || []
        setResults((items || []).slice(0, limit))
      } catch (e: any) {
        setError(e?.message || 'Search error')
      } finally {
        setIsLoading(false)
      }
    }
    run()
  }, [debouncedQ, showSearch, postType, limit, docsInitial])

  return (
    <section className="relative overflow-hidden w-full bg-[#030531]" id="archive-block">
      {/* dotted background layer */}
      {data.dots && (
        <>
          <Image
            src="/assets/icons/svg/dots.svg"
            alt=""
            width={1000}
            height={1000}
            className="hidden md:block object-contain absolute top-0 w-full"
            priority={false}
          />
          <Image
            src="/assets/icons/svg/dots-mobile.svg"
            alt=""
            width={1000}
            height={1000}
            className="block md:hidden object-contain absolute top-0 w-full"
            priority={false}
          />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-6 md:px-8 py-12">
        {/* Header */}
        <header
          className={cx(
            'flex gap-6 flex-col mx-auto pb-12',
            headerAlignClass((data as any).headerAlignment || 'left'),
          )}
        >
          <h2
            className={`block text-3xl md:text-5xl font-semibold text-white !lh-130 ${headerAlignClass((data as any).headerAlignment || 'left')}`}
          >
            {data.heading}
          </h2>
          {data.description ? (
            <p
              className={`max-w-3xl text-xl md:text-2xl !lh-150 text-white ${headerAlignClass((data as any).headerAlignment || 'left')}`}
            >
              {data.description}
            </p>
          ) : null}
        </header>

        {/* Top row: Search (left, 50%) shown ONLY on self-archive; CTA shown ONLY off-archive */}
        {showSearch && (
          <div className="md:mt-8 flex items-center justify-between gap-4">
            <form
              className="w-full md:w-1/2"
              onSubmit={(e) => e.preventDefault()}
              role="search"
              aria-label="Search"
            >
              <label htmlFor="archive-search" className="sr-only">
                {searchSettings.searchPlaceholderText || 'Buscar artigo, blog ou informação'}
              </label>
              <div className="relative">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute top-3.5 left-6"
                >
                  <path
                    d="M21.5299 20.4693L16.8358 15.7762C18.1963 14.1428 18.8748 12.0478 18.73 9.92691C18.5852 7.80604 17.6283 5.82265 16.0584 4.38932C14.4885 2.95599 12.4264 2.18308 10.3012 2.23138C8.1759 2.27968 6.15108 3.14547 4.64791 4.64864C3.14474 6.15181 2.27895 8.17663 2.23065 10.3019C2.18235 12.4271 2.95526 14.4892 4.38859 16.0591C5.82191 17.629 7.80531 18.5859 9.92618 18.7307C12.047 18.8755 14.1421 18.1971 15.7755 16.8365L20.4686 21.5306C20.5383 21.6003 20.621 21.6556 20.7121 21.6933C20.8031 21.731 20.9007 21.7504 20.9992 21.7504C21.0978 21.7504 21.1954 21.731 21.2864 21.6933C21.3775 21.6556 21.4602 21.6003 21.5299 21.5306C21.5995 21.4609 21.6548 21.3782 21.6925 21.2871C21.7302 21.1961 21.7497 21.0985 21.7497 21C21.7497 20.9014 21.7302 20.8038 21.6925 20.7128C21.6548 20.6218 21.5995 20.539 21.5299 20.4693ZM3.74924 10.5C3.74924 9.16495 4.14512 7.8599 4.88682 6.74987C5.62852 5.63984 6.68272 4.77467 7.91612 4.26378C9.14953 3.75289 10.5067 3.61922 11.8161 3.87967C13.1255 4.14012 14.3282 4.78299 15.2722 5.727C16.2162 6.671 16.8591 7.87374 17.1195 9.18311C17.38 10.4925 17.2463 11.8497 16.7354 13.0831C16.2245 14.3165 15.3594 15.3707 14.2493 16.1124C13.1393 16.8541 11.8343 17.25 10.4992 17.25C8.70964 17.248 6.9939 16.5362 5.72846 15.2708C4.46302 14.0053 3.75122 12.2896 3.74924 10.5Z"
                    fill="white"
                  />
                </svg>

                <input
                  id="archive-search"
                  name="q"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={
                    searchSettings?.searchPlaceholderText ?? 'Buscar artigo, blog ou informação'
                  }
                  className="pl-16 w-full rounded-xl border  bg-[#1C1D32] border-none  text-white placeholder-white
                             px-4 py-3 outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 lh-150 text-lg"
                  autoComplete="off"
                />
                {isLoading && (
                  <span
                    aria-hidden
                    className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin"
                    title="Searching..."
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2a10 10 0 1 0 10 10"
                        stroke="white"
                        strokeOpacity="0.6"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                )}
              </div>
              {error ? (
                <p className="mt-2 text-sm text-red-300/90">Erro na pesquisa: {error}</p>
              ) : null}
            </form>
          </div>
        )}

        {/* Grid */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(results || []).map((doc: any, idx: number) => {
            const mediaUrl = getMediaUrl(doc) || 'https://placehold.co/720x450'
            return (
              <article
                key={doc?.id || doc?.slug || idx}
                className={cx(
                  'group relative overflow-hidden rounded-2xl bg-[#1c1d388b] hover:bg-[#1C1D38] p-2 transition-colors',
                )}
              >
                <div
                  className={`relative w-full ${postType === 'posts' ? 'aspect-[6/4]' : 'aspect-square'} overflow-hidden`}
                >
                  <Image
                    src={mediaUrl}
                    alt={getDocTitle(doc)}
                    width={1000}
                    height={1000}
                    priority={idx === 0} // preload only the first/hero image
                    sizes="(max-width: 768px) 100vw,
                      (max-width: 1200px) 50vw,
                      1000px"
                    className="h-full w-full object-cover rounded-2xl"
                  />
                </div>

                <div className={`py-4 px-2 ${postType === 'posts' ? 'h-72' : ''}`}>
                  <h3 className="text-white text-[24px] font-medium lh-150">
                    <Link
                      href={getHref(doc, (data as any).relationTo || postType)}
                      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                      title={getDocTitle(doc)}
                    >
                      {getDocTitle(doc)}
                    </Link>
                  </h3>
                  {getDocExcerpt(doc) ? (
                    <p
                      title={getDocExcerpt(doc)}
                      className="mt-2 text-[20px] text-white/80 lh-150 font-regular"
                    >
                      {getDocExcerpt(doc)}
                    </p>
                  ) : null}
                </div>

                {postType === 'posts' && (
                  <div className="post-meta">
                    <div className="border border-[#797979] h-0 mx-4" />
                    <div className="grid grid-cols-2">
                      <div className="text-[18px] text-white p-4">
                        <p>{data?.publishedByLabel ?? 'Escrito por'}</p>
                        <p>{doc?.author?.name ?? '—'}</p>
                      </div>
                      <div className="text-[18px] text-white p-4">
                        <p>{data?.publishedByLabel ?? 'Publicado em'}</p>
                        <p>
                          {doc?.publishedAt ? new Date(doc.publishedAt).toLocaleDateString() : '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <Link
                  href={getHref(doc, (data as any).relationTo || postType)}
                  className="absolute inset-0"
                  aria-label={getDocTitle(doc)}
                />
              </article>
            )
          })}
        </div>

        {/* CTA (only off-archive) */}
        {showCTA ? (
          <div className="flex justify-center md:justify-end mt-6">
            <Link
              href={cta!.url}
              target={cta!.newTab ? '_blank' : undefined}
              rel={cta!.newTab ? 'noopener noreferrer' : undefined}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition"
            >
              <span className="text-lg md:text-xl lh-150">{cta!.label}</span>
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
