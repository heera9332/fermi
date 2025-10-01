// components/Related/PostCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import type { Post } from '@/payload-types'

export function PostCard({ post }: { post: Post }) {
  const href = `/posts/${post.slug}`
  const thumb = (post?.featuredImage as any)?.url

  return (
    <article className="border border-[#E0E0E0] p-4 shadow-sm text-black flex flex-col justify-between">
      <Link href={href} className="block">
        <div className="mb-4 aspect-[12/9] w-full overflow-hidden rounded-lg bg-black/5">
          {thumb ? (
            <Image
              src={thumb}
              alt={post.title || ''}
              width={640}
              height={360}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-black/40">No image</div>
          )}
        </div>
        <h3 className="text-lg font-medium md:text-2xl line-clamp-3">{post.title}</h3>
        {post.excerpt && <p className="mt-2 text-lg text-[#6B6B6B] line-clamp-3">{post.excerpt}</p>}
      </Link>
      <div className="mt-6 pt-6 flex items-center justify-between text-xs text-black/50 border-t border-gray-200">
        <p className="text-lg  lg-150">
          <span>
            Escrito por <br />{' '}
            <span className="text-black "> {post?.authorName ?? 'Fermi Team'}</span>
          </span>
        </p>
        <p className="text-lg  lg-150">
          <span className="text-[#6B6B6B]">Publicado em</span>
          <br />
          {post.publishedAt && (
            <span>{new Date(post.publishedAt).toLocaleDateString('pt-BR')}</span>
          )}
        </p>
      </div>
    </article>
  )
}
