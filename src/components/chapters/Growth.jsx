import { useRef } from 'react'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import { FY2025, REVENUE_HISTORY } from '../../data/fy2025'
import './Growth.css'

/* ─── Geometria della scena: bars → viadotto ───
   viewBox 1200×620, baseline a y=540, altezza max 400 */
const VB = { w: 1200, h: 620 }
const BASE_Y = 540
const MAX_H = 400
const MAX_V = Math.max(...REVENUE_HISTORY.map((d) => d.value))
const SLOT = VB.w / (REVENUE_HISTORY.length + 0.5)

const BARS = REVENUE_HISTORY.map((d, i) => {
  const h = (d.value / MAX_V) * MAX_H
  return {
    ...d,
    cx: SLOT * (i + 0.75),
    topY: BASE_Y - h,
    h,
  }
})

const deckPath = `M ${BARS.map((b) => `${b.cx} ${b.topY}`).join(' L ')}`

// Pile del viadotto: trapezi che si allargano verso la base
const pierPath = (b) => {
  const wTop = 26
  const wBase = 46
  return `M ${b.cx - wTop / 2} ${b.topY + 10} L ${b.cx + wTop / 2} ${b.topY + 10}
          L ${b.cx + wBase / 2} ${BASE_Y} L ${b.cx - wBase / 2} ${BASE_Y} Z`
}

// Archi tra pile adiacenti (apice ~50px sotto la linea dell'impalcato)
const ARCHES = BARS.slice(0, -1).map((b, i) => {
  const next = BARS[i + 1]
  const apexY = (b.topY + next.topY) / 2 + 115
  const controlY = 2 * apexY - BASE_Y
  return `M ${b.cx} ${BASE_Y} Q ${(b.cx + next.cx) / 2} ${controlY} ${next.cx} ${BASE_Y}`
})

const Growth = () => {
  const rootRef = useRef(null)
  const revenueRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      const counter = { v: 0 }
      tl
        // Fase A — il numero cresce, le barre salgono
        .to(
          counter,
          {
            v: FY2025.revenue.value,
            duration: 1.4,
            onUpdate: () => {
              if (revenueRef.current) {
                revenueRef.current.textContent = counter.v.toFixed(1).replace('.', ',')
              }
            },
          },
          '<0.1'
        )
        .fromTo(
          '.growth__bar',
          { scaleY: 0, transformOrigin: '50% 100%' },
          { scaleY: 1, duration: 1.2, stagger: 0.12, ease: 'power1.inOut' },
          '<'
        )
        .fromTo(
          '.growth__value, .growth__yearlbl',
          { opacity: 0 },
          { opacity: 1, duration: 0.4, stagger: 0.06 },
          '-=0.5'
        )
        // Fase B — la linea di crescita attraversa le cime
        .set('.growth__deck-line', { strokeDasharray: 1400, strokeDashoffset: 1400 }, 0)
        .set('.growth__arch', { strokeDasharray: 600, strokeDashoffset: 600 }, 0)
        .to('.growth__deck-line', { strokeDashoffset: 0, duration: 1 })
        // Fase C — le barre diventano pile, la linea diventa impalcato
        .to('.growth__bar', { scaleX: 0.34, opacity: 0.14, transformOrigin: '50% 100%', duration: 0.9 }, '+=0.3')
        .to('.growth__value', { opacity: 0, duration: 0.3 }, '<')
        .fromTo('.growth__pier', { opacity: 0 }, { opacity: 1, duration: 0.7, stagger: 0.08 }, '<0.2')
        .to('.growth__deck-line', { strokeWidth: 16, duration: 0.8 }, '<')
        .fromTo('.growth__ground', { opacity: 0 }, { opacity: 1, duration: 0.8 }, '<')
        // Fase D — gli archi: l'EBITDA è la struttura che regge la crescita
        .to('.growth__arch', { strokeDashoffset: 0, duration: 1.1, stagger: 0.14 }, '+=0.2')
        .fromTo('.growth__ebitda', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.8')
        // Fase E — chiusura narrativa
        .fromTo('.growth__kicker', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.5 })
    },
    { end: '+=420%' }
  )

  return (
    <section ref={rootRef} className="growth" aria-labelledby="growth-title">
      <div className="growth__inner container">
        <header className="growth__head">
          <p className="annotation annotation--accent">01 · Crescita</p>
          <h2 id="growth-title" className="growth__title">
            <span className="growth__figure big-number">
              €<span ref={revenueRef}>13,6</span>
              <span className="growth__unit"> mld</span>
            </span>
            <span className="growth__caption">
              di ricavi <strong>{FY2025.revenue.delta}</strong>
            </span>
          </h2>
        </header>

        <div className="growth__chart" role="img" aria-label={`Ricavi in crescita dal 2021 al 2025, da 6,7 a 13,6 miliardi di euro. La curva dei ricavi diventa il profilo di un viadotto.`}>
          <svg viewBox={`0 0 ${VB.w} ${VB.h}`} preserveAspectRatio="xMidYMax meet" aria-hidden="true">
            {/* barre = dato */}
            {BARS.map((b) => (
              <g key={b.year}>
                <rect
                  className="growth__bar"
                  x={b.cx - 55}
                  y={b.topY}
                  width="110"
                  height={b.h}
                />
                <text className="growth__value" x={b.cx} y={b.topY - 18} textAnchor="middle">
                  {b.value.toFixed(1).replace('.', ',')}
                </text>
                <text className="growth__yearlbl" x={b.cx} y={BASE_Y + 34} textAnchor="middle">
                  {b.year}
                </text>
              </g>
            ))}
            {/* struttura = viadotto */}
            {BARS.map((b) => (
              <path key={`p${b.year}`} className="growth__pier" d={pierPath(b)} />
            ))}
            {ARCHES.map((d, i) => (
              <path key={`a${i}`} className="growth__arch" d={d} />
            ))}
            <path className="growth__deck-line" d={deckPath} />
            <line
              className="growth__ground"
              x1="40"
              y1={BASE_Y}
              x2={VB.w - 40}
              y2={BASE_Y}
            />
          </svg>

          <aside className="growth__ebitda">
            <p className="growth__ebitda-figure big-number">
              €1,2<span className="growth__unit"> mld</span>
            </p>
            <p className="growth__ebitda-caption">
              di EBITDA <strong>{FY2025.ebitda.delta}</strong> — la struttura che
              regge la crescita.
            </p>
          </aside>
        </div>

        <p className="growth__kicker kicker">
          Più crescita. <em>Più solidità.</em>
        </p>
      </div>
    </section>
  )
}

export default Growth
