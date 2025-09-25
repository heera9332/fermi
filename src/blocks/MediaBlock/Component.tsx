import type { StaticImageData } from 'next/image'
import { cn } from '@/utilities/ui'
import React from 'react'
import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { Media } from '../../components/Media'

type Props = MediaBlockProps & {
  className?: string
  imgClassName?: string
  staticImage?: StaticImageData
}

export const MediaBlock: React.FC<Props> = ({ className, imgClassName, media, staticImage }) => {
  if (!media && !staticImage) return null

  return (
    <div className={cn(className)}>
      <Media
        resource={media}
        src={staticImage}
        imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
      />
    </div>
  )
}
