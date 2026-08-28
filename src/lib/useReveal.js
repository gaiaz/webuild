import { useLayoutEffect } from 'react'
import { gsap, REDUCED_MOTION } from './gsap'

/**
 * Reveal semplice (non pinnato): gli elementi [data-reveal] dentro lo scope
 * entrano dal basso quando raggiungono il viewport.
 */
export function useReveal(scopeRef) {
  useLayoutEffect(() => {
    if (REDUCED_MOTION) return undefined
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 36,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        })
      })
    }, scopeRef)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
