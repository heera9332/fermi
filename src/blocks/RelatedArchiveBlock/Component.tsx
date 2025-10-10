import { PostCard } from '@/blocks/RelatedArchiveBlock/PostCard'

function gridColsClass(n?: number) {
  const c = Math.max(1, Math.min(6, Number(n ?? 4)))
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

export async function RelatedContentSection({ data }) {
  if (!data?.relatedResolved?.items?.length) return null

  const heading = data.relatedResolved.heading || ''
  const description = data.relatedResolved.description || ''
  const columns = data.relatedResolved.layout.columns || 3
  const items = data.relatedResolved.items || []

  return (
    <section className="my-12 bg-[#EDEDED] text-black px-4 md:px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 w-full md:w-1/2">
          <h2 className="text-[32px] md:text-[40px] font-semibold lh-130 text-center md:text-left">
            {heading ||
              (data.current.postType === 'projects' ? 'Related Projects' : 'Related Articles')}
          </h2>
          {description && (
            <p className="mt-2 text-[#6B6B6B] text-center md:text-left">{description}</p>
          )}
        </div>

        <div className={`grid gap-6 ${gridColsClass(columns)}`}>
          {items.map((p: any) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
