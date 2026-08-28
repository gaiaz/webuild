import { useRef } from 'react'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import { PEDE } from '../../data/pedemontana'
import './Bosco.css'

/**
 * 12 — Bosco. Tema forest. Confronto ad aree: le celle del taglio
 * permanente e le nuove aree verdi che le superano visivamente.
 * 1 cella = 0,1 ettari → 23 celle di taglio, 47 di nuovo verde.
 */
const CELL = 44
const GAP = 10
const PER_ROW = 12
const cellsOf = (n, offsetY) =>
  Array.from({ length: n }, (_, i) => ({
    i,
    x: (i % PER_ROW) * (CELL + GAP),
    y: Math.floor(i / PER_ROW) * (CELL + GAP) + offsetY,
  }))

const CUT_CELLS = cellsOf(Math.round(PEDE.ettariTaglio * 10), 0)
const GREEN_CELLS = cellsOf(Math.round(PEDE.ettariVerde * 10), 160)

const Bosco = () => {
  const rootRef = useRef(null)
  const haRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      const counter = { v: 0 }
      tl.fromTo(
        '.bosco__cell--cut',
        { opacity: 0 },
        { opacity: 1, duration: 0.8, stagger: 0.02 }
      )
        .fromTo('.bosco__lbl--cut', { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.3')
        .fromTo(
          '.bosco__cell--green',
          { scale: 0, transformOrigin: '50% 50%' },
          { scale: 1, duration: 1.8, stagger: 0.03, ease: 'power1.out' },
          '+=0.3'
        )
        .to(
          counter,
          {
            v: PEDE.ettariVerde,
            duration: 1.8,
            onUpdate: () => {
              if (haRef.current) {
                haRef.current.textContent = counter.v.toFixed(1).replace('.', ',')
              }
            },
          },
          '<'
        )
        .fromTo('.bosco__lbl--green', { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.3')
        .fromTo('.bosco__kicker', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.5 })
    },
    { end: '+=420%' }
  )

  return (
    <section
      ref={rootRef}
      className="bosco theme-forest"
      data-nav-theme="dark"
      aria-labelledby="bosco-title"
    >
      <div className="bosco__inner container">
        <header className="bosco__head">
          <p className="annotation annotation--accent">12 / 17 — Bosco</p>
          <h2 id="bosco-title" className="bosco__title display">
            Il verde non è solo da proteggere.
            <br />È da far crescere.
          </h2>
          <p className="bosco__figure big-number">
            <span ref={haRef}>{String(PEDE.ettariVerde).replace('.', ',')}</span>
            <span className="bosco__unit"> ettari</span>
          </p>
          <p className="annotation">di nuove aree verdi</p>
        </header>

        <div
          className="bosco__viz"
          role="img"
          aria-label="Confronto ad aree: le nuove aree verdi, 4,7 ettari, superano visivamente la superficie del taglio permanente ai margini del Bosco delle Querce, più che raddoppiandola. Ogni cella vale 0,1 ettari."
        >
          <svg viewBox="0 0 660 480" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {CUT_CELLS.map((c) => (
              <rect
                key={`c${c.i}`}
                className="bosco__cell bosco__cell--cut"
                x={c.x}
                y={c.y}
                width={CELL}
                height={CELL}
              />
            ))}
            <text className="bosco__lbl bosco__lbl--cut" x="0" y="140">
              taglio permanente — margini del Bosco delle Querce
            </text>
            {GREEN_CELLS.map((c) => (
              <rect
                key={`g${c.i}`}
                className="bosco__cell bosco__cell--green"
                x={c.x}
                y={c.y}
                width={CELL}
                height={CELL}
              />
            ))}
            <text className="bosco__lbl bosco__lbl--green" x="0" y="420">
              nuove aree verdi — più del doppio
            </text>
          </svg>
          <p className="annotation">una cella = 0,1 ettari</p>
        </div>

        <p className="bosco__kicker kicker">
          Più verde <em>di quanto se ne tolga.</em>
        </p>
      </div>
    </section>
  )
}

export default Bosco
