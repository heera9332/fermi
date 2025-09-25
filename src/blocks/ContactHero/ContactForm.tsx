'use client'

import * as React from 'react'
import Image from 'next/image' // if you add logos later; safe to keep
// Minimal shape we actually use from Payload
type FormField = {
  blockType: 'text' | 'email' | 'textarea'
  name: string
  label?: string
  placeholder?: string
  width?: number
  required?: boolean
  id?: string
}
type PayloadForm = {
  id: string
  title?: string
  fields: FormField[]
  submitButtonLabel?: string
  confirmationType?: 'message' | 'redirect'
  confirmationMessage?: any // lexical JSON; we’ll soft-parse text
}

function lexicalToPlainText(node: any): string {
  // super light extractor for your example JSON
  try {
    if (!node) return ''
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(lexicalToPlainText).join(' ')
    if (node.root) return lexicalToPlainText(node.root)
    if (node.children) return node.children.map(lexicalToPlainText).join(' ')
    if (node.text) return node.text
    return ''
  } catch {
    return ''
  }
}

function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(' ')
}

type Props = {
  form: PayloadForm
  className?: string
}

/**
 * DynamicContactForm
 * - Renders inputs from Payload Form JSON
 * - Client-side required validation
 * - UX niceties: animated submit arrow, loading state, inline errors, success banner
 * - Honeypot (bot trap)
 */
function ContactForm({ form, className }: Props) {
  const [values, setValues] = React.useState<Record<string, string>>({})
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(false)
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null)
  const [serverError, setServerError] = React.useState<string | null>(null)
  const honeypotRef = React.useRef<HTMLInputElement | null>(null)

  const fields = form?.fields || []
  const submitLabel = form?.submitButtonLabel || 'Submeter'
  const confirmationText =
    (form?.confirmationMessage && lexicalToPlainText(form.confirmationMessage)) || 'Form submitted'

  // Resize textarea to content height
  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = '0px'
    el.style.height = Math.min(el.scrollHeight, 280) + 'px'
  }

  const onChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const v = e.target.value
      setValues((s) => ({ ...s, [name]: v }))
      if (errors[name]) setErrors((s) => ({ ...s, [name]: '' }))
      if (e.target.tagName === 'TEXTAREA') autoResize(e.target as HTMLTextAreaElement)
    }

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    for (const f of fields) {
      const val = (values[f.name] || '').trim()
      if (f.required && !val) next[f.name] = `${f.label || f.name} é obrigatório`
      if (f.blockType === 'email' && val) {
        // simple email check
        const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
        if (!ok) next[f.name] = 'Email inválido'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)
    setSuccessMsg(null)

    // honeypot
    if (honeypotRef.current?.value) {
      return
    }

    if (!validate()) return

    setLoading(true)
    try {
      const submissionData = fields.map((f) => ({
        field: f.name,
        value: values[f.name] ?? '',
      }))

      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: form.id,
          submissionData,
        }),
      })

      if (!res.ok) {
        const t = await res.text().catch(() => '')
        throw new Error(t || `Request failed: ${res.status}`)
      }

      // success
      setValues({})
      setSuccessMsg(confirmationText)
    } catch (err: any) {
      setServerError(err?.message || 'Algo correu mal. Por favor tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      id="contact-form"
      className={cn(
        'w-full max-w-[694px] flex justify-center items-center gap-8 flex-col sm:flex-row rounded-[24px] p-6 sm:p-8 bg-[#EDEDED]',
        className,
      )}
    >
      <div className="w-full sm:w-[646px] flex flex-col gap-6">
        {successMsg ? (
          <div className="rounded-xl bg-white text-[#0B0E2A] border border-[#E0E0E0] p-4">
            {successMsg}
          </div>
        ) : null}

        {serverError ? (
          <div className="rounded-xl bg-[#FEE2E2] text-[#7F1D1D] border border-[#FCA5A5] p-4">
            {serverError}
          </div>
        ) : null}

        <form
          onSubmit={onSubmit}
          noValidate
          className="w-full h-full min-w-[240px] flex flex-col gap-6 sm:gap-[24px] rounded-[12px] p-4"
        >
          {/* honeypot field (hidden to humans) */}
          <input
            ref={honeypotRef}
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />

          {fields.map((field) => {
            const isTextArea = field.blockType === 'textarea'
            const name = field.name
            const label = field.label || field.name
            const required = !!field.required
            const error = errors[name]
            // placeholder fallback (keeps your vibe)
            const placeholder =
              field.placeholder ??
              (isTextArea
                ? 'Conte-nos os seus problemas e necessidades'
                : label + (required ? '*' : ''))

            return (
              <div key={field.id ?? field.name} className="w-full flex flex-col gap-2">
                <label
                  htmlFor={name}
                  className="font-ClashDisplayVariable font-normal text-[#1E1E1E] text-base leading-[140%]"
                >
                  {label}
                  {required ? <span className="text-red-500"> *</span> : null}
                </label>

                {/* description slot – keep for future */}
                <p className="description font-sans font-normal text-sm leading-[140%] tracking-normal text-black/50" />

                {isTextArea ? (
                  <textarea
                    id={name}
                    name={name}
                    value={values[name] ?? ''}
                    onChange={onChange(name)}
                    rows={3}
                    placeholder={placeholder}
                    className={cn(
                      'text-[#1E1E1E] placeholder:text-[#B3B3B3]',
                      'w-full min-w-[240px] min-h-[50px] px-[16px] py-[8px]',
                      'border-b-[2px] border-[#E0E0E0] text-[16px] outline-none bg-transparent',
                      'resize-none overflow-hidden',
                      'transition-colors duration-200 focus:border-[#4ECDC4]',
                    )}
                  />
                ) : (
                  <input
                    id={name}
                    name={name}
                    type={field.blockType === 'email' ? 'email' : 'text'}
                    value={values[name] ?? ''}
                    onChange={onChange(name)}
                    placeholder={placeholder}
                    className={cn(
                      'text-[#1E1E1E] placeholder:text-[#B3B3B3]',
                      'w-full min-w-[240px] h-[46px] px-[16px] py-[8px]',
                      'border-b-[2px] border-[#E0E0E0] text-[16px] outline-none bg-transparent',
                      'transition-colors duration-200 focus:border-[#4ECDC4]',
                    )}
                    inputMode={field.blockType === 'email' ? 'email' : 'text'}
                  />
                )}

                {error ? <span className="text-sm text-red-600 pt-1">{error}</span> : null}
              </div>
            )
          })}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'w-full h-[52px] px-[20px] py-[16px] rounded-[24px] border-2 border-[#E0E0E0]',
              'flex items-center justify-center text-[#030531] text-[20px] bg-white',
              'transition-all duration-300',
              loading && 'opacity-70 cursor-not-allowed',
            )}
          >
            <span className={cn('transition-all duration-300', 'group-hover:mr-2')}>
              {loading ? 'A enviar…' : submitLabel}
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}

export { ContactForm }
