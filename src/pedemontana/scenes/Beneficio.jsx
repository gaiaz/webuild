import { useLayoutEffect, useRef } from 'react'
import { gsap, REDUCED_MOTION } from '../../lib/gsap'
import { prepStroke } from '../../lib/drawStroke'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import './Beneficio.css'

/**
 * 06 — Il beneficio. Scena pinnata: la città in superficie si costruisce
 * per prima (edifici, alberi, strada, traffico locale), poi il terreno si
 * apre sul tunnel sottostante (anelli, corsia, traffico veloce) — gli
 * stessi due livelli sovrapposti di prima, ora scanditi dallo scroll
 * invece che rivelati tutti insieme. Il traffico continuo (auto che
 * viaggiano) resta un loop indipendente, non scrubbato: comincia a
 * scorrere quando ciascun livello diventa visibile e non si ferma più.
 */
const TREES = [140, 320, 520, 700, 900, 1060]
const BUILDINGS = [
  { x: 30, w: 70, h: 86 },
  { x: 225, w: 54, h: 58 },
  { x: 425, w: 78, h: 108 },
  { x: 605, w: 58, h: 66 },
  { x: 775, w: 88, h: 128 },
  { x: 975, w: 62, h: 80 },
  { x: 1095, w: 58, h: 60 },
]

