import { useRef } from 'react'
import { prepStroke } from '../../lib/drawStroke'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import { PEDE } from '../../data/pedemontana'
import './SottoSuperficie.css'

/**
 * 05 — Sotto la superficie. La scena chiave: il profilo longitudinale.
 * La linea del territorio resta continua in alto; la strada scende
 * in trincea e in galleria. Tema night: siamo sottoterra.
 *
 * Geometria (viewBox 0 0 1280 405) ripresa 1:1 dal frame Figma di
 * riferimento: superficie, tracciato e area scavata (riempita da un
 * pattern tratteggiato) sono gli stessi tre elementi separati di prima,
 * solo con il profilo esatto del Figma al posto di quello disegnato a mano.
 */
const SURFACE_D =
  'M -0.5 74.67 L 191.5 70.4 L 426.17 78.93 L 682.17 72.53 L 938.17 80 L 1172.83 73.6 L 1279.5 76.8'
// Profilo della strada: superficie → trincea → galleria → risalita
const ROUTE_D =
  'M 13 75 L 154.37 90.64 C 247.4 94.91 268.07 205.96 350.76 214.5 L 536.81 220.91 C 619.5 225.18 640.17 334.09 722.86 338.36 L 929.59 340.5 C 1022.61 338.36 1043.28 184.6 1125.97 141.89 L 1236 77.5'
// Area scavata: stessa curva del tracciato, richiusa sulla superficie
const FILL_D =
  'M154.37 90.39 L13 74.75 L1236 77.25 L1125.97 141.64 C1043.28 184.35 1022.61 338.11 929.59 340.25 L722.86 338.11 C640.17 333.84 619.5 224.93 536.81 220.66 L350.76 214.25 C268.07 205.71 247.4 94.66 154.37 90.39 Z'

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
        .set('.sottosup__fill', { opacity: 0 }, 0)
        .to('.sottosup__surface', { strokeDashoffset: 0, duration: 1 })
        // la strada scende: l'area scavata si rivela insieme al tracciato
        .to('.sottosup__route', { strokeDashoffset: 0, duration: 2.2 }, '+=0.2')
        .to('.sottosup__fill', { opacity: 1, duration: 1.8 }, '<')
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
            Un'arteria vitale
            <br />
            che scorre sotterranea.
          </h2>
        </header>

        <div
          className="sottosup__viz"
          role="img"
          aria-label="Profilo longitudinale delle tratte B2 e C: la linea del territorio resta continua in superficie, mentre la strada scende in trincea e in galleria per l'85% del tracciato."
        >
          <svg viewBox="0 0 1280 405" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              {/* Diagonale "/" ripresa 1:1 dal Figma: una linea per tile,
                  duplicata su tre traslazioni per restare continua al
                  bordo (stessa tecnica dell'export originale). */}
              <pattern id="sottosup-hatch" patternUnits="userSpaceOnUse" width="14" height="14">
                <rect width="14" height="14" className="sottosup__hatch-bg" />
                <path
                  d="M0 14 L14 0 M-3.5 3.5 L3.5 -3.5 M10.5 17.5 L17.5 10.5"
                  className="sottosup__hatch-line"
                />
              </pattern>
            </defs>
            <path className="sottosup__fill" d={FILL_D} />
            {/* il tracciato si disegna prima: la superficie deve restare
                sempre sopra, anche dove le due linee si toccano ai bordi */}
            <path className="sottosup__route" d={ROUTE_D} />
            <path className="sottosup__surface" d={SURFACE_D} />
            <text className="sottosup__zone" x="440" y="270">trincea</text>
            <text className="sottosup__zone" x="820" y="380">galleria</text>
            <text className="sottosup__zone sottosup__zone--surface" x="60" y="50">
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
