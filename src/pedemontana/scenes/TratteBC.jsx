import { useRef } from 'react'
import { prepStroke } from '../../lib/drawStroke'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import { PEDE } from '../../data/pedemontana'
import './TratteBC.css'

/**
 * 04 — B2 e C. Zoom sulle tratte affidate al consorzio Webuild–Pizzarotti:
 * il resto dell'asse sfuma in filigrana, i 26,2 km si misurano con lo scroll.
 */
const TratteBC = () => {
  const rootRef = useRef(null)
  const kmRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl, root }) => {
      const counter = { v: 0 }
      prepStroke(tl, '.trattebc__seg', root)
        prepStroke(tl, '.trattebc__bracket', root)
        .fromTo('.trattebc__ghost', { opacity: 0 }, { opacity: 1, duration: 0.6 })
        .to('.trattebc__seg', { strokeDashoffset: 0, duration: 1.4 }, '+=0.2')
        .to(
          counter,
          {
            v: PEDE.kmBC,
            duration: 1.4,
            onUpdate: () => {
              if (kmRef.current) {
                kmRef.current.textContent = counter.v.toFixed(1).replace('.', ',')
              }
            },
          },
          '<'
        )
        .fromTo('.trattebc__ends', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.4')
        .to('.trattebc__bracket', { strokeDashoffset: 0, duration: 0.8 }, '+=0.2')
        .fromTo('.trattebc__consorzio', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .fromTo('.trattebc__body', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.5 })
    },
    { end: '+=380%' }
  )

  return (
    <section ref={rootRef} className="trattebc" aria-labelledby="trattebc-title">
      <div className="trattebc__inner container">
        <header className="trattebc__head">
          <p className="annotation annotation--accent">04 / 17 — B2 e C</p>
          <h2 id="trattebc-title" className="trattebc__title">
            <span className="big-number trattebc__figure">
              <span ref={kmRef}>26,2</span>
              <span className="trattebc__unit"> chilometri.</span>
            </span>
            <span className="trattebc__caption display">
              Una sfida ingegneristica che attraversa il territorio.
            </span>
          </h2>
        </header>

        <div
          className="trattebc__viz"
          role="img"
          aria-label="Le tratte B2 e C, da Lentate sul Seveso a Usmate Velate: 26,2 chilometri affidati al consorzio Webuild–Pizzarotti."
        >
          <svg viewBox="0 0 1200 380" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {/* asse completo in filigrana */}
            <path
              className="trattebc__ghost"
              d="M 30 190 L 240 205 L 380 215 L 940 200 L 1170 245"
            />
            {/* B2 + C in scala ravvicinata */}
            <path className="trattebc__seg" d="M 180 210 L 640 228 L 1020 205" />
            <g className="trattebc__ends">
              <circle cx="180" cy="210" r="8" className="trattebc__end-ring" />
              <circle cx="1020" cy="205" r="8" className="trattebc__end-ring" />
              <text className="trattebc__end-lbl" x="180" y="168" textAnchor="middle">
                Lentate sul Seveso
              </text>
              <text className="trattebc__end-lbl" x="1020" y="163" textAnchor="middle">
                Usmate Velate
              </text>
            </g>
            {/* quota da disegno esecutivo */}
            <path
              className="trattebc__bracket"
              d="M 180 300 v 18 H 1020 v -18"
            />
            <text className="trattebc__quota" x="600" y="352" textAnchor="middle">
              26,2 km — tratte B2 e C
            </text>
          </svg>
          <p className="trattebc__consorzio annotation">
            Consorzio Webuild — Pizzarotti
          </p>
        </div>

        <p className="trattebc__body">
          Le tratte B2 e C collegano Lentate sul Seveso a Usmate Velate, in uno
          dei contesti più urbanizzati e produttivi d'Europa.
        </p>
      </div>
    </section>
  )
}

export default TratteBC
