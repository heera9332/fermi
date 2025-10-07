// src/collections/posts/hooks/populateAuthors.ts
import type { CollectionAfterReadHook } from 'payload'

export const populateAuthors: CollectionAfterReadHook = async ({ doc, req }) => {
  try {
    const payload = req?.payload
    if (!payload) return doc

    const rawAuthor = (doc as any)?.author
    if (!rawAuthor) return doc

    const authorId =
      typeof rawAuthor === 'object'
        ? ((rawAuthor as any)?.id ?? (rawAuthor as any)?._id ?? rawAuthor)
        : rawAuthor

    if (!authorId) return doc

    const user = await payload.findByID({
      collection: 'users',
      id: String(authorId),
      depth: 0, // avoid recursive/populated structures
    })

    if (!user)
      return doc

      // write only the small, safe shape you need on the API
    ;(doc as any).populatedAuthor = [
      {
        id: String(user.id),
        name: (user as any)?.name ?? (user as any)?.email ?? '',
      },
    ]

    return doc
  } catch {
    // fail-soft to never break the frontend
    return doc
  }
}
