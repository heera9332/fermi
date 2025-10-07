// src/collections/posts/hooks/resolveRelatedContents.ts
import type { CollectionAfterReadHook, Where } from 'payload'

export const resolveRelatedContents: CollectionAfterReadHook = async ({ doc, req }) => {
  try {
    const payload = req.payload
    console.log(doc)
    if (!payload) return doc

    const related = (doc as any)?.relatedContents
    if (!related?.isEnableRelatedBlock) return doc

    const postType: 'posts' | 'projects' = doc?.postType === 'projects' ? 'projects' : 'posts'
    const mode: 'auto' | 'manual' = related?.mode === 'manual' ? 'manual' : 'auto'

    const heading =
      related?.heading ?? (postType === 'projects' ? 'Related Projects' : 'Related Articles')
    const description = related?.description ?? ''
    const columns = related?.columns ?? 3

    doc.relatedResolved = {
      heading,
      description,
      mode,
      layout: { columns },
      items: [],
    }

    // // Manual mode: preserve editor order
    const manualIds: string[] | undefined = Array.isArray(related?.items)
      ? (related.items as any[])
          .map((it) => (typeof it === 'object' ? (it?.id ?? it?._id) : it))
          .filter(Boolean)
          .map(String)
      : undefined

    if (mode === 'manual' && manualIds && manualIds.length > 0) {
      const res = await payload.find({
        collection: 'posts',
        where: { id: { in: manualIds } },
        limit: Math.min(manualIds.length, 24),
        depth: 1,
      })
      const byId = new Map(res.docs.map((d: any) => [String(d.id), d]))
      ;(doc as any).relatedResolved.items = manualIds.map((id) => byId.get(id)).filter(Boolean)
      return doc
    }

    // // Auto mode
    // const limit = Math.max(1, Math.min(related?.limit ?? 8, 24))
    // const excludeCurrent = related?.excludeCurrent !== false
    // const sortBy: '-publishedAt' | 'publishedAt' =
    //   related?.sortBy === 'publishedAt' ? 'publishedAt' : '-publishedAt'

    // const where: Where = { postType: { equals: postType } }
    // if (excludeCurrent && doc?.id) {
    //   ;(where as any).id = { not_equals: doc.id }
    // }

    // const res = await payload.find({
    //   collection: 'posts',
    //   where,
    //   sort: sortBy,
    //   limit,
    //   depth: 1,
    // });

    // (doc as any).relatedResolved.items = res.docs
    return doc
  } catch {
    return doc // fail-soft
  }
}
