import { useRef } from 'react'
import { useSceneTimeline, fmtInt } from '../../lib/useSceneTimeline'
import { FY2025 } from '../../data/fy2025'
import './People.css'

/* ─── Campo di punti: ogni punto ≈ 80 persone ───
   Griglia 44×27 = 1.188 punti su viewBox 1400×760.
   Deterministico: gli "accenti" (assunzioni, ritratti) derivano dall'indice. */
const COLS = 44
const ROWS = 27
const GAP_X = 1400 / (COLS + 1)
const GAP_Y = 700 / (ROWS + 1)

const DOTS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS
  const row = Math.floor(i / COLS)
  return {
    i,
    x: GAP_X * (col + 1),
    y: GAP_Y * (row + 1) + 30,
    // ~16% assunzioni 2025 (15.000 su 95.000) — pseudo-casuale deterministico
    isHire: (i * 2654435761) % 100 < 16,
  }
})

// Alcuni punti si risolvono in figure umane
const FIGURES = [214, 505, 703, 981, 1102].map((i) => DOTS[i])

const personPath = (x, y) =>
  `M ${x} ${y - 26} a 8 8 0 1 1 0.01 0
   M ${x} ${y - 10} v 20 M ${x} ${y - 6} l -10 10 M ${x} ${y - 6} l 10 10
   M ${x} ${y + 10} l -7 16 M ${x} ${y + 10} l 7 16`

const People = () => {
  const rootRef = useRef(null)
  const countRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      const counter = { v: 0 }
      tl
        .to(
          counter,
          {
            v: FY2025.people,
            duration: 1.6,
            onUpdate: () => {
              if (countRef.current) countRef.current.textContent = `~${fmtInt(counter.v)}`
            },
          },
          '<0.2'
        )
        // il numero si risolve in persone: i punti emergono a ondate dal centro
        .fromTo(
          '.people__dot',
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.6,
            stagger: { grid: [ROWS, COLS], from: 'center', amount: 1.4 },
          },
          '<'
        )
        // le nuove assunzioni si accendono
        .fromTo('.people__stat--hires', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '+=0.3')
        .to('.people__dot--hire', { fill: 'var(--color-accent)', duration: 0.8 }, '<')
        // le nazionalità: anelli attorno a una parte del campo
        .fromTo('.people__stat--nat', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '+=0.3')
        // alcuni punti diventano figure
        .set('.people__figure', { strokeDasharray: 1, strokeDashoffset: 1 })
        .to('.people__figure', { strokeDashoffset: 0, duration: 1, stagger: 0.15 }, '+=0.2')
        .fromTo('.people__kicker', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.5 })
    },
    { end: '+=420%' }
  )

  return (
    <section ref={rootRef} className="people" aria-labelledby="people-title">
      <div className="people__inner container">
        <header className="people__head">
          <div>
            <p className="annotation annotation--accent">05 · People</p>
            <h2 id="people-title" className="people__title">
              <span ref={countRef} className="big-number people__figure-num">
                ~{fmtInt(FY2025.people)}
              </span>
              <span className="people__caption">persone, in tutto il mondo</span>
            </h2>
          </div>

          <dl className="people__stats">
            <div className="people__stat people__stat--nat">
              <dd className="people__stat-num">{FY2025.nationalities}+</dd>
              <dt className="annotation">nazionalità</dt>
            </div>
            <div className="people__stat people__stat--hires">
              <dd className="people__stat-num">~{fmtInt(FY2025.newHires)}</dd>
              <dt className="annotation">nuove assunzioni nel 2025</dt>
            </div>
          </dl>
        </header>

        <div
          className="people__field"
          role="img"
          aria-label="Circa 95.000 persone rappresentate come un campo di punti: ogni punto vale circa 80 persone. In rosso, le circa 15.000 nuove assunzioni del 2025."
        >
          <svg viewBox="0 0 1400 760" aria-hidden="true">
            {DOTS.map((d) => (
              <circle
                key={d.i}
                className={`people__dot ${d.isHire ? 'people__dot--hire' : ''}`}
                cx={d.x}
                cy={d.y}
                r="3.2"
              />
            ))}
            {FIGURES.map((d) => (
              <path
                key={d.i}
                className="people__figure"
                pathLength="1"
                d={personPath(d.x, d.y)}
              />
            ))}
          </svg>
          <p className="people__scale annotation">· = ~80 persone</p>
        </div>

        <p className="people__kicker kicker">
          Dietro ogni risultato, <em>le competenze che lo rendono possibile.</em>
        </p>
      </div>
    </section>
  )
}

export default People
