'use client'
import { ContactHeroBlock } from '@/payload-types'
import { ContactForm } from './ContactForm'
import Image from 'next/image'

export const ContactHero = (data: ContactHeroBlock) => {
  // console.log(data)

  return (
    <section className="w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-0 text-white relative section overflow-hidden bg-[#EDEDED] pt-4 pb-20">
      <div className="bg-[#030531] contect-page flex flex-col justify-center items-center w-full max-w-[1240px] rounded-[24px] py-12 px-6 gap-12 bg-no-repeat bg-center bg-cover relative">
        <Image
          src="/assets/images/contectFormBg.png"
          alt="Contact background"
          fill
          priority // tells Next.js to preload it
          className="object-cover rounded-3xl"
          sizes="(max-width: 1240px) 100vw, 1240px"
        />
        <div className="w-full max-w-6xl flex flex-col items-center gap-6 relative z-10">
          <span className="font-normal text-xl sm:text-2xl leading-[150%] tracking-normal text-center block text-white">
            {data.subHeading}
          </span>
          <span className="w-full sm:w-[776px] text-2xl sm:text-[40px] font-semibold leading-[130%] tracking-normal text-center block text-white">
            {data.heading}
          </span>
          <p className="w-full sm:w-[776px] text-base sm:text-[24px] font-normal leading-[150%] tracking-normal text-center text-white">
            {data.description}
          </p>
        </div>

        <div className="relative z-10">
          <ContactForm form={data.form} />
        </div>
      </div>
    </section>
  )
}
