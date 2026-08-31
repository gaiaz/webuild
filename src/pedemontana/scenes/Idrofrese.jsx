import { useRef } from 'react'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import { PEDE } from '../../data/pedemontana'
import './Idrofrese.css'

/**
 * 08 — Idrofrese. La macchina in scala seziona il terreno:
 * la fresa scende nel Ceppo della Brianza fino a ~25 m,
 * con scala di profondità da disegno geotecnico.
 */
const SURFACE_Y = 150
const PX_PER_M = 13 // 25 m ≈ 325 px

const Idrofrese = () => {
  const rootRef = useRef(null)
  const depthRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      const counter = { v: 0 }
      tl.set('.idrofrese__cut', { scaleY: 0, transformOrigin: '50% 0%' }, 0)
        .fromTo('.idrofrese__rig', { opacity: 0 }, { opacity: 1, duration: 0.7 })
        .fromTo('.idrofrese__ceppo', { opacity: 0 }, { opacity: 1, duration: 0.7 }, '-=0.3')
        .to('.idrofrese__cutter', { y: PEDE.profonditaDiaframmi * PX_PER_M, duration: 2.6 }, '+=0.2')
        .to('.idrofrese__cut', { scaleY: 1, duration: 2.6 }, '<')
        .to(
          counter,
          {
            v: PEDE.profonditaDiaframmi,
            duration: 2.6,
            onUpdate: () => {
              if (depthRef.current) {
                depthRef.current.textContent = `−${Math.round(counter.v)}`
              }
            },
          },
          '<'
        )
        .fromTo('.idrofrese__body', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.5 })
    },
    { end: '+=440%' }
  )

  return (
    <section ref={rootRef} className="idrofrese" aria-labelledby="idrofrese-title">
      <div className="idrofrese__inner container">
        <header className="idrofrese__head">
          <p className="annotation annotation--accent">08 / 17 — Idrofrese</p>
          <h2 id="idrofrese-title" className="idrofrese__title display">
            Un'ingegneria profondamente nuova.
          </h2>
        </header>

        <div className="idrofrese__layout">
          <div
            className="idrofrese__viz"
            role="img"
            aria-label="Sezione geotecnica: l'idrofresa scava i diaframmi nel Ceppo della Brianza fino a circa 25 metri di profondità."
          >
            <svg viewBox="0 0 760 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              {/* superficie */}
              <line className="idrofrese__surface" x1="40" y1={SURFACE_Y} x2="600" y2={SURFACE_Y} />
              {/* macchina in superficie */}
              <g className="idrofrese__rig">
                <line x1="330" y1={SURFACE_Y} x2="330" y2="34" />
                <line x1="330" y1="34" x2="392" y2="34" />
                <line x1="392" y1="34" x2="378" y2={SURFACE_Y - 60} />
                <rect x="252" y={SURFACE_Y - 44} width="110" height="44" />
                <line x1="392" y1="34" x2="378" y2="96" />
              </g>
              {/* strato Ceppo della Brianza */}
              <g className="idrofrese__ceppo">
                {Array.from({ length: 9 }, (_, r) =>
                  Array.from({ length: 7 }, (_, c) => (
                    <path
                      key={`${r}-${c}`}
                      d={`M ${60 + c * 78 + (r % 2) * 30} ${236 + r * 30} l 20 -12`}
                    />
                  ))
                )}
                <text className="idrofrese__ceppo-lbl" x="60" y="222">
                  Ceppo della Brianza
                </text>
              </g>
              {/* pannello scavato */}
              <rect
                className="idrofrese__cut"
                x="362"
                y={SURFACE_Y}
                width="32"
                height={PEDE.profonditaDiaframmi * PX_PER_M}
              />
              {/* la fresa che scende */}
              <g className="idrofrese__cutter">
                <line x1="378" y1="96" x2="378" y2={SURFACE_Y - 14} />
                <rect x="364" y={SURFACE_Y - 14} width="28" height="30" />
                <circle cx="371" cy={SURFACE_Y + 24} r="7" />
                <circle cx="385" cy={SURFACE_Y + 24} r="7" />
              </g>
              {/* scala di profondità */}
              {[0, 5, 10, 15, 20, 25].map((m) => (
                <g key={m} className="idrofrese__tick">
                  <line
                    x1="640"
                    y1={SURFACE_Y + m * PX_PER_M}
                    x2="656"
                    y2={SURFACE_Y + m * PX_PER_M}
                  />
                  <text x="668" y={SURFACE_Y + m * PX_PER_M + 6}>−{m} m</text>
                </g>
              ))}
            </svg>
          </div>

          <div className="idrofrese__depth">
            <p className="big-number idrofrese__depth-num">
              <span ref={depthRef}>−{PEDE.profonditaDiaframmi}</span>
              <span className="idrofrese__depth-unit"> m</span>
            </p>
            <p className="annotation">profondità dei diaframmi</p>
          </div>
        </div>

        <p className="idrofrese__body">
          Le idrofrese lavorano nel Ceppo della Brianza con precisione ed
          efficienza, realizzando i diaframmi delle gallerie fino a circa 25
          metri di profondità.
        </p>
      </div>
    </section>
  )
}

export default Idrofrese
