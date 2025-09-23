// lib/hooks/useRouteName.ts
import { headers } from 'next/headers'

/**
 * Server helper to get the current route name.
 * Example: /posts => "posts"
 */
export function getRouteName(): { route: string } {
  const h = headers()
  return { route: h.get('x-route-name') || '' }
}
