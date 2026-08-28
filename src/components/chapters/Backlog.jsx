import { useRef } from 'react'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import { FY2025 } from '../../data/fy2025'
import './Backlog.css'

/* ─── Skyline in linguaggio "prospetto d'ingegneria" ───
   viewBox 1400×700, suolo a y=640.
   Sfondo tenue = città esistente · sagome piene = portafoglio costruzioni
   · strutture wireframe + gru = nuovi ordini */
const GROUND = 640

// Torre piena con arretramenti progressivi (setback) e antenna opzionale
const stepTower = ({ cx, w, h, steps = [], antenna = 0 }) => {
  const half = w / 2
  let leftPts = [`M ${cx - half} ${GROUND}`]
  let rightPts = []
  let currHalf = half
  steps.forEach(([frac, wFrac]) => {
    const y = GROUND - h * frac
    const newHalf = (w * wFrac) / 2
    leftPts.push(`L ${cx - currHalf} ${y}`, `L ${cx - newHalf} ${y}`)
    rightPts.unshift(`L ${cx + currHalf} ${y}`, `L ${cx + newHalf} ${y}`)
    currHalf = newHalf
  })
  const topY = GROUND - h
  const body = [
    ...leftPts,
    `L ${cx - currHalf} ${topY}`,
    `L ${cx + currHalf} ${topY}`,
    ...rightPts.reverse(),
    `L ${cx + half} ${GROUND}`,
    'Z',
  ].join(' ')
  const mast = antenna
    ? `M ${cx} ${topY} L ${cx} ${topY - antenna}`
    : ''
  return { body, mast }
}

const SOLID_TOWERS = [
  { cx: 120, w: 120, h: 230, steps: [[0.7, 0.72]] },
  { cx: 292, w: 150, h: 355, steps: [[0.55, 0.8], [0.82, 0.55]], antenna: 44 },
  { cx: 470, w: 110, h: 200 },
  { cx: 700, w: 160, h: 430, steps: [[0.6, 0.74], [0.86, 0.5]], antenna: 58 },
  { cx: 906, w: 130, h: 300, steps: [[0.76, 0.66]] },
  { cx: 1120, w: 150, h: 385, steps: [[0.52, 0.78], [0.84, 0.52]], antenna: 40 },
  { cx: 1316, w: 110, h: 255, steps: [[0.72, 0.7]] },
].map(stepTower)

const BG_TOWERS = [
  { x: 30, w: 90, h: 150 },
  { x: 190, w: 70, h: 250 },
  { x: 420, w: 100, h: 290 },
  { x: 600, w: 70, h: 180 },
  { x: 860, w: 90, h: 210 },
  { x: 1010, w: 70, h: 260 },
  { x: 1250, w: 90, h: 170 },
]

// Struttura in costruzione: telaio con solai e controventi
const wireTower = (x, w, h) => {
  const floor = 30
  let d = `M ${x} ${GROUND} V ${GROUND - h} H ${x + w} V ${GROUND}`
  for (let i = 1; i * floor < h; i += 1) {
    const y = GROUND - i * floor
    d += ` M ${x} ${y} H ${x + w}`
    if (i % 2 === 0 && (i + 1) * floor < h) {
      d += ` M ${x} ${y} L ${x + w} ${y - floor}`
    }
  }
  return d
}

const WIRE_TOWERS = [
  wireTower(370, 105, 470),
  wireTower(790, 115, 515),
  wireTower(1215, 100, 445),
]

// Gru a torre: traliccio, puntone, braccio reticolare, controbraccio, carrello
const crane = (x, topY, jib, back) => {
  let d = `M ${x - 7} ${GROUND} V ${topY} M ${x + 7} ${GROUND} V ${topY}`
  for (let y = GROUND - 6; y > topY + 20; y -= 44) {
    d += ` M ${x - 7} ${y} L ${x + 7} ${y - 22} L ${x - 7} ${y - 44}`
  }
  d += ` M ${x - 7} ${topY} L ${x} ${topY - 32} L ${x + 7} ${topY}`
  d += ` M ${x + 7} ${topY} H ${x + jib} M ${x} ${topY - 32} L ${x + jib} ${topY - 4}`
  d += ` M ${x + jib * 0.45} ${topY} V ${topY - 17}`
  d += ` M ${x - 7} ${topY} H ${x - back} M ${x} ${topY - 32} L ${x - back} ${topY - 5}`
  d += ` M ${x - back} ${topY} v 24 h 22 v -24`
  d += ` M ${x + jib * 0.74} ${topY} v 52 m -8 0 h 16`
  return d
}

