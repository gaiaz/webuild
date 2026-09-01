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
const CARRIAGE_W = 130
const CARRIAGE_H = 38
const CARRIAGE_GAP = 10
const WINDOW_W = 20
const WINDOW_H = 15
const WINDOW_COUNT = 4

const Carriage = ({ x, pantograph }) => {
  const top = RAIL_Y - 8 - CARRIAGE_H
  const bottom = RAIL_Y - 8
  const winGap = (CARRIAGE_W - WINDOW_COUNT * WINDOW_W) / (WINDOW_COUNT + 1)
  return (
    <g className="ferrovie__carriage">
      {pantograph && (
        <path
          className="ferrovie__pantograph"
          d={`M ${x + CARRIAGE_W / 2 - 14} ${top} L ${x + CARRIAGE_W / 2 - 6} ${top - 16} L ${
            x + CARRIAGE_W / 2 + 6
          } ${top - 16} L ${x + CARRIAGE_W / 2 + 14} ${top}`}
        />
      )}
      <rect className="ferrovie__carriage-body" x={x} y={top} width={CARRIAGE_W} height={CARRIAGE_H} rx="10" />
      {Array.from({ length: WINDOW_COUNT }, (_, i) => (
        <rect
          key={i}
          className="ferrovie__window"
          x={x + winGap + i * (WINDOW_W + winGap)}
          y={top + 9}
          width={WINDOW_W}
          height={WINDOW_H}
          rx="3"
        />
      ))}
      <circle className="ferrovie__wheel" cx={x + 26} cy={bottom - 4} r="8" />
      <circle className="ferrovie__wheel" cx={x + CARRIAGE_W - 26} cy={bottom - 4} r="8" />
    </g>
  )
}

const Ferrovie = () => {
  const rootRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      tl.set('.ferrovie__monolite', { x: -420 }, 0)
        .fromTo('.ferrovie__rail-group', { opacity: 0 }, { opacity: 1, duration: 0.7 })
        // il treno attraversa mentre il monolite avanza
        .fromTo('.ferrovie__train', { x: -290 }, { x: 1300, duration: 3, ease: 'none' }, '+=0.2')
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
            Mentre gli scavi avanzano,
            <br />
            i treni viaggiano in superficie.
          </h2>
        </header>

        <div
          className="ferrovie__viz"
          role="img"
          aria-label="Il monolite della galleria avanza sotto i binari mentre il treno continua il proprio percorso: tre linee ferroviarie in esercizio attraversate senza interrompere il traffico."
        >
          <svg viewBox="0 0 1200 460" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <pattern id="ferrovie-ballast" patternUnits="userSpaceOnUse" width="14" height="14">
                <rect width="14" height="14" className="ferrovie__ballast-bg" />
                <path
                  d="M0 14 L14 0 M-3.5 3.5 L3.5 -3.5 M10.5 17.5 L17.5 10.5"
                  className="ferrovie__ballast-line"
                />
              </pattern>
            </defs>
            <g className="ferrovie__rail-group">
              <rect x="0" y={RAIL_Y - 26} width="1200" height="56" fill="url(#ferrovie-ballast)" />
              {SLEEPERS.map((x) => (
                <line key={x} className="ferrovie__sleeper" x1={x} y1={RAIL_Y - 16} x2={x} y2={RAIL_Y + 16} />
              ))}
              <line className="ferrovie__rail" x1="40" y1={RAIL_Y - 8} x2="1160" y2={RAIL_Y - 8} />
              <line className="ferrovie__rail" x1="40" y1={RAIL_Y + 8} x2="1160" y2={RAIL_Y + 8} />
            </g>
            {/* treno in esercizio: due casse con finestrini, ruote e
                pantografo sulla motrice */}
            <g className="ferrovie__train">
              <Carriage x={0} pantograph />
              <Carriage x={CARRIAGE_W + CARRIAGE_GAP} />
              <line
                className="ferrovie__coupling"
                x1={CARRIAGE_W}
                y1={RAIL_Y - 8 - CARRIAGE_H / 2}
                x2={CARRIAGE_W + CARRIAGE_GAP}
                y2={RAIL_Y - 8 - CARRIAGE_H / 2}
              />
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
