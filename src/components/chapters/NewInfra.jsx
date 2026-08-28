import { useLayoutEffect, useRef } from 'react'
import { gsap, REDUCED_MOTION } from '../../lib/gsap'
import { useReveal } from '../../lib/useReveal'
import { INFRA_TYPES } from '../../data/fy2025'
import './NewInfra.css'

/* Sagome tipologiche in tratto d'ingegneria (pathLength=1 per il disegno progressivo) */
const GLYPHS = {
  hospitals: (
    <svg viewBox="0 0 320 220" aria-hidden="true">
      <path className="ninfra__draw" pathLength="1" d="M40 200 V80 H130 V40 H190 V80 H280 V200" />
      <path className="ninfra__draw ninfra__draw--accent" pathLength="1" d="M160 95 V145 M135 120 H185" />
      <path className="ninfra__draw" pathLength="1" d="M70 200 V150 H110 V200 M210 200 V150 H250 V200" />
    </svg>
  ),
  metros: (
    <svg viewBox="0 0 320 220" aria-hidden="true">
      <path className="ninfra__draw" pathLength="1" d="M40 200 A120 120 0 0 1 280 200" />
      <path className="ninfra__draw ninfra__draw--accent" pathLength="1" d="M80 200 A80 80 0 0 1 240 200" />
      <path className="ninfra__draw" pathLength="1" d="M110 200 V170 H210 V200 M130 170 V150 H190 V170" />
    </svg>
  ),
  railways: (
    <svg viewBox="0 0 320 220" aria-hidden="true">
      <path className="ninfra__draw ninfra__draw--accent" pathLength="1" d="M60 200 L150 30 M260 200 L170 30" />
      {[70, 105, 140, 175].map((y, i) => (
        <path
          key={y}
          className="ninfra__draw"
          pathLength="1"
          d={`M ${128 - i * 16} ${y} H ${192 + i * 16}`}
        />
      ))}
    </svg>
  ),
  roads: (
    <svg viewBox="0 0 320 220" aria-hidden="true">
      <path className="ninfra__draw" pathLength="1" d="M20 160 C 120 160 200 60 300 60" />
      <path className="ninfra__draw ninfra__draw--accent" pathLength="1" d="M20 60 C 120 60 200 160 300 160" />
      <path className="ninfra__draw" pathLength="1" d="M20 110 H 300" />
    </svg>
  ),
}

/**
 * 04 — Nuove infrastrutture: sezione tipologica e grafica.
 * Le geometrie emergono dal linguaggio dei dati precedenti.
 */
const NewInfra = () => {
  const rootRef = useRef(null)
  useReveal(rootRef)

  useLayoutEffect(() => {
    if (REDUCED_MOTION) return undefined
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.ninfra__type').forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll('.ninfra__draw'),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.6,
            stagger: 0.25,
            ease: 'power1.inOut',
            scrollTrigger: { trigger: el, start: 'top 78%', once: true },
          }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="ninfra" aria-labelledby="ninfra-title">
      <div className="container">
        <header className="ninfra__head" data-reveal>
          <p className="annotation annotation--accent">04 · New projects</p>
          <h2 id="ninfra-title" className="ninfra__title display">
            Le infrastrutture di domani
          </h2>
        </header>

        <ul className="ninfra__grid">
          {INFRA_TYPES.map((t, i) => (
            <li key={t.id} className="ninfra__type" data-reveal>
              <div className="ninfra__glyph">{GLYPHS[t.id]}</div>
              <p className="annotation">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="ninfra__label">{t.label}</h3>
              <p className="ninfra__note">{t.note}</p>
            </li>
          ))}
        </ul>

        <p className="ninfra__kicker kicker" data-reveal>
          Ogni nuova aggiudicazione <em>apre una nuova possibilità.</em>
        </p>
      </div>
    </section>
  )
}

export default NewInfra
