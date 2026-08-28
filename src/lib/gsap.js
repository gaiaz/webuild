import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// I pin vengono creati prima che font e layout si assestino: un refresh
// dopo il load completo riallinea start/end di tutti i trigger.
window.addEventListener('load', () => {
  setTimeout(() => ScrollTrigger.refresh(), 300)
})

if (import.meta.env.DEV) {
  window.__ST = ScrollTrigger
}

export const REDUCED_MOTION = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

export { gsap, ScrollTrigger }
