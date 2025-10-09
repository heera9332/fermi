import './post.css'
import payload from '@/lib/payload'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'
import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'
import Image from 'next/image'
import { RelatedContentSection } from '@/blocks/RelatedArchiveBlock/Component'

function getId(v: any): string | undefined {
  if (!v) return undefined
  if (typeof v === 'string') return v
  return String(v?.id ?? v?._id ?? '')
}

function uniqStrings(arr: (string | undefined)[] = []) {
  const set = new Set(arr.filter(Boolean))
  return Array.from(set) as string[]
}

async function resolveRelatedOnServer({
  payload,
  current,
  related,
}: {
  payload: any
  current: { id: string; postType: 'posts' | 'projects'; categories?: string[] }
  related: any
}): Promise<
  | {
      heading: string
      description: string | null
      mode: 'auto' | 'manual'
      layout: { columns: number }
      items: any[]
    }
  | undefined
> {
  if (!related?.isEnableRelatedBlock) return undefined

  const mode: 'auto' | 'manual' = related?.mode === 'manual' ? 'manual' : 'auto'
  const heading =
    related?.heading ?? (current.postType === 'projects' ? 'Related Projects' : 'Related Articles')
  const description = related?.description ?? null
  const columns = mode === 'manual' ? (related?.columnsManual ?? 4) : (related?.columns ?? 4)

  // MANUAL
  if (mode === 'manual' && Array.isArray(related?.items) && related.items.length > 0) {
    const manualIds = related.items.map((it: any) => getId(it)).filter(Boolean) as string[]
    if (manualIds.length === 0) {
      return { heading, description, mode, layout: { columns }, items: [] }
    }
    const res = await payload.find({
      collection: 'posts',
      where: { id: { in: manualIds } },
      limit: Math.min(manualIds.length, 24),
      depth: 1,
    })
    const byId = new Map(res.docs.map((d: any) => [String(d.id), d]))
    const items = manualIds.map((id) => byId.get(id)).filter(Boolean)
    return { heading, description, mode, layout: { columns }, items }
  }

  // AUTO
  const limit = Math.max(1, Math.min(related?.limit ?? 8, 24))
  // console.log({ limit })
  const excludeCurrent = related?.excludeCurrent !== false
  const sortBy: '-publishedAt' | 'publishedAt' =
    related?.sortBy === 'publishedAt' ? 'publishedAt' : '-publishedAt'

  const where: any = {
    postType: { equals: current.postType },
  }

  // Optional: nudge results by category overlap if available
  const cats = uniqStrings(current.categories ?? [])
  if (cats.length > 0) {
    // payload "in" with relationship arrays matches any
    where.categories = { in: cats }
  }

  if (excludeCurrent && current.id) {
    where.id = { not_equals: current.id }
  }

  const res = await payload.find({
    collection: 'posts',
    where,
    sort: sortBy,
    limit,
    depth: 1,
  })

  return { heading, description, mode, layout: { columns }, items: res.docs }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: params.slug } },
    depth: 2,
    limit: 1,
  })

  const post = docs?.[0]
  if (!post) return notFound()

  // Minimal "current" shape for downstream components
  const current = {
    id: getId(post)!,
    slug: String(post.slug || ''),
    title: String(post.title || ''),
    postType: (post.postType === 'projects' ? 'projects' : 'posts') as 'posts' | 'projects',
    categories: Array.isArray(post.categories)
      ? (post.categories as any[]).map((c) => getId(c)).filter(Boolean)
      : [],
    publishedAt: post.publishedAt as string | undefined,
  }

  // console.log({ current })
  // 2) Compute related content server-side (second request), no hooks
  const relatedResolved = await resolveRelatedOnServer({
    payload: payload,
    current,
    related: post.relatedContents,
  })

  // console.log(relatedResolved)

  return (
    <div id="post-page" className={`post-page bg-[#030531] text-white post-type-${post.postType}`}>
      <Header isHeaderDark={true} />

      <article className="prose max-w-5xl mx-auto post-content">
        <div className="post-header p-4 md:p-8">
          <h1 className="font-semibold !lh-150 text-[32px] md:text-[40px]">{post.title}</h1>
          <div className="post-excerpt text-lg md:text-2xl lh-130">{post.excerpt}</div>
          <hr className="bg-white/50" />
          <div className="post-meta flex gap-16 mb-12">
            <div className="author flex items-center gap-4 text-lg">
              Escrito por - {post.author?.name}
            </div>
            <div className="author flex items-center gap-4 text-lg">
              Publicado em -{' '}
              {post?.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '—'}
            </div>
          </div>
          {post?.heroImage && (
            <div className="featured-image">
              <Image
                src={
                  post?.heroImage?.url ||
                  post?.featuredImage?.url ||
                  '/assets/images/placeholder.png'
                }
                width={1000}
                height={1000}
                alt={'featured-image'}
                className="w-full rounded-2xl"
              />
            </div>
          )}
        </div>
        <div className="post-content prose-lg  mx-auto">
          <RichText data={post.content} className="max-w-full w-full mx-0 px-8" />
        </div>
      </article>
      {/* Related section – render only if available */}
      {relatedResolved && relatedResolved.items?.length > 0 ? (
        <RelatedContentSection
          data={{
            current,
            relatedResolved,
          }}
        />
      ) : null}
      <Footer />
    </div>
  )
}
