import { useRef } from 'react'
import { prepStroke } from '../../lib/drawStroke'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import './MetodoMilano.css'

/**
 * 07 — Metodo Milano. Sequenza per strati, come da brief:
 * 1 pareti · 2 copertura · 3 ripristino superficie · 4 scavo interno.
 */
const STEPS = [
  { n: '01', label: 'Pareti', note: 'i diaframmi laterali' },
  { n: '02', label: 'Copertura', note: 'la soletta superiore' },
  { n: '03', label: 'Superficie', note: 'la città torna in quota' },
  { n: '04', label: 'Scavo', note: 'la strada nasce sotto' },
]

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
        .fromTo('.metodo__surface-deco', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.4')
      on(2)
      tl
        // 4 — scavo interno
        .to('.metodo__dig', { scaleY: 1, duration: 1.1 }, '+=0.3')
        .to('.metodo__road', { strokeDashoffset: 0, duration: 0.6 })
      on(3)
      tl
        .fromTo('.metodo__body', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.5 })
    },
    { end: '+=480%' }
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
              {/* terreno */}
              {Array.from({ length: 14 }, (_, i) => (
                <path
                  key={i}
                  className="metodo__hatch"
                  d={`M ${40 + i * 50} 190 l 26 -16`}
                />
              ))}
              {/* 1 — pareti (diaframmi) */}
              <rect className="metodo__wall" x="210" y="170" width="26" height="330" />
              <rect className="metodo__wall" x="524" y="170" width="26" height="330" />
              {/* 2 — copertura */}
              <rect className="metodo__slab" x="210" y="170" width="340" height="34" />
              {/* 3 — superficie ripristinata */}
              <path className="metodo__surface-line" d="M 40 160 H 720" />
              <g className="metodo__surface-deco">
                <line x1="300" y1="160" x2="300" y2="132" />
                <circle cx="300" cy="118" r="14" />
                <line x1="470" y1="160" x2="470" y2="132" />
                <circle cx="470" cy="118" r="14" />
              </g>
              {/* 4 — scavo interno */}
              <rect className="metodo__dig" x="236" y="204" width="288" height="266" />
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