const CRANES = [crane(338, 118, 180, 62), crane(1168, 104, 170, 60)]

const fmt = (v) => v.toFixed(1).replace('.', ',')

const Backlog = () => {
  const rootRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      tl
        // La città esistente affiora appena
        .fromTo('.backlog__bg', { opacity: 0 }, { opacity: 1, duration: 0.6 })
        // Strato 1 — il costruito: portafoglio costruzioni
        .fromTo(
          '.backlog__tower--solid',
          { scaleY: 0, transformOrigin: '50% 100%' },
          { scaleY: 1, duration: 1.2, stagger: 0.1, ease: 'power1.inOut' },
          '<0.2'
        )
        .fromTo('.backlog__stat--construction', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.6')
        // Strato 2 — il futuro in cantiere: nuovi ordini
        .set('.backlog__wire, .backlog__crane', { strokeDasharray: 3200, strokeDashoffset: 3200 }, 0)
        .to('.backlog__wire', { strokeDashoffset: 0, duration: 1.4, stagger: 0.15 }, '+=0.3')
        .to('.backlog__crane', { strokeDashoffset: 0, duration: 1.3, stagger: 0.2 }, '-=0.9')
        .fromTo('.backlog__stat--orders', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5 }, '-=1')
        // Strato 3 — la quota del totale, come in un disegno esecutivo
        .fromTo('.backlog__measure', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '+=0.3')
        .fromTo('.backlog__stat--total', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .fromTo('.backlog__kicker', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.5 })
    },
    { end: '+=420%' }
  )

  return (
    <section ref={rootRef} className="backlog" aria-labelledby="backlog-title">
      <div className="backlog__inner container">
        <header className="backlog__intro">
          <p className="annotation annotation--accent">02 · Future</p>
          <h2 id="backlog-title" className="backlog__title display">
            Il futuro, già in costruzione
          </h2>
        </header>

        <dl className="backlog__stats">
          <div className="backlog__stat backlog__stat--construction">
            <dd className="backlog__num">€{fmt(FY2025.backlogConstruction)} mld</dd>
            <dt className="annotation">portafoglio costruzioni</dt>
          </div>
          <div className="backlog__stat backlog__stat--orders">
            <dd className="backlog__num">€{fmt(FY2025.newOrders)} mld</dd>
            <dt className="annotation">nuovi ordini 2025</dt>
          </div>
          <div className="backlog__stat backlog__stat--total">
            <dd className="backlog__num">€{fmt(FY2025.backlogTotal)} mld</dd>
            <dt className="annotation">portafoglio ordini totale</dt>
          </div>
        </dl>

        <div
          className="backlog__city"
          role="img"
          aria-label="Una skyline astratta si costruisce in tre strati: 50,9 miliardi di portafoglio costruzioni come edifici, 13,2 miliardi di nuovi ordini come strutture in cantiere con gru, 58,4 miliardi di portafoglio totale come quota complessiva."
        >
          <svg viewBox="0 0 1400 700" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
            {BG_TOWERS.map((t, i) => (
              <rect key={i} className="backlog__bg" x={t.x} y={GROUND - t.h} width={t.w} height={t.h} />
            ))}
            {SOLID_TOWERS.map((t, i) => (
              <g key={i} className="backlog__tower--solid">
                <path className="backlog__solid" d={t.body} />
                {t.mast && <path className="backlog__mast" d={t.mast} />}
              </g>
            ))}
            {WIRE_TOWERS.map((d, i) => (
              <path key={i} className="backlog__wire" d={d} />
            ))}
            {CRANES.map((d, i) => (
              <path key={i} className="backlog__crane" d={d} />
            ))}
            <line className="backlog__ground" x1="0" y1={GROUND} x2="1400" y2={GROUND} />
            <g className="backlog__measure">
              <line x1="40" y1="52" x2="1360" y2="52" />
              <line x1="40" y1="38" x2="40" y2="66" />
              <line x1="1360" y1="38" x2="1360" y2="66" />
            </g>
          </svg>
        </div>

        <p className="backlog__kicker kicker">
          Il lavoro di oggi. <em>Il futuro già in costruzione.</em>
        </p>
      </div>
    </section>
  )
}

export default Backlog
