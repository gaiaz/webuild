import { useRef } from 'react'
import { prepStroke } from '../../lib/drawStroke'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import { PEDE } from '../../data/pedemontana'
import './SottoSuperficie.css'

/**
 * 05 — Sotto la superficie. La scena chiave: il profilo longitudinale.
 * La linea del territorio resta continua in alto; la strada scende
 * in trincea e in galleria. Tema night: siamo sottoterra.
 */
const SURFACE_D = 'M 0 150 L 180 146 L 400 154 L 640 148 L 880 155 L 1100 149 L 1200 152'
// Profilo della strada: superficie → trincea → galleria → risalita
const ROUTE_D =
  'M 20 150 L 150 152 C 240 156 260 260 340 268 L 520 274 C 600 278 620 380 700 384 L 900 386 C 990 384 1010 240 1090 200 L 1180 158'

const HATCHES = Array.from({ length: 30 }, (_, i) => {
  const x = 40 + i * 40
  return `M ${x} ${170 + (i % 3) * 8} l 22 -14`
})

const SottoSuperficie = () => {
  const rootRef = useRef(null)
  const pctRef = useRef(null)
  const kmRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl, root }) => {
      const counter = { p: 0, k: 0 }
      prepStroke(tl, '.sottosup__route', root)
        prepStroke(tl, '.sottosup__surface', root)
        .to('.sottosup__surface', { strokeDashoffset: 0, duration: 1 })
        .fromTo('.sottosup__hatch', { opacity: 0 }, { opacity: 0.5, duration: 0.8 }, '-=0.4')
        // la strada scende
        .to('.sottosup__route', { strokeDashoffset: 0, duration: 2.2 }, '+=0.2')
        .to(
          counter,
          {
            p: PEDE.pctInterrata,
            k: PEDE.kmInterrata,
            duration: 2.2,
            onUpdate: () => {
              if (pctRef.current) pctRef.current.textContent = Math.round(counter.p)
              if (kmRef.current) {
                kmRef.current.textContent = counter.k.toFixed(1).replace('.', ',')
              }
            },
          },
          '<'
        )
        .fromTo('.sottosup__zone', { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.2 }, '-=1')
        .fromTo('.sottosup__stats', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.2')
        .fromTo('.sottosup__kicker', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.6 })
    },
    { end: '+=460%' }
  )

  return (
    <section
      ref={rootRef}
      className="sottosup theme-night"
      data-nav-theme="dark"
      aria-labelledby="sottosup-title"
    >
      <div className="sottosup__inner container">
        <header className="sottosup__head">
          <p className="annotation annotation--accent">05 / 17 — Sotto la superficie</p>
          <h2 id="sottosup-title" className="sottosup__title display">
            La strada scende.
            <br />
            Il territorio resta continuo.
          </h2>
        </header>

        <div
          className="sottosup__viz"
          role="img"
          aria-label="Profilo longitudinale delle tratte B2 e C: la linea del territorio resta continua in superficie, mentre la strada scende in trincea e in galleria per l'85% del tracciato."
        >
          <svg viewBox="0 0 1200 460" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {HATCHES.map((d) => (
              <path key={d} className="sottosup__hatch" d={d} />
            ))}
            <path className="sottosup__surface" d={SURFACE_D} />
            <path className="sottosup__route" d={ROUTE_D} />
            <text className="sottosup__zone" x="430" y="320">trincea</text>
            <text className="sottosup__zone" x="790" y="430">galleria</text>
            <text className="sottosup__zone sottosup__zone--surface" x="60" y="120">
              superficie
            </text>
          </svg>
        </div>

        <dl className="sottosup__stats">
          <div className="sottosup__stat">
            <dd className="big-number sottosup__stat-num">
              <span ref={pctRef}>{PEDE.pctInterrata}</span>%
            </dd>
            <dt className="sottosup__stat-lbl">
              delle tratte B2 e C si sviluppa in trincea o in galleria.
            </dt>
          </div>
          <div className="sottosup__stat">
            <dd className="big-number sottosup__stat-num">
              <span ref={kmRef}>{String(PEDE.kmInterrata).replace('.', ',')}</span> km
            </dd>
            <dt className="sottosup__stat-lbl">di infrastruttura interrata.</dt>
          </div>
        </dl>

        <p className="sottosup__kicker kicker">
          Due livelli, <em>un solo territorio.</em>
        </p>
      </div>
    </section>
  )
}

export default SottoSuperficie