const Beneficio = () => {
  const rootRef = useRef(null)

  // Traffico continuo, indipendente dallo scroll: una volta rivelate (dalla
  // timeline scrubbata qui sotto) le auto continuano a scorrere da sole,
  // in loop, invece di restare ferme in scena.
  useLayoutEffect(() => {
    if (REDUCED_MOTION) return undefined
    const ctx = gsap.context(() => {
      gsap.set('.beneficio__car--a', { x: -60 })
      gsap.set('.beneficio__car--b', { x: 1260 })
      gsap.set('.beneficio__tunnel-car', { x: -50 })
      gsap.to('.beneficio__car--a', { x: 1260, duration: 9, repeat: -1, ease: 'none' })
      gsap.to('.beneficio__car--b', { x: -60, duration: 11, repeat: -1, ease: 'none' })
      gsap.to('.beneficio__tunnel-car', { x: 1050, duration: 3.4, repeat: -1, ease: 'none' })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  useSceneTimeline(
    rootRef,
    ({ tl, root }) => {
      prepStroke(tl, '.beneficio__street', root)
      tl.set('.beneficio__building', { opacity: 0 }, 0)
        .set('.beneficio__tree', { opacity: 0, y: 10 }, 0)
        .set('.beneficio__street-dash', { opacity: 0 }, 0)
        .set('.beneficio__car--a, .beneficio__car--b', { opacity: 0 }, 0)
        .set('.beneficio__lbl:not(.beneficio__lbl--under)', { opacity: 0 }, 0)
        .set('.beneficio__earth', { opacity: 0 }, 0)
        .set('.beneficio__tunnel', { scaleY: 0, transformOrigin: '50% 0%' }, 0)
        .set('.beneficio__lane', { opacity: 0 }, 0)
        .set('.beneficio__tunnel-car', { opacity: 0 }, 0)
        .set('.beneficio__lbl--under', { opacity: 0 }, 0)
        // 1 — la città in superficie: edifici, alberi, strada e traffico
        .to('.beneficio__building', { opacity: 0.7, duration: 0.4, stagger: 0.05 })
        .to('.beneficio__tree', { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '<0.15')
        .to('.beneficio__street', { strokeDashoffset: 0, duration: 0.8 }, '<')
        .to('.beneficio__street-dash', { opacity: 1, duration: 0.4 }, '<0.4')
        .to('.beneficio__car--a, .beneficio__car--b', { opacity: 1, duration: 0.3 }, '<')
        .to('.beneficio__lbl:not(.beneficio__lbl--under)', { opacity: 1, duration: 0.3 }, '<')
        // 2 — il terreno si apre sul tunnel sottostante
        .to('.beneficio__earth', { opacity: 1, duration: 0.6 }, '+=0.3')
        .to('.beneficio__tunnel', { scaleY: 1, duration: 0.9 }, '<0.2')
        .to('.beneficio__lane', { opacity: 1, duration: 0.5 }, '<0.3')
        .to('.beneficio__tunnel-car', { opacity: 1, duration: 0.3 }, '<')
        .to('.beneficio__lbl--under', { opacity: 1, duration: 0.3 }, '<')
        // 3 — il testo chiude la scena
        .fromTo('.beneficio__body', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.5 })
    },
    { end: '+=380%' }
  )

  return (
    <section ref={rootRef} className="beneficio" aria-labelledby="beneficio-title">
      <div className="beneficio__inner container">
        <header className="beneficio__head">
          <p className="annotation annotation--accent">
            06 / 17 — Il beneficio
          </p>
          <h2 id="beneficio-title" className="beneficio__title display">
            Un'infrastruttura che tutela spazi,
            <br />
            connessioni e vita quotidiana.
          </h2>
        </header>

        <div
          className="beneficio__plate"
          role="img"
          aria-label="Sezione a due livelli: in superficie edifici, alberi e traffico locale continuano indisturbati; sotto, l'autostrada in galleria scorre veloce."
        >
          <svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <pattern
                id="beneficio-earth"
                patternUnits="userSpaceOnUse"
                width="14"
                height="14"
              >
                <rect width="14" height="14" className="beneficio__earth-bg" />
                <path
                  d="M0 14 L14 0 M-3.5 3.5 L3.5 -3.5 M10.5 17.5 L17.5 10.5"
                  className="beneficio__earth-line"
                />
              </pattern>
            </defs>

            {/* sopra: skyline in filigrana, alberi e traffico locale */}
            {BUILDINGS.map((b) => (
              <rect
                key={b.x}
                className="beneficio__building"
                x={b.x}
                y={150 - b.h}
                width={b.w}
                height={b.h}
              />
            ))}
            {TREES.map((x) => (
              <g key={x} className="beneficio__tree">
                <line x1={x} y1="150" x2={x} y2="122" />
                <circle cx={x - 10} cy="108" r="15" />
                <circle cx={x + 10} cy="108" r="15" />
                <circle cx={x} cy="92" r="17" />
              </g>
            ))}
            <line className="beneficio__street" x1="40" y1="150" x2="1160" y2="150" />
            <line className="beneficio__street-dash" x1="60" y1="142" x2="1140" y2="142" />
            <g className="beneficio__car beneficio__car--a">
              <rect x="-22" y="138" width="44" height="15" rx="4" />
              <circle cx="-11" cy="153" r="5" />
              <circle cx="11" cy="153" r="5" />
            </g>
            <g className="beneficio__car beneficio__car--b">
              <rect x="-22" y="138" width="44" height="15" rx="4" />
              <circle cx="-11" cy="153" r="5" />
              <circle cx="11" cy="153" r="5" />
            </g>

            {/* il terreno fra i due livelli */}
            <rect className="beneficio__earth" x="0" y="150" width="1200" height="270" fill="url(#beneficio-earth)" />

            {/* sotto: il canale dell'autostrada, aperto ai due bordi — la
                strada prosegue prima e dopo la galleria, non finisce lì */}
            <g className="beneficio__tunnel">
              <rect className="beneficio__tunnel-fill" x="0" y="250" width="1200" height="110" />
              <line className="beneficio__tunnel-edge" x1="0" y1="250" x2="1200" y2="250" />
              <line className="beneficio__tunnel-edge" x1="0" y1="360" x2="1200" y2="360" />
            </g>
            <line className="beneficio__lane" x1="0" y1="305" x2="1200" y2="305" />
            <g className="beneficio__tunnel-car">
              <rect x="-18" y="292" width="36" height="13" rx="3.5" />
              <circle cx="-9" cy="305" r="4" />
              <circle cx="9" cy="305" r="4" />
            </g>

            <text className="beneficio__lbl" x="60" y="176">superficie</text>
            <text className="beneficio__lbl beneficio__lbl--under" x="60" y="398">
              autostrada in galleria
            </text>
          </svg>
        </div>

        <p className="beneficio__body">
          L'interramento riduce l'impatto visivo e acustico e preserva la
          continuità urbana dei luoghi attraversati.
        </p>
      </div>
    </section>
  )
}

export default Beneficio
