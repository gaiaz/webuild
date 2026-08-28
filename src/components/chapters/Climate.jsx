import { useRef } from 'react'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import './Climate.css'

/**
 * 05b — Clima. Silenzio visivo: la linea che ha guidato tutta
 * l'esperienza disegna la lettera A del rating CDP.
 */
const Climate = () => {
  const rootRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      tl
        .set('.climate__stroke', { strokeDasharray: 1, strokeDashoffset: 1 })
        .to('.climate__stroke--left', { strokeDashoffset: 0, duration: 1 }, '+=0.3')
        .to('.climate__stroke--right', { strokeDashoffset: 0, duration: 1 }, '-=0.4')
        .to('.climate__stroke--bar', { strokeDashoffset: 0, duration: 0.5 })
        .fromTo('.climate__rating', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2')
        .fromTo('.climate__horizon', { autoAlpha: 0 }, { autoAlpha: 0.6, duration: 1 }, '<')
        .fromTo('.climate__kicker', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.6 })
    },
    { end: '+=320%' }
  )

  return (
    <section
      ref={rootRef}
      className="climate theme-forest"
      data-nav-theme="dark"
      aria-labelledby="climate-title"
    >
      <div className="climate__inner container">
        <header className="climate__head">
          <p className="annotation annotation--accent">05 · Planet</p>
          <h2 id="climate-title" className="climate__title">
            CDP — Climate Change 2025
          </h2>
        </header>

        <div
          className="climate__letter"
          role="img"
          aria-label="Rating A, CDP Climate Change 2025: la lettera A disegnata dalla linea rossa che attraversa tutta la storia."
        >
          <svg viewBox="0 0 600 520" aria-hidden="true">
            <path
              className="climate__stroke climate__stroke--left"
              pathLength="1"
              d="M 120 470 L 300 60"
            />
            <path
              className="climate__stroke climate__stroke--right"
              pathLength="1"
              d="M 300 60 L 480 470"
            />
            <path
              className="climate__stroke climate__stroke--bar"
              pathLength="1"
              d="M 195 330 L 405 330"
            />
            <line
              className="climate__horizon"
              x1="40"
              y1="470"
              x2="560"
              y2="470"
            />
          </svg>
          <p className="climate__rating annotation">
            Rating <strong>A</strong> — leadership climatica
          </p>
        </div>

        <p className="climate__kicker kicker">
          Crescere oggi. <em>Pensando al domani.</em>
        </p>
      </div>
    </section>
  )
}

export default Climate
