import { useRef } from 'react'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import { PEDE } from '../../data/pedemontana'
import './Ferrovie.css'

/**
 * 09 — Ferrovie. Sopra i binari il treno continua a viaggiare;
 * sotto, il monolite avanza fino a posizionarsi sotto la linea.
 */
const RAIL_Y = 190
const SLEEPERS = Array.from({ length: 26 }, (_, i) => 60 + i * 42)

const Ferrovie = () => {
  const rootRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      tl.set('.ferrovie__monolite', { x: -420 }, 0)
        .fromTo('.ferrovie__rail-group', { opacity: 0 }, { opacity: 1, duration: 0.7 })
        // il treno attraversa mentre il monolite avanza
        .fromTo('.ferrovie__train', { x: -260 }, { x: 1300, duration: 3, ease: 'none' }, '+=0.2')
        .to('.ferrovie__monolite', { x: 0, duration: 3, ease: 'none' }, '<')
        .fromTo('.ferrovie__lines-note', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.8')
        .fromTo('.ferrovie__body', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.5 })
    },
    { end: '+=440%' }
  )

  return (
    <section ref={rootRef} className="ferrovie" aria-labelledby="ferrovie-title">
      <div className="ferrovie__inner container">
        <header className="ferrovie__head">
          <p className="annotation annotation--accent">09 / 17 — Ferrovie</p>
          <h2 id="ferrovie-title" className="ferrovie__title display">
            Sotto, il cantiere avanza.
            <br />
            Sopra, i treni continuano a viaggiare.
          </h2>
        </header>

        <div
          className="ferrovie__viz"
          role="img"
          aria-label="Il monolite della galleria avanza sotto i binari mentre il treno continua il proprio percorso: tre linee ferroviarie in esercizio attraversate senza interrompere il traffico."
        >
          <svg viewBox="0 0 1200 460" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <g className="ferrovie__rail-group">
              {SLEEPERS.map((x) => (
                <line key={x} className="ferrovie__sleeper" x1={x} y1={RAIL_Y - 8} x2={x} y2={RAIL_Y + 8} />
              ))}
              <line className="ferrovie__rail" x1="40" y1={RAIL_Y - 8} x2="1160" y2={RAIL_Y - 8} />
              <line className="ferrovie__rail" x1="40" y1={RAIL_Y + 8} x2="1160" y2={RAIL_Y + 8} />
            </g>
            {/* treno in esercizio */}
            <g className="ferrovie__train">
              <rect x="0" y={RAIL_Y - 52} width="120" height="36" rx="8" />
              <rect x="128" y={RAIL_Y - 52} width="120" height="36" rx="8" />
            </g>
            {/* il monolite che avanza sotto */}
            <g className="ferrovie__monolite">
              <rect className="ferrovie__box" x="450" y="280" width="300" height="120" />
              <path className="ferrovie__push" d="M 450 340 H 340 M 360 322 L 340 340 L 360 358" />
              <text className="ferrovie__box-lbl" x="600" y="348" textAnchor="middle">
                monolite
              </text>
            </g>
            <text className="ferrovie__lines-note annotation-svg" x="40" y="440">
              {PEDE.linneFerroviarie} linee ferroviarie in esercizio — traffico mai interrotto
            </text>
          </svg>
        </div>

        <p className="ferrovie__body">
          Gallerie progettate su misura attraversano tre linee ferroviarie in
          esercizio senza interromperne il traffico.
        </p>
      </div>
    </section>
  )
}

export default Ferrovie
