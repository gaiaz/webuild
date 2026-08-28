import { useEffect, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import './SiteHeader.css'

/**
 * Header persistente: il logo resta fisso in alto a destra per tutta la
 * narrazione. Fonte di verità unica — le pagine lo montano una volta sola.
 *
 * Si ritira sulle sezioni marcate `data-hide-header` — l'apertura e
 * l'endframe — dove il marchio ha già il suo spazio e non deve comparire
 * due volte.
 *
 * La misura è presa dal vivo sul `.pin-spacer`: quelle sezioni sono pinnate
 * e durante il pin diventano `position: fixed`, quindi start/end calcolati
 * da un ScrollTrigger esterno sull'elemento risultano sbagliati. Lo spacer,
 * invece, conserva sempre il vero ingombro nel documento.
 */
const boxOf = (el) => {
  const parent = el.parentElement
  const target = parent?.classList.contains('pin-spacer') ? parent : el
  return target.getBoundingClientRect()
}

const SiteHeader = () => {
  // parte nascosto: l'apertura ha già il marchio grande al centro
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const marked = [...document.querySelectorAll('[data-hide-header]')]
      if (!marked.length) return

      const update = () => {
        const covered = marked.some((el) => {
          const box = boxOf(el)
          return box.top < window.innerHeight && box.bottom > 0
        })
        setHidden(covered)
      }

      ScrollTrigger.create({
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        onUpdate: update,
        onRefresh: update,
      })
      update()
    })
    return () => ctx.revert()
  }, [])

  return (
    <header
      className={`site-header ${hidden ? 'site-header--hidden' : ''}`}
      aria-hidden={hidden || undefined}
    >
      <a className="site-header__home" href="#top" aria-label="Webuild — torna all'inizio">
        <img
          className="site-header__logo"
          src="/webuild-logo.svg"
          alt="Webuild"
          width="119"
          height="33"
        />
      </a>
    </header>
  )
}

export default SiteHeader
