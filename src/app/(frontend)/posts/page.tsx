// app/(site)/posts/page.tsx
import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'
import { getRouteName } from '@/hooks/useRouteName'
import { queryPageBySlug } from '../[slug]/page'
import NotFound from '../not-found'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export default async function PostsArchivePage() {
  const { route } = getRouteName()
  const page = await queryPageBySlug({ slug: route })

  if (!page) <NotFound />

  const { layout } = page

  return (
    <>
      <Header isHeaderDark={page.isHeaderDark || false} />
      <RenderBlocks blocks={layout} />
      <Footer />
    </>
  )
}
