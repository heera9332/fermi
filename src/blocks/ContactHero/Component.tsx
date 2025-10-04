'use client'
import { ContactHeroBlock } from '@/payload-types'
import { ContactForm } from './ContactForm'

export const ContactHero = (data: ContactHeroBlock) => {
  // console.log(data)

  return (
    <section className="w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-0 text-white relative section overflow-hidden bg-[#EDEDED] pt-4 pb-20">
      <div
        style={{ backgroundImage: "url('/assets/images/contectFormBg.png')" }}
        className="bg-[#030531] contect-page flex flex-col justify-center items-center w-full max-w-[1240px] rounded-[24px] py-12 px-6 gap-12 bg-no-repeat bg-center bg-cover"
      >
        <div className="w-full max-w-6xl flex flex-col items-center gap-6">
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

        <ContactForm form={data.form} />
      </div>
    </section>
  )
}
