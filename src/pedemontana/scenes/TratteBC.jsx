import { useRef } from 'react'
import { prepStroke } from '../../lib/drawStroke'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import { PEDE } from '../../data/pedemontana'
import './TratteBC.css'

/**
 * 04 — B2 e C. Il nastro stradale che si disegna da Lentate sul Seveso a
 * Usmate Velate, con la staffa di quota sotto. Geometria e coordinate
 * (viewBox 0 0 1280 406) riprese 1:1 dal frame Figma di riferimento.
 *
 * Il reveal di nastro+tracciato usa una maschera (clip-rect che si allarga),
 * non strokeDashoffset: il tracciato ha un stroke-dasharray decorativo
 * (il tratteggio rosso) che confliggerebbe con il dasharray di disegno
 * progressivo — stesso problema, stessa soluzione, già visto in Hero.
 */
const TratteBC = () => {
  const rootRef = useRef(null)
  const kmRef = useRef(null)
  const clipRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl, root }) => {
      const counter = { v: 0 }
      prepStroke(tl, '.trattebc__bracket', root)
        .set(clipRef.current, { attr: { width: 0 } }, 0)
        .to(clipRef.current, { attr: { width: 1280 }, duration: 1.4 })
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
        .fromTo('.trattebc__quota', { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.2')
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
              <span className="trattebc__unit"> km</span>
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
          <svg viewBox="0 0 1280 406" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <clipPath id="trattebc-road-clip">
                <rect ref={clipRef} x="0" y="0" width="1280" height="406" />
              </clipPath>
            </defs>
            <g clipPath="url(#trattebc-road-clip)">
              {/* nastro stradale */}
              <path
                className="trattebc__ribbon"
                d="M 32.01 202.66 L 256.0 218.66 L 405.34 229.33 L 1002.66 213.33 L 1248.0 261.33"
              />
              {/* tracciato in evidenza sul nastro */}
              <path className="trattebc__route" d="M 192.0 224.0 L 682.67 243.2 L 1088.0 218.66" />
            </g>

            <g className="trattebc__ends">
              <circle cx="192" cy="224" r="8.5" className="trattebc__end-ring" />
              <circle cx="1088" cy="218.66" r="8.5" className="trattebc__end-ring" />
              <text className="trattebc__end-lbl" x="192" y="181" textAnchor="middle">
                Lentate sul Seveso
              </text>
              <text className="trattebc__end-lbl" x="1088" y="176" textAnchor="middle">
                Usmate Velate
              </text>
            </g>

            {/* staffa di quota */}
            <path className="trattebc__bracket" d="M 192.01 319.99 V 339.19 H 1088 V 319.99" />
            <text className="trattebc__quota" x="640" y="368" textAnchor="middle">
              <tspan className="trattebc__quota-num">26,2 km</tspan> — tratte B2 e C
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
