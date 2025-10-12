import React, { Fragment } from 'react'

import type { Page, SinglePostGlobalSetting } from '@/payload-types'

import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { HeroCtaShowcaseBlock } from './HeroCtaShowcase/Component'
import { TestimonialCardBlock } from './TestimonialCard/Component'
import BenefitsGridBlock from './BenefitsGrid/Component'
import ArchiveBlock from './ArchiveBlock/Component'
import BriefHistoryBlock from './BriefHistory/Component'
import CalloutSectionBlock from './CalloutSection/Component'
import AboutSplitBlock from './AboutSplit/Component'
import NewsLetterBlock from './Newsletter/Component'
import { HowWeWorkBlock } from './HowWeWork/Component'
import { ContactHero } from './ContactHero/Component'
import { getCachedGlobal } from '@/utilities/getGlobals'

// component mapping
const blockComponents = {
  heroCtaShowcase: HeroCtaShowcaseBlock,
  testimonialCard: TestimonialCardBlock,
  benefitsGrid: BenefitsGridBlock,
  archive: ArchiveBlock,
  briefHistory: BriefHistoryBlock,
  calloutSection: CalloutSectionBlock,
  aboutSplit: AboutSplitBlock,
  newsLetter: NewsLetterBlock,
  howWeWork: HowWeWorkBlock,
  content: ContentBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  contactHero: ContactHero,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = async (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0
  const singlePostSettings: SinglePostGlobalSetting = await getCachedGlobal(
    'single-post-global-settings',
    1,
  )()

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          // console.log('Block > ', block)
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block && block.blockType === 'archive') {
              const archiveData = { ...block, ...singlePostSettings }
              console.log('yes****')
              console.log(archiveData)

              return (
                <div id={block?.blockType || ''} key={index}>
                  <Block {...archiveData} />
                </div>
              )
            }

            if (Block) {
              return (
                <div id={block?.blockType || ''} key={index}>
                  <Block {...block} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
