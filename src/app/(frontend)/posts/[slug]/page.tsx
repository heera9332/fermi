import payload from '@/lib/payload-client'
import { notFound } from 'next/navigation'
import RichText from '@/components/RichText'
import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'

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
    <div className={`bg-[#030531] text-white`}>
      <Header isHeaderDark={true} />

      <article className="prose max-w-7xl mx-auto">
        <h1 className="font-semibold lg-150 text-lg md:text-[40px]">{post.title}</h1>
        <div className="post-excerpt text-lg md:text-2xl lh-150">{post.excerpt}</div>
        <RichText data={post.content.children} />
      </article>
      <Footer />
    </div>
  )
}
