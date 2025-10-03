'use client'
import * as React from 'react'
import Image from 'next/image'
import type { FormBlock, NewsLetter } from '@/payload-types'
import { Input } from '@/components/ui/input'

export default function NewsLetterBlock(data: NewsLetter) {
  // console.log(data)
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const form = data.form
  const field: FormBlock = form?.fields?.[0] // only one email field
  const buttonLabel = form?.submitButtonLabel || 'Subscribe'

  const confirmationText = form?.confirmationMessage?.root
    ? extractText(form.confirmationMessage)
    : 'Subscribed'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email.trim()) {
      setError('Email is required')
      return
    }
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!ok) {
      setError('Invalid email')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: form.id,
          submissionData: [{ field: field.name, value: email }],
        }),
      })

      if (!res.ok) throw new Error(await res.text())

      setEmail('')
      setSuccess(confirmationText)
    } catch (err: any) {
      setError(err?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative w-full overflow-hidden bg-[#030531]">
      {/* dotted background layer */}
      <Image
        src="/assets/icons/svg/dots-mobile.svg"
        alt=""
        width={1000}
        height={1000}
        className="object-contain absolute top-0 w-full pointer-events-none block md:hidden"
      />
      <Image
        src="/assets/icons/svg/dots.svg"
        alt=""
        width={1000}
        height={1000}
        className="object-contain absolute top-0 w-full pointer-events-none hidden md:block"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8 py-8 md:py-24">
        <div className="mx-auto max-w-5xl py-8 md:px-12 md:py-12">
          <p className="font-normal lh-150 text-white text-center mb-2">{data.subHeading}</p>

          <h2 className="text-center text-[32px] font-semibold text-white md:text-[40px] leading-[130%]">
            {data.heading}
            <br className="hidden md:inline-block" />{' '}
            <span className="text-[#21F2C0]">{data.headingHighlighted}</span>
          </h2>

          {data.description ? (
            <p className="mx-auto mt-4 max-w-3xl text-center text-white md:mt-5 text-xl md:text-2xl leading-150">
              {data.description}
            </p>
          ) : null}

          {/* CTA form */}
          <form
            onSubmit={handleSubmit}
            className="mt-7 flex flex-col md:flex-row justify-center md:mt-8 gap-4 bg-[#010329] p-4 md:p-8 rounded-3xl"
          >
            <Input
              type="email"
              name={field?.name}
              placeholder={field?.placeholder || 'you@example.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={field?.required}
              className="rounded-3xl bg-[#1C1D32] py-3 px-4 h-16 border-none focus:outline-none outline-none text-[24px] text-white"
            />
            <div className="rounded-full bg-transparent hover:bg-[linear-gradient(189.22deg,rgba(58,255,208,0)_1.35%,#3AFFD0_93.77%)] p-[1px]">
              <button
                type="submit"
                disabled={loading}
                className="h-18 group relative inline-flex items-center justify-center rounded-full overflow-hidden px-8 py-4 text-lg md:text-2xl bg-white !text-[#0B0E2A] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none w-full md:w-fit hover:bg-[linear-gradient(355.38deg,#FFFFFF_46.07%,#21F2C0_245.96%)]"
              >
                {buttonLabel}
              </button>
            </div>
          </form>

          {/* messages */}
          {success && <p className="mt-4 text-center text-green-400">{success}</p>}
          {error && <p className="mt-4 text-center text-red-400">{error}</p>}
        </div>
      </div>
    </section>
  )
}

/** tiny lexical JSON to plain text extractor */
function extractText(node: any): string {
  if (!node) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(extractText).join(' ')
  if (node.root) return extractText(node.root)
  if (node.children) return node.children.map(extractText).join(' ')
  if (node.text) return node.text
  return ''
}
