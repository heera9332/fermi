import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { HeroCtaShowcaseBlock } from './HeroCtaShowcase/Component'
import { TestimonialCardBlock } from './TestimonialCard/Component'
import BenefitsGridBlock from './BenefitsGrid/Component'
import ArchiveBlock from './ArchiveBlock/Component'

// component mapping
const blockComponents = {
  heroCtaShowcase: HeroCtaShowcaseBlock,
  testimonialCard: TestimonialCardBlock,
  benefitsGrid: BenefitsGridBlock,
  archive: ArchiveBlock,
  content: ContentBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div className="" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
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
