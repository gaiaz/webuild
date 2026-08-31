import { useLayoutEffect, useRef } from 'react'
import { gsap, REDUCED_MOTION } from '../../lib/gsap'
import { useReveal } from '../../lib/useReveal'
import './Beneficio.css'

/**
 * 06 — Il beneficio. Registro editoriale, non pinnato:
 * i due livelli sovrapposti — sopra la vita quotidiana, sotto l'autostrada.
 * Sotto la strada scorre il traffico locale (alberi, edifici, auto che
 * viaggiano lente); sotto terra il traffico veloce dell'autostrada in
 * galleria — due velocità diverse a rendere tangibile "vita quotidiana"
 * sopra e infrastruttura sotto.
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
const RINGS = Array.from({ length: 13 }, (_, i) => 158 + i * 68)

const Beneficio = () => {
  const rootRef = useRef(null)
  useReveal(rootRef)

  // Traffico continuo, indipendente dallo scroll: la scena non è pinnata,
  // quindi due loop separati (locale in superficie, veloce in galleria)
  // restano semplicemente "vivi" mentre la si legge.
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

  return (
    <section ref={rootRef} className="beneficio" aria-labelledby="beneficio-title">
      <div className="beneficio__inner container">
        <header className="beneficio__head">
          <p className="annotation annotation--accent" data-reveal>
            06 / 17 — Il beneficio
          </p>
          <h2 id="beneficio-title" className="beneficio__title display" data-reveal>
            Un'infrastruttura che tutela spazi,
            <br />
            connessioni e vita quotidiana.
          </h2>
        </header>

        <div
          className="beneficio__plate"
          role="img"
          aria-label="Sezione a due livelli: in superficie edifici, alberi e traffico locale continuano indisturbati; sotto, l'autostrada in galleria scorre veloce."
          data-reveal
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
            <rect x="0" y="150" width="1200" height="270" fill="url(#beneficio-earth)" />

            {/* sotto: il tubo dell'autostrada, coi suoi anelli, e il traffico veloce */}
            <rect className="beneficio__tunnel" x="120" y="250" width="960" height="110" rx="14" />
            {RINGS.map((x) => (
              <line key={x} className="beneficio__ring" x1={x} y1="252" x2={x} y2="358" />
            ))}
            <line className="beneficio__lane" x1="160" y1="305" x2="1040" y2="305" />
            <g className="beneficio__tunnel-car">
              <rect x="-18" y="292" width="36" height="13" rx="3.5" />
              <circle cx="-9" cy="305" r="4" />
              <circle cx="9" cy="305" r="4" />
            </g>

            <text className="beneficio__lbl" x="60" y="128">superficie</text>
            <text className="beneficio__lbl beneficio__lbl--under" x="60" y="398">
              autostrada in galleria
            </text>
          </svg>
        </div>

        <p className="beneficio__body" data-reveal>
          L'interramento riduce l'impatto visivo e acustico e preserva la
          continuità urbana dei luoghi attraversati.
        </p>
      </div>
    </section>
  )
}

export default Beneficio
