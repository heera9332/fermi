import type { Payload, Where } from 'payload'

type CurrentPostMeta = {
  id: string
  categories?: Array<{ id: string }> | string[] | null
  postType?: 'posts' | 'projects'
}

type RelatedBlockData = {
  mode: 'auto' | 'manual'
  auto?: {
    postTypeFilter?: 'any' | 'posts' | 'projects'
    matchByCurrentCategories?: boolean
    categories?: Array<{ id: string }> | string[]
    excludeCurrent?: boolean
    sortBy?: 'publishedAt' | 'updatedAt' | 'title'
    order?: 'asc' | 'desc'
    limit?: number
  }
  selection?: Array<string> // post IDs
  columns?: number
}

const DEFAULT_LIMIT = 8

export async function resolveRelatedContent(
  payload: Payload,
  block: RelatedBlockData,
  current: CurrentPostMeta,
) {
  if (!block) return { items: [], meta: { total: 0 } }

  if (block.mode === 'manual') {
    const ids = (block.selection ?? []).filter(Boolean)
    if (!ids.length) return { items: [], meta: { total: 0 } }

    const res = await payload.find({
      collection: 'posts',
      where: { id: { in: ids } },
      limit: ids.length,
      depth: 1,
    })
    // keep original order where possible
    const map = new Map(res.docs.map((d) => [String(d.id), d]))
    const ordered = ids.map((id) => map.get(String(id))).filter(Boolean)
    return { items: ordered, meta: { total: ordered.length } }
  }

  const {
    postTypeFilter = 'any',
    matchByCurrentCategories = true,
    categories = [],
    excludeCurrent = true,
    sortBy = 'publishedAt',
    order = 'desc',
    limit = DEFAULT_LIMIT,
  } = block.auto || {}

  const and: Where[] = []

  if (excludeCurrent && current.id) {
    and.push({ id: { not_equals: current.id } })
  }

  if (postTypeFilter !== 'any') {
    and.push({ postType: { equals: postTypeFilter } })
  }

  const selectedCats = (categories ?? [])
    .map((c: any) => (typeof c === 'string' ? c : c?.id))
    .filter(Boolean)

  const currentCats = (current.categories ?? [])
    .map((c: any) => (typeof c === 'string' ? c : c?.id))
    .filter(Boolean)

  const catSet = new Set<string>()
  if (matchByCurrentCategories) currentCats.forEach((id) => catSet.add(id))
  selectedCats.forEach((id) => catSet.add(id))

  if (catSet.size > 0) {
    and.push({ categories: { in: Array.from(catSet) } })
  }

  const where: Where = and.length ? { and } : {}

  const sort = `${sortBy}:${order}`

  const query = await payload.find({
    collection: 'posts',
    where,
    limit,
    sort,
    depth: 1,
  })

  return { items: query.docs, meta: { total: query.totalDocs ?? query.docs.length } }
}
