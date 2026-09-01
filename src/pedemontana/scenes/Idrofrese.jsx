import { useRef } from 'react'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import { PEDE } from '../../data/pedemontana'
import './Idrofrese.css'

/**
 * 08 — Idrofrese. Tavola d'ingegneria su foglio bianco: la fresa a
 * doppia ruota scende nel Ceppo della Brianza fino a ~25 m, il
 * pannello scavato lascia riemergere il rosa della pagina sotto il
 * foglio, con scala di profondità da disegno geotecnico.
 */
const SURFACE_Y = 190
const BOOM_Y = 50
const RIG_X = 460
const MAST_X = 380
const PX_PER_M = 13 // 25 m ≈ 325 px
const LATTICE_Y = [75, 100, 125]
const WHEEL_SPOKES = [0, 60, 120, 180, 240, 300].map((deg) => (deg * Math.PI) / 180)

const Wheel = ({ cx, cy }) => (
  <g className="idrofrese__wheel">
    <circle cx={cx} cy={cy} r="12" />
    {WHEEL_SPOKES.map((a, i) => (
      <line
        key={i}
        x1={cx + Math.cos(a) * 5}
        y1={cy + Math.sin(a) * 5}
        x2={cx + Math.cos(a) * 11}
        y2={cy + Math.sin(a) * 11}
      />
    ))}
  </g>
)

const Idrofrese = () => {
  const rootRef = useRef(null)
  const depthRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      const counter = { v: 0 }
      tl.set('.idrofrese__cut, .idrofrese__kelly', { scaleY: 0, transformOrigin: '50% 0%' }, 0)
        .fromTo('.idrofrese__rig', { opacity: 0 }, { opacity: 1, duration: 0.7 })
        .fromTo('.idrofrese__ceppo', { opacity: 0 }, { opacity: 1, duration: 0.7 }, '-=0.3')
        .to('.idrofrese__cutter', { y: PEDE.profonditaDiaframmi * PX_PER_M, duration: 2.6 }, '+=0.2')
        .to('.idrofrese__cut, .idrofrese__kelly', { scaleY: 1, duration: 2.6 }, '<')
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
            aria-label="Sezione geotecnica: l'idrofresa a doppia ruota scava i diaframmi nel Ceppo della Brianza fino a circa 25 metri di profondità."
          >
            <svg viewBox="0 0 760 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <pattern id="idrofrese-ceppo" patternUnits="userSpaceOnUse" width="14" height="14">
                  <rect width="14" height="14" className="idrofrese__ceppo-bg" />
                  <path
                    d="M0 14 L14 0 M-3.5 3.5 L3.5 -3.5 M10.5 17.5 L17.5 10.5"
                    className="idrofrese__ceppo-line"
                  />
                </pattern>
              </defs>

              {/* strato Ceppo della Brianza */}
              <g className="idrofrese__ceppo">
                <rect x="40" y={SURFACE_Y} width="620" height="330" fill="url(#idrofrese-ceppo)" />
                <text className="idrofrese__ceppo-lbl" x="56" y={SURFACE_Y + 22}>
                  Ceppo della Brianza
                </text>
              </g>

              {/* superficie */}
              <line className="idrofrese__surface" x1="40" y1={SURFACE_Y} x2="660" y2={SURFACE_Y} />

              {/* gru cingolata in superficie: cingoli, cabina, torre a
                  traliccio, contrappeso e braccio con carrucola */}
              <g className="idrofrese__rig">
                <rect
                  className="idrofrese__rig-solid"
                  x={MAST_X - 24}
                  y={SURFACE_Y - 12}
                  width="56"
                  height="12"
                  rx="2"
                />
                <circle className="idrofrese__rig-solid" cx={MAST_X - 12} cy={SURFACE_Y} r="6" />
                <circle className="idrofrese__rig-solid" cx={MAST_X + 20} cy={SURFACE_Y} r="6" />
                <rect
                  className="idrofrese__rig-solid"
                  x={MAST_X - 14}
                  y={SURFACE_Y - 30}
                  width="22"
                  height="18"
                />
                <rect
                  className="idrofrese__rig-solid"
                  x={MAST_X - 4}
                  y={BOOM_Y}
                  width="8"
                  height={SURFACE_Y - 30 - BOOM_Y}
                />
                {LATTICE_Y.map((y) => (
                  <line
                    key={y}
                    className="idrofrese__rig-lattice"
                    x1={MAST_X - 4}
                    y1={y}
                    x2={MAST_X + 4}
                    y2={y}
                  />
                ))}
                <rect
                  className="idrofrese__rig-solid"
                  x={MAST_X - 40}
                  y={BOOM_Y - 6}
                  width="28"
                  height="14"
                />
                <rect
                  className="idrofrese__rig-solid"
                  x={MAST_X}
                  y={BOOM_Y - 3}
                  width={RIG_X - MAST_X + 4}
                  height="6"
                />
                <line
                  className="idrofrese__rig-strut"
                  x1={RIG_X - 4}
                  y1={BOOM_Y + 6}
                  x2={MAST_X + 8}
                  y2={BOOM_Y + 30}
                />
                <circle className="idrofrese__rig-ring" cx={RIG_X} cy={BOOM_Y} r="5" />
              </g>

              {/* pannello scavato: il rosa della pagina riemerge sotto il foglio */}
              <rect
                className="idrofrese__cut"
                x={RIG_X - 24}
                y={SURFACE_Y}
                width="48"
                height={PEDE.profonditaDiaframmi * PX_PER_M}
              />

              {/* kelly bar: si allunga insieme allo scavo */}
              <rect
                className="idrofrese__kelly"
                x={RIG_X - 1}
                y={BOOM_Y}
                width="2"
                height={SURFACE_Y - BOOM_Y + PEDE.profonditaDiaframmi * PX_PER_M}
              />

              {/* fresa a doppia ruota, in discesa */}
              <g className="idrofrese__cutter">
                <rect className="idrofrese__cutter-body" x={RIG_X - 24} y={SURFACE_Y - 6} width="48" height="20" />
                <Wheel cx={RIG_X - 12} cy={SURFACE_Y + 26} />
                <Wheel cx={RIG_X + 12} cy={SURFACE_Y + 26} />
              </g>

              {/* scala di profondità */}
              {[0, 5, 10, 15, 20, 25].map((m) => (
                <g key={m} className="idrofrese__tick">
                  <line
                    x1="600"
                    y1={SURFACE_Y + m * PX_PER_M}
                    x2="616"
                    y2={SURFACE_Y + m * PX_PER_M}
                  />
                  <text x="628" y={SURFACE_Y + m * PX_PER_M + 6}>−{m} m</text>
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
