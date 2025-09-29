import * as React from 'react'
import Image from 'next/image'
import type { NewsLetter } from '@/payload-types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function NewsLetterBlock(data: NewsLetter) {
  return (
    <section className="relative w-full overflow-hidden bg-[#030531]">
      {/* dotted background layer */}
      <Image
        src="/assets/icons/svg/dots.svg"
        alt=""
        width={1000}
        height={1000}
        className="object-contain absolute top-0 w-full pointer-events-none"
        priority={false}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-24">
        {/* callout card */}

        <div className="mx-auto max-w-5xl   px-6 py-8  md:px-12 md:py-12">
          <p className="font-normal lh-150 text-white text-center mb-2">{data.subHeading}</p>

          <h2 className="text-center text-[24px] font-semibold text-white md:text-[40px] leading-[130%]">
            {data.heading}
            <br />
            <span className="text-[#21F2C0]">{data.headingHighlighted}</span>
          </h2>

          {/* description */}
          {data.description ? (
            <p className="mx-auto mt-4 max-w-3xl text-center text-white md:mt-5 text-[24px] !lh-150">
              {data.description}
            </p>
          ) : null}

          {/* CTA */}
          <div className="mt-7 flex justify-center md:mt-8 gap-4 bg-[#010329] p-8 rounded-3xl">
            <Input
              placeholder={data.form.placeHolder}
              className="rounded-3xl bg-[#1C1D32] py-3 px-4 h-16 border-none focus:outline-none outline-none text-[24px] text-white"
            />
            <Button
              className="inline-flex items-center justify-center bg-white px-6 py-3 text-[24px] text-[#0B0E2A] shadow-sm  hover:shadow-md   font-normal h-16 rounded-3xl hover:text-black hover:border transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
              focus:outline-none
              hover:bg-[linear-gradient(355.38deg,#FFFFFF_46.07%,#21F2C0_245.96%)]"
            >
              {data.form.buttonLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
