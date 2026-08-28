import { useLayoutEffect } from 'react'
import { gsap, REDUCED_MOTION } from './gsap'

/**
 * Monta una timeline GSAP legata allo scroll dentro un gsap.context.
 * Con prefers-reduced-motion la timeline non viene creata:
 * il CSS ([data-motion="reduced"]) mostra gli stati finali in flusso.
 *
 * @param {React.RefObject} scopeRef - elemento radice della scena
 * @param {(ctx: { tl: gsap.core.Timeline, root: Element }) => void} build - costruisce la timeline
 * @param {object} triggerVars - override per scrollTrigger (end, pin, ...)
 */
export function useSceneTimeline(scopeRef, build, triggerVars = {}) {
  useLayoutEffect(() => {
    if (REDUCED_MOTION) return undefined
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: scopeRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          ...triggerVars,
        },
      })
      build({ tl, root: scopeRef.current })
    }, scopeRef)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

/** Formatta un numero con separatore migliaia italiano. */
export const fmtInt = (n) => Math.round(n).toLocaleString('it-IT')
