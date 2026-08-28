import { useRef } from 'react'
import { prepStroke } from '../../lib/drawStroke'
import { useSceneTimeline, fmtInt } from '../../lib/useSceneTimeline'
import { PEDE } from '../../data/pedemontana'
import './Persone.css'

/* ─── Campo di punti: 1 punto = 10 persone → 130 punti (26×5).
   Una fascia di punti si accende in rosso e compone il tracciato. ─── */
const COLS = 26
const ROWS = 5
const GAP_X = 1400 / (COLS + 1)
const GAP_Y = 420 / (ROWS + 1)

// Il tracciato attraversa il campo: per ogni colonna, la riga "attiva"
const TRACE_ROW = [2, 2, 2, 1, 1, 1, 2, 2, 3, 3, 3, 2, 2, 2, 1, 1, 2, 2, 2, 3, 3, 2, 2, 1, 1, 2]

const DOTS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS
  const row = Math.floor(i / COLS)
  return {
    i,
    x: GAP_X * (col + 1),
    y: GAP_Y * (row + 1) + 20,
    onTrace: TRACE_ROW[col] === row,
  }
})

const TRACE_D = `M ${DOTS.filter((d) => d.onTrace)
  .map((d) => `${d.x} ${d.y}`)
  .join(' L ')}`

const FIGURES = [31, 63, 92].map((i) => DOTS[i])

const personPath = (x, y) =>
  `M ${x} ${y - 26} a 8 8 0 1 1 0.01 0
   M ${x} ${y - 10} v 20 M ${x} ${y - 6} l -10 10 M ${x} ${y - 6} l 10 10
   M ${x} ${y + 10} l -7 16 M ${x} ${y + 10} l 7 16`

const Persone = () => {
  const rootRef = useRef(null)
  const countRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl, root }) => {
      const counter = { v: 0 }
      prepStroke(tl, '.persone__trace', root)
        prepStroke(tl, '.persone__figure', root)
        .to(counter, {
          v: PEDE.personePicco,
          duration: 1.6,
          onUpdate: () => {
            if (countRef.current) {
              countRef.current.textContent = `~${fmtInt(counter.v)}`
            }
          },
        })
        .fromTo(
          '.persone__dot',
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.6,
            stagger: { grid: [ROWS, COLS], from: 'edges', amount: 1.3 },
          },
          '<'
        )
        // il tracciato si compone attraverso le persone
        .to('.persone__trace', { strokeDashoffset: 0, duration: 1.6 }, '+=0.3')
        .to('.persone__dot--trace', { fill: 'var(--color-accent)', r: 5, duration: 1.2 }, '<0.2')
        // alcuni punti diventano figure
        .to('.persone__figure', { strokeDashoffset: 0, duration: 0.9, stagger: 0.18 }, '+=0.2')
        .fromTo('.persone__kicker', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.5 })
    },
    { end: '+=440%' }
  )

  return (
    <section ref={rootRef} className="persone" aria-labelledby="persone-title">
      <div className="persone__inner container">
        <header className="persone__head">
          <p className="annotation annotation--accent">15 / 17 — Persone</p>
          <h2 id="persone-title" className="persone__title">
            <span className="persone__caption display">
              Dietro ogni metro costruito,
              <br />
              migliaia di competenze in movimento.
            </span>
            <span ref={countRef} className="big-number persone__figure-num">
              ~{fmtInt(PEDE.personePicco)}
            </span>
            <span className="persone__sub">persone coinvolte al picco dei lavori</span>
          </h2>
        </header>

        <div
          className="persone__field"
          role="img"
          aria-label="Fino a 1.300 persone al picco dei lavori, rappresentate come un campo di punti: ogni punto vale 10 persone. Il tracciato si compone attraverso le persone che lo costruiscono."
        >
          <svg viewBox="0 0 1400 480" aria-hidden="true">
            <path className="persone__trace" d={TRACE_D} />
            {DOTS.map((d) => (
              <circle
                key={d.i}
                className={`persone__dot ${d.onTrace ? 'persone__dot--trace' : ''}`}
                cx={d.x}
                cy={d.y}
                r="3.4"
              />
            ))}
            {FIGURES.map((d) => (
              <path
                key={d.i}
                className="persone__figure"
                d={personPath(d.x, d.y - 34)}
              />
            ))}
          </svg>
          <p className="persone__scale annotation">· = 10 persone</p>
        </div>

        <p className="persone__kicker kicker">
          Progetto, tecnologia e conoscenza <em>diventano infrastruttura.</em>
        </p>
      </div>
    </section>
  )
}

export default Persone
