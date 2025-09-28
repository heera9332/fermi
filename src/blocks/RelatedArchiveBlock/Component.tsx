import { RelatedContent } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

export async function RelatedContentSection() {
  const data: RelatedContent = await getCachedGlobal('relatedContent')()

  console.log(data)

  return (
    <section className="my-10">
      {/* {block.heading && <h2 className="text-2xl font-semibold">{block.heading}</h2>} */}

      {/* {block.description && <p className="text-muted-foreground">{block.description}</p>} */}
      {/* <div className={`mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-${cols}`}></div> */}
    </section>
  )
}
