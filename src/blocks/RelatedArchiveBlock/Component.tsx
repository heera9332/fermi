// components/Related/RelatedContentSection.tsx
import { payloadGet } from '@/lib/payload-rest'
import type { RelatedContent, Post } from '@/payload-types'
import { PostCard } from './PostCard'
import { getCachedGlobal } from '@/utilities/getGlobals'

type CurrentPostLite = {
  id: string
  slug: string
  title?: string | null
  categories?: { id: string }[] | string[] | null
  publishedAt?: string | null
}

type PostsRes = { docs: Post[] }

function gridColsClass(n: number) {
  const c = Math.max(1, Math.min(6, n))
  // 1..6 -> responsive grid
  const map: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
  }
  return map[c]
}

function wordsFromTitle(t?: string | null) {
  if (!t) return []
  return t
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4)
    .slice(0, 6)
}

export async function RelatedContentSection({ current }: { current: CurrentPostLite }) {
  const data = (await getCachedGlobal('relatedContent')()) as RelatedContent | null
  if (!data || !data.isEnableRelatedBlock) return null

  const cols = data.columns ?? 4
  const desc = data.description ?? 'Continue aprendendo sobre IA para o seu negócio.'

  let posts: Post[] = []

  if (data.mode === 'manual') {
    const ids = (data.selection || [])
      .map((p: any) => (typeof p === 'string' ? p : p?.id))
      .filter(Boolean)
    if (ids.length) {
      const res = await payloadGet<PostsRes>('/api/posts', {
        where: { id: { in: ids } },
        depth: 1,
        limit: ids.length,
      })
      // preserve manual order
      const byId = new Map(res.docs.map((d) => [d.id, d]))
      posts = ids.map((id: string) => byId.get(id)).filter(Boolean) as Post[]
    }
  } else {
    const auto = data.auto || {}
    const wantTitle = !!auto.matchByCurrentTitle
    const wantCats = auto.matchByCurrentCategories !== false

    const selectedCats = (auto.categories || [])
      .map((c: any) => (typeof c === 'string' ? c : c?.id))
      .filter(Boolean)
    const currentCats =
      wantCats && current.categories
        ? (current.categories as any[])
            .map((c) => (typeof c === 'string' ? c : c?.id))
            .filter(Boolean)
        : []

    const allCats = Array.from(new Set([...selectedCats, ...currentCats]))
    const titleWords = wantTitle ? wordsFromTitle(current.title) : []

    // Build Payload "where"
    const where: any = {}

    const ors: any[] = []
    if (allCats.length) ors.push({ categories: { in: allCats } })
    if (titleWords.length) {
      // match any word in title (case-insensitive)
      ors.push({
        or: titleWords.map((w) => ({ title: { like: w } })),
      })
    }
    if (ors.length === 1) Object.assign(where, ors[0])
    if (ors.length > 1) where.or = ors

    if (auto.excludeCurrent !== false && current.id) {
      where.id = { not_equals: current.id }
    }

    const sortBy = auto.sortBy || 'publishedAt'
    const order = auto.order || 'desc'
    const limit = Math.max(1, Math.min(24, Number(auto.limit ?? 8)))

    const res = await payloadGet<PostsRes>('/api/posts', {
      where,
      limit,
      sort: `${order === 'asc' ? '' : '-'}${sortBy}`,
      depth: 1,
    })
    posts = res.docs
  }

  if (!posts.length) return null

  return (
    <section className="my-12 bg-[#EDEDED] text-black px-4 md:px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 w-full md:w-1/2">
          <h2 className="text-[32px] md:text-[40px] font-semibold lh-130 text-center md:text-left">
            {data.heading}
          </h2>
          {desc && <p className="mt-2 text-[#6B6B6B] text-center md:text-left">{desc}</p>}
        </div>

        <div className={`grid gap-6 ${gridColsClass(cols)}`}>
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
