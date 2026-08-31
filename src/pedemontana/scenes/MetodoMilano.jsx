import { useRef } from 'react'
import { prepStroke } from '../../lib/drawStroke'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import './MetodoMilano.css'

/**
 * 07 — Metodo Milano. Sequenza per strati, come da brief:
 * 1 pareti · 2 copertura · 3 ripristino superficie · 4 scavo interno.
 */
const WALL_X = [210, 524]

const STEPS = [
  { n: '01', label: 'Pareti', note: 'i diaframmi laterali' },
  { n: '02', label: 'Copertura', note: 'la soletta superiore' },
  { n: '03', label: 'Superficie', note: 'la città torna in quota' },
  { n: '04', label: 'Scavo', note: 'la strada nasce sotto' },
]

// Legge il valore risolto di un token colore, per non ripetere gli
// esadecimali della palette nelle animazioni GSAP (che non sanno
// interpolare una stringa var(...) di partenza, ma un colore risolto sì).
const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

const MetodoMilano = () => {
  const rootRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl, root }) => {
      const on = (i) =>
        tl.to(`.metodo__step:nth-child(${i + 1})`, { opacity: 1, x: 0, duration: 0.4 }, '<')
      tl.set('.metodo__wall', { scaleY: 0, transformOrigin: '50% 0%' }, 0)
        .set('.metodo__slab', { scaleX: 0, transformOrigin: '0% 50%' }, 0)
        prepStroke(tl, '.metodo__surface-line', root)
        .set('.metodo__dig', { scaleY: 0, transformOrigin: '50% 0%' }, 0)
        prepStroke(tl, '.metodo__road', root)
        .set('.metodo__step', { opacity: 0.25, x: -12 }, 0)
        // 1 — pareti
        .to('.metodo__wall', { scaleY: 1, duration: 1, stagger: 0.2 })
      on(0)
      tl
        // 2 — copertura
        .to('.metodo__slab', { scaleX: 1, duration: 0.9 }, '+=0.3')
      on(1)
      tl
        // 3 — ripristino superficie
        .to('.metodo__surface-line', { strokeDashoffset: 0, duration: 0.9 }, '+=0.3')
        .fromTo(
          '.metodo__surface-deco, .metodo__skyline',
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.4'
        )
      on(2)
      tl
        // 4 — scavo interno
        .to('.metodo__dig', { scaleY: 1, duration: 1.1 }, '+=0.3')
        .to('.metodo__road', { strokeDashoffset: 0, duration: 0.6 })
      on(3)
      tl
        .fromTo('.metodo__body', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.5 })
      // 5 — giorno e notte: il cantiere va avanti 24 ore su 24
      tl
        .to(root, { backgroundColor: cssVar('--color-bg-night'), duration: 1 }, '+=0.3')
        .to('.metodo__inner', { color: cssVar('--color-text-inverse'), duration: 1 }, '<')
        .to(
          '.metodo .annotation:not(.annotation--accent)',
          { color: cssVar('--color-text-night'), duration: 1 },
          '<'
        )
        .to('.metodo .annotation--accent', { color: cssVar('--color-accent-on-dark'), duration: 1 }, '<')
        .to(
          '.metodo__wall-body, .metodo__wall-cap, .metodo__slab-body',
          { fill: cssVar('--color-text-inverse'), duration: 1 },
          '<'
        )
        .to(
          '.metodo__wall-joint, .metodo__slab-hatch',
          { stroke: cssVar('--color-bg-night'), duration: 1 },
          '<'
        )
        .to('.metodo__earth-bg', { fill: cssVar('--color-bg-night-subtle'), duration: 1 }, '<')
        .to('.metodo__earth-line', { stroke: cssVar('--color-line-night'), duration: 1 }, '<')
        .to('.metodo__mountains', { fill: cssVar('--color-line-night'), duration: 1 }, '<')
        .to('.metodo__surface-line', { stroke: cssVar('--color-text-inverse'), duration: 1 }, '<')
        .to(
          '.metodo__surface-deco line, .metodo__surface-deco circle:not(.metodo__lamp-head):not(.metodo__lamp-ring)',
          { stroke: cssVar('--color-text-night'), duration: 1 },
          '<'
        )
        .to('.metodo__dig-body', { fill: cssVar('--color-bg-night-subtle'), duration: 1 }, '<')
        .to('.metodo__strut', { stroke: cssVar('--color-text-night'), duration: 1 }, '<')
        .to('.metodo__lamp-head', { fill: cssVar('--color-text-inverse'), duration: 0.6 }, '<0.4')
        .to('.metodo__lamp-ring--1', { opacity: 0.85, duration: 0.6 }, '<')
        .to('.metodo__lamp-ring--2', { opacity: 0.45, duration: 0.6 }, '<')
        .to('.metodo__lamp-ring--3', { opacity: 0.2, duration: 0.6 }, '<')
        .to({}, { duration: 0.5 })
    },
    { end: '+=600%' }
  )

  return (
    <section ref={rootRef} className="metodo" aria-labelledby="metodo-title">
      <div className="metodo__inner container">
        <header className="metodo__head">
          <p className="annotation annotation--accent">07 / 17 — Metodo Milano</p>
          <h2 id="metodo-title" className="metodo__title display">
            Prima si costruisce la copertura.
            <br />
            Poi si scava la strada.
          </h2>
        </header>

        <div className="metodo__layout">
          <ol className="metodo__steps">
            {STEPS.map((s) => (
              <li key={s.n} className="metodo__step">
                <span className="annotation annotation--accent">{s.n}</span>
                <span className="metodo__step-label">{s.label}</span>
                <span className="metodo__step-note annotation">{s.note}</span>
              </li>
            ))}
          </ol>

          <div
            className="metodo__viz"
            role="img"
            aria-label="Sezione del Metodo Milano in quattro fasi: prima i diaframmi laterali, poi la copertura, poi il ripristino della superficie, infine lo scavo interno sotto la città."
          >
            <svg viewBox="0 0 760 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <defs>
                <pattern id="metodo-earth" patternUnits="userSpaceOnUse" width="14" height="14">
                  <rect width="14" height="14" className="metodo__earth-bg" />
                  <path
                    d="M0 14 L14 0 M-3.5 3.5 L3.5 -3.5 M10.5 17.5 L17.5 10.5"
                    className="metodo__earth-line"
                  />
                </pattern>
              </defs>
              {/* terreno: lo stesso linguaggio di "Sotto la superficie" */}
              <rect x="20" y="160" width="720" height="380" fill="url(#metodo-earth)" />

              {/* 1 — pareti (diaframmi): testata, fusto e giunti di getto */}
              {WALL_X.map((x) => (
                <g key={x} className="metodo__wall">
                  <rect className="metodo__wall-body" x={x} y="170" width="26" height="330" />
                  <rect className="metodo__wall-cap" x={x - 6} y="164" width="38" height="12" />
                  {[1, 2, 3, 4].map((i) => (
                    <line
                      key={i}
                      className="metodo__wall-joint"
                      x1={x}
                      y1={170 + i * 62}
                      x2={x + 26}
                      y2={170 + i * 62}
                    />
                  ))}
                </g>
              ))}

              {/* 2 — copertura: soletta con armatura in vista */}
              <g className="metodo__slab">
                <rect className="metodo__slab-body" x="210" y="170" width="340" height="34" />
                {Array.from({ length: 9 }, (_, i) => (
                  <line
                    key={i}
                    className="metodo__slab-hatch"
                    x1={222 + i * 38}
                    y1="172"
                    x2={222 + i * 38 - 16}
                    y2="202"
                  />
                ))}
              </g>

              {/* 3 — superficie ripristinata: la Pedemontana è ai piedi
                  delle Alpi — profilo montano e un paio di villette in
                  filigrana, dietro alla città che torna in quota */}
              <g className="metodo__skyline">
                <path
                  className="metodo__mountains"
                  d="M 20 160 L 90 85 L 150 130 L 230 55 L 310 125 L 390 70 L 470 128 L 550 58 L 630 120 L 700 90 L 740 160 Z"
                />
                <g className="metodo__chalet" transform="translate(140,160)">
                  <rect className="metodo__chalet-body" x="-14" y="-26" width="28" height="26" />
                  <path className="metodo__chalet-roof" d="M -18 -26 L 0 -44 L 18 -26 Z" />
                </g>
                <g className="metodo__chalet" transform="translate(650,160)">
                  <rect className="metodo__chalet-body" x="-14" y="-26" width="28" height="26" />
                  <path className="metodo__chalet-roof" d="M -18 -26 L 0 -44 L 18 -26 Z" />
                </g>
              </g>
              {/* alberi, lampione, un'auto */}
              <path className="metodo__surface-line" d="M 40 160 H 720" />
              <g className="metodo__surface-deco">
                <line x1="300" y1="160" x2="300" y2="134" />
                <circle cx="291" cy="122" r="12" />
                <circle cx="309" cy="122" r="12" />
                <circle cx="300" cy="109" r="13" />
                <line x1="470" y1="160" x2="470" y2="134" />
                <circle cx="461" cy="122" r="12" />
                <circle cx="479" cy="122" r="12" />
                <circle cx="470" cy="109" r="13" />
                <line x1="392" y1="160" x2="392" y2="112" />
                <line x1="392" y1="112" x2="406" y2="112" />
                <circle className="metodo__lamp-ring metodo__lamp-ring--3" cx="406" cy="112" r="15" />
                <circle className="metodo__lamp-ring metodo__lamp-ring--2" cx="406" cy="112" r="10" />
                <circle className="metodo__lamp-ring metodo__lamp-ring--1" cx="406" cy="112" r="6" />
                <circle className="metodo__lamp-head" cx="406" cy="112" r="4" />
                <g className="metodo__deco-car" transform="translate(600,148)">
                  <rect x="-16" y="0" width="32" height="11" rx="3" />
                  <circle cx="-8" cy="11" r="3.5" />
                  <circle cx="8" cy="11" r="3.5" />
                </g>
              </g>

              {/* 4 — scavo interno: il vuoto e i puntoni provvisori */}
              <g className="metodo__dig">
                <rect className="metodo__dig-body" x="236" y="204" width="288" height="266" />
                <line className="metodo__strut" x1="236" y1="248" x2="524" y2="276" />
                <line className="metodo__strut" x1="236" y1="276" x2="524" y2="248" />
                <line className="metodo__strut" x1="236" y1="362" x2="524" y2="390" />
                <line className="metodo__strut" x1="236" y1="390" x2="524" y2="362" />
              </g>
              <path className="metodo__road" d="M 250 452 H 510" />
            </svg>
          </div>
        </div>

        <p className="metodo__body">
          Il Metodo Milano permette di lavorare sotto la città, riducendo tempi
          e interferenze in superficie.
        </p>
      </div>
    </section>
  )
}

export default MetodoMilano
