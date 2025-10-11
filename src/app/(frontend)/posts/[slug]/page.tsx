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
  // 1) Load global per-type settings (fallback)
  const global = await payload.findGlobal({
    slug: 'related-contents-settings',
    depth: 2,
  })

  // Helper: extract per-type config from global safely
  function pickGlobalForType(t: 'posts' | 'projects') {
    // Expect shape: global.posts / global.projects (groups)
    const cfg = (global && (global[t] || {})) as any
    return {
      isEnableRelatedBlock: true, // resolved effective
      heading: cfg?.heading ?? (t === 'projects' ? 'Explore More Projects' : 'Related Articles'),
      description:
        cfg?.description ??
        (t === 'projects'
          ? 'See similar case studies and success stories.'
          : 'Keep learning about how artificial intelligence can boost your business'),
      mode: cfg?.mode === 'manual' ? 'manual' : 'auto',
      limit: Math.max(1, Math.min(Number(cfg?.limit ?? 8), 24)),
      columns: Math.max(1, Math.min(Number(cfg?.columns ?? 3), 6)),
      excludeCurrent: cfg?.excludeCurrent !== false,
      sortBy: cfg?.sortBy === 'publishedAt' ? 'publishedAt' : '-publishedAt',
      items: Array.isArray(cfg?.items) ? cfg.items : [],
    }
  }

  // 2) Choose source: per-post (if enabled) else global
  const source = related?.isEnableRelatedBlock ? 'post' : 'global'
  const base =
    source === 'post'
      ? {
          isEnableRelatedBlock: true,
          heading:
            related?.heading ??
            (current.postType === 'projects' ? 'Related Projects' : 'Related Articles'),
          description: related?.description ?? null,
          mode: related?.mode === 'manual' ? 'manual' : 'auto',
          limit: Math.max(1, Math.min(Number(related?.limit ?? 8), 24)),
          columns:
            (related?.mode === 'manual'
              ? Number(related?.columnsManual ?? related?.columns ?? 4)
              : Number(related?.columns ?? 4)) || 4,
          excludeCurrent: related?.excludeCurrent !== false,
          sortBy: related?.sortBy === 'publishedAt' ? 'publishedAt' : '-publishedAt',
          items: Array.isArray(related?.items) ? related.items : [],
        }
      : pickGlobalForType(current.postType)

  // Normalize columns bounds
  const columns = Math.max(1, Math.min(base.columns || 4, 6))

  // 3) Manual mode
  if (base.mode === 'manual') {
    const manualIds = (base.items || []).map((it: any) => getId(it)).filter(Boolean) as string[]

    if (manualIds.length === 0) {
      return {
        heading: base.heading,
        description: base.description ?? null,
        mode: 'manual',
        layout: { columns },
        items: [],
      }
    }

    // Read only posts whose postType matches the current post’s postType
    const res = await payload.find({
      collection: 'posts',
      where: {
        and: [{ id: { in: manualIds } }, { postType: { equals: current.postType } }],
      },
      limit: Math.min(manualIds.length, 24),
      depth: 1,
    })

    // Preserve editor order
    const byId = new Map(res.docs.map((d: any) => [String(d.id), d]))
    const items = manualIds.map((id) => byId.get(id)).filter(Boolean)

    return {
      heading: base.heading,
      description: base.description ?? null,
      mode: 'manual',
      layout: { columns },
      items,
    }
  }

  // 4) Auto mode (same collection: 'posts', filter by field postType)
  const limit = base.limit
  const excludeCurrent = base.excludeCurrent
  const sortBy: '-publishedAt' | 'publishedAt' =
    base.sortBy === 'publishedAt' ? 'publishedAt' : '-publishedAt'

  const where: any = {
    postType: { equals: current.postType },
  }

  // Optional bias by categories overlap
  const cats = uniqStrings(current.categories ?? [])
  if (cats.length > 0) {
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

  return {
    heading: base.heading,
    description: base.description ?? null,
    mode: 'auto',
    layout: { columns },
    items: res.docs,
  }
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

      <article className="prose max-w-5xl mx-auto post-content pt-24 md:pt-36 px-6 md:px-0">
        <div className="post-header">
          <h1 className="font-semibold !lh-150 text-[32px] md:text-[40px]">{post.title}</h1>
          <div className="post-excerpt text-lg md:text-2xl lh-130">{post.excerpt}</div>
          <hr className="bg-white/50" />
          <div className="post-meta flex gap-16 mb-14">
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
            <div className="featured-image mb-14">
              <Image
                src={
                  post?.heroImage?.url ||
                  post?.featuredImage?.url ||
                  '/assets/images/placeholder.png'
                }
                width={1000}
                height={1000}
                alt={'featured-image'}
                className="w-full"
              />
            </div>
          )}
        </div>
        <div className="post-content prose-lg  mx-auto !text-xl md:!text-2xl">
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
