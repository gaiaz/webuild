import { useRef } from 'react'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import './Opening.css'

/**
 * 01a — Apertura. Minimale: 2025, la linea che si traccia,
 * poi "I risultati prendono forma".
 */
const Opening = () => {
  const rootRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      tl.set('.opening__line-path', { strokeDasharray: 1600, strokeDashoffset: 1600 })
        .to('.opening__line-path', { strokeDashoffset: 0, duration: 1.6 })
        .fromTo('.opening__phrase--one', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.9')
        .to('.opening__phrase--one', { opacity: 0, y: -24, duration: 0.6 }, '+=0.5')
        .fromTo('.opening__phrase--two', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, '<0.2')
        .to('.opening__phrase--two', { opacity: 0, y: -24, duration: 0.6 }, '+=0.5')
        .to('.opening__year', { opacity: 0.14, scale: 3.4, duration: 1 }, '<')
        .fromTo(
          '.opening__title .opening__word',
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, stagger: 0.18, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo('.opening__hint', { opacity: 0 }, { opacity: 1, duration: 0.4 })
        .to({}, { duration: 0.6 }) // respiro finale prima dell'uscita dal pin
    },
    { end: '+=380%' }
  )

  return (
    <section ref={rootRef} className="opening" aria-labelledby="opening-title">
      <p className="opening__meta annotation">
        Webuild — Risultati consolidati · esercizio 2025
      </p>

      <p className="opening__year big-number" aria-hidden="true">
        2025
      </p>

      <svg
        className="opening__line"
        viewBox="0 0 1600 8"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="opening__line-path" d="M0 4 H1600" />
      </svg>

      <p className="opening__phrase opening__phrase--one scene-phase">
        Ci sono numeri che raccontano un anno.
      </p>
      <p className="opening__phrase opening__phrase--two scene-phase">
        E numeri che <em>costruiscono il futuro</em>.
      </p>

      <h2 id="opening-title" className="opening__title display">
        {['I risultati', 'prendono', 'forma'].map((w) => (
          <span key={w} className="opening__mask">
            <span className="opening__word">{w}</span>
          </span>
        ))}
      </h2>

      <p className="opening__hint annotation" aria-hidden="true">
        Scorri — la costruzione inizia qui ↓
      </p>
    </section>
  )
}

export default Opening
