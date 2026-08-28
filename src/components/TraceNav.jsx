import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { CHAPTERS } from '../data/fy2025'
import './TraceNav.css'

/**
 * La linea che costruisce: progress-nav persistente dei 5 capitoli.
 * Su desktop è una linea verticale a sinistra che "si costruisce" con lo scroll;
 * su mobile diventa una linea orizzontale in alto.
 */
const TraceNav = () => {
  const fillRef = useRef(null)
  const [active, setActive] = useState('growth')
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Avanzamento globale della linea + capitolo attivo
      // (l'attivo è l'ultimo capitolo il cui inizio ha superato metà viewport)
      ScrollTrigger.create({
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        onUpdate: (self) => {
          if (fillRef.current) {
            fillRef.current.style.setProperty('--progress', self.progress)
          }
          const mid = window.innerHeight / 2
          let current = CHAPTERS[0].id
          CHAPTERS.forEach((ch) => {
            const el = document.getElementById(ch.id)
            if (el && el.getBoundingClientRect().top <= mid) current = ch.id
          })
          setActive(current)
        },
      })
      // Tema chiaro/scuro della nav: contiamo le sezioni scure attive
      // (i pannelli dei progetti si sovrappongono in sticky-stack)
      let darkCount = 0
      document.querySelectorAll('[data-nav-theme="dark"]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 45%',
          onToggle: (self) => {
            darkCount += self.isActive ? 1 : -1
            setDark(darkCount > 0)
          },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  const handleJump = (id) => {
    document.getElementById(id)?.scrollIntoView({ block: 'start' })
  }

  return (
    <nav
      className={`trace-nav ${dark ? 'trace-nav--dark' : ''}`}
      aria-label="Capitoli"
    >
      <div className="trace-nav__track" aria-hidden="true">
        <div className="trace-nav__fill" ref={fillRef} />
      </div>
      <ul className="trace-nav__list">
        {CHAPTERS.map((ch) => (
          <li key={ch.id} className="trace-nav__item">
            <button
              type="button"
              className={`trace-nav__node ${
                active === ch.id ? 'trace-nav__node--active' : ''
              }`}
              onClick={() => handleJump(ch.id)}
              aria-current={active === ch.id ? 'true' : undefined}
            >
              <span className="trace-nav__tick" aria-hidden="true" />
              <span className="trace-nav__label">
                <span className="trace-nav__num">{ch.num}</span> {ch.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TraceNav
