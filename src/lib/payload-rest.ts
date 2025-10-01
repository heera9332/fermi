// lib/payload-rest.ts
type RestParams = Record<string, any>

export async function payloadGet<T>(path: string, params: RestParams = {}) {
  const base = process.env.NEXT_PUBLIC_SERVER_URL!
  const query = new URLSearchParams()

  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    if (typeof v === 'object') query.set(k, JSON.stringify(v))
    else query.set(k, String(v))
  })

  const url = `${base}${path}${query.toString() ? `?${query.toString()}` : ''}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Payload GET ${url} failed: ${res.status}`)
  return (await res.json()) as T
}
