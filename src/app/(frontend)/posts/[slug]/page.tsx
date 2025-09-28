import './post.css'
import payload from '@/lib/payload-client'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'
import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'
import Image from 'next/image'
import { RelatedContentSection } from '@/blocks/RelatedArchiveBlock/Component'

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: params.slug } },
    depth: 2,
    limit: 1,
  })

  const post = docs?.[0]
  if (!post) return notFound()

  console.log(post)

  return (
    <div id="post-page" className={`post-page bg-[#030531] text-white`}>
      <Header isHeaderDark={true} />

      <article className="prose max-w-5xl mx-auto post-content">
        <div className="post-header px-8">
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
          <div className="featured-image">
            <Image
              src={post?.featuredImage?.url || '/assets/images/placeholder.png'}
              width={1000}
              height={1000}
              alt={'featured-image'}
              className="w-full rounded-2xl"
            />
          </div>
        </div>
        <div className="post-content prose-lg  mx-auto">
          <RichText data={post.content} className="max-w-full w-full mx-0 px-8" />
        </div>
      </article>
      <RelatedContentSection />
      <Footer />
    </div>
  )
}
