import { useRef } from 'react'
import { useSceneTimeline, fmtInt } from '../../lib/useSceneTimeline'
import { FY2025 } from '../../data/fy2025'
import './Safety.css'

/* ─── 815.000 ore rese tangibili: 163 segni di conteggio, 1 segno = 5.000 ore ─── */
const CLUSTERS = 163
const PER_ROW = 24
const CELL_W = 1400 / PER_ROW
const CELL_H = 64

const tallyPath = (cx, cy) => {
  const verts = [0, 9, 18, 27]
    .map((dx) => `M ${cx + dx} ${cy} v 34`)
    .join(' ')
  return `${verts} M ${cx - 5} ${cy + 30} L ${cx + 32} ${cy + 4}`
}

const MARKS = Array.from({ length: CLUSTERS }, (_, i) => ({
  i,
  d: tallyPath(
    (i % PER_ROW) * CELL_W + 14,
    Math.floor(i / PER_ROW) * CELL_H + 10
  ),
}))

const Safety = () => {
  const rootRef = useRef(null)
  const hoursRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      const counter = { v: 0 }
      tl
        .to(
          counter,
          {
            v: FY2025.safetyTrainingHours,
            duration: 2.6,
            onUpdate: () => {
              if (hoursRef.current) hoursRef.current.textContent = fmtInt(counter.v)
            },
          },
          '+=0.2'
        )
        .fromTo(
          '.safety__mark',
          { opacity: 0 },
          { opacity: 1, duration: 2.6, stagger: { each: 0.012 } },
          '<'
        )
        .fromTo('.safety__meetings', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.4')
        .fromTo('.safety__kicker', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.4')
        .to({}, { duration: 0.6 })
    },
    { end: '+=450%' }
  )

  return (
    <section ref={rootRef} className="safety" aria-labelledby="safety-title">
      <div className="safety__inner container">
        <header className="safety__head">
          <p className="annotation annotation--accent">05 · Safety</p>
          <h2 id="safety-title" className="safety__title">
            <span className="big-number safety__hours">
              <span ref={hoursRef}>{fmtInt(FY2025.safetyTrainingHours)}</span>
            </span>
            <span className="safety__caption">
              ore di formazione su salute e sicurezza
            </span>
          </h2>
        </header>

        <div
          className="safety__marks"
          role="img"
          aria-label="815.000 ore di formazione rappresentate come 163 segni di conteggio: ogni segno vale 5.000 ore."
        >
          <svg viewBox="0 0 1400 460" preserveAspectRatio="xMidYMin meet" aria-hidden="true">
            {MARKS.map((m) => (
              <path key={m.i} className="safety__mark" d={m.d} />
            ))}
          </svg>
          <p className="annotation">un segno = 5.000 ore</p>
        </div>

        <p className="safety__meetings">
          E ancora: <strong>~{fmtInt(FY2025.safetyMeetings)}</strong> safety
          meeting nei cantieri di tutto il mondo. Un gesto ripetuto, ogni
          giorno, prima di ogni turno.
        </p>

        <p className="safety__kicker kicker">
          Costruire di più significa <em>costruire responsabilmente.</em>
        </p>
      </div>
    </section>
  )
}

export default Safety
