import { useRef } from 'react'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import './Funzione.css'

/**
 * 03 — La funzione. Due stati a confronto sulla stessa geometria:
 *   oggi   · tutte le origini scendono fino a un unico nodo, che si satura
 *   domani · le stesse origini incontrano un asse condiviso, subito sopra
 *
 * Le origini restano ferme: cambia solo dove arrivano. È il confronto che
 * racconta la redistribuzione, non due disegni diversi.
 */
const ORIGIN_Y = 96
const AXIS_Y = 214
const HUB = { x: 600, y: 470 }

const ORIGINS = [110, 273, 436, 600, 763, 926, 1090].map((x, i) => ({ i, x }))

const Funzione = () => {
  const rootRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      tl.set('.funzione__origin, .funzione__hub, .funzione__lbl, .funzione__ring', { opacity: 0 }, 0)
        .set('.funzione__link, .funzione__axis, .funzione__drop, .funzione__joint', { opacity: 0 }, 0)

        // ─── OGGI: tutto converge ───
        .to('.funzione__origin', { opacity: 1, duration: 0.4, stagger: 0.07 })
        .fromTo(
          '.funzione__link',
          { opacity: 0, scaleY: 0, transformOrigin: `50% ${ORIGIN_Y}px` },
          { opacity: 1, scaleY: 1, duration: 1.1, stagger: 0.09 },
          '-=0.2'
        )
        .to('.funzione__hub', { opacity: 1, duration: 0.4 }, '-=0.5')
        // il nodo si satura
        .fromTo(
          '.funzione__ring',
          { opacity: 0, scale: 0.4, transformOrigin: `${HUB.x}px ${HUB.y}px` },
          { opacity: 0.7, scale: 1, duration: 0.9, stagger: 0.16 },
          '+=0.1'
        )
        .to('.funzione__link', { strokeWidth: 3, duration: 0.6 }, '<')
        .to('.funzione__lbl--oggi', { opacity: 1, duration: 0.4 }, '<0.3')

        // ─── DOMANI: l'asse redistribuisce ───
        .to('.funzione__ring', { opacity: 0, duration: 0.5 }, '+=0.5')
        .to('.funzione__link', { opacity: 0.13, strokeWidth: 1.2, duration: 0.9 }, '<')
        .to('.funzione__hub', { opacity: 0.3, duration: 0.9 }, '<')
        .to('.funzione__lbl--oggi', { opacity: 0.3, duration: 0.9 }, '<')
        .fromTo(
          '.funzione__axis',
          { opacity: 1, scaleX: 0, transformOrigin: '0% 50%' },
          { scaleX: 1, duration: 1.3 },
          '<0.3'
        )
        // ogni origine si innesta sull'asse: le connessioni si moltiplicano
        .fromTo(
          '.funzione__drop',
          { opacity: 1, scaleY: 0, transformOrigin: `50% ${ORIGIN_Y}px` },
          { scaleY: 1, duration: 0.5, stagger: 0.1 },
          '-=0.7'
        )
        .to('.funzione__joint', { opacity: 1, duration: 0.3, stagger: 0.1 }, '<0.35')
        .to('.funzione__lbl--domani', { opacity: 1, duration: 0.5 }, '<0.2')
        .fromTo('.funzione__body', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.6 })
    },
    { end: '+=480%' }
  )

  return (
    <section ref={rootRef} className="funzione" aria-labelledby="funzione-title">
      <div className="funzione__inner container">
        <header className="funzione__head">
          <p className="annotation annotation--accent">03 / 17 — La funzione</p>
          <h2 id="funzione-title" className="funzione__title display">
            Dove oggi i flussi si concentrano,
            <br />
            domani le connessioni si moltiplicano.
          </h2>
        </header>

        <div
          className="funzione__viz"
          role="img"
          aria-label="Oggi i flussi di sette poli scendono tutti fino a un unico nodo, quello milanese, che si satura. Domani gli stessi poli si innestano su un asse trasversale condiviso: da una sola connessione a sette."
        >
          <svg viewBox="0 0 1200 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {/* didascalia dello stato "domani", sopra le origini */}
            <text className="funzione__lbl funzione__lbl--domani" x="70" y="52">
              domani — sette innesti sull'asse
            </text>

            {/* oggi: dalle origini fino al nodo */}
            {ORIGINS.map((o) => (
              <line
                key={`k${o.i}`}
                className="funzione__link"
                x1={o.x}
                y1={ORIGIN_Y}
                x2={HUB.x}
                y2={HUB.y}
              />
            ))}

            {/* domani: l'asse condiviso e gli innesti */}
            <line className="funzione__axis" x1="70" y1={AXIS_Y} x2="1130" y2={AXIS_Y} />
            {ORIGINS.map((o) => (
              <line
                key={`d${o.i}`}
                className="funzione__drop"
                x1={o.x}
                y1={ORIGIN_Y}
                x2={o.x}
                y2={AXIS_Y}
              />
            ))}
            {ORIGINS.map((o) => (
              <circle key={`j${o.i}`} className="funzione__joint" cx={o.x} cy={AXIS_Y} r="6" />
            ))}

            {/* le origini restano ferme in entrambi gli stati */}
            {ORIGINS.map((o) => (
              <circle key={`o${o.i}`} className="funzione__origin" cx={o.x} cy={ORIGIN_Y} r="7" />
            ))}

            {/* il nodo che si satura */}
            {[34, 54, 74].map((r) => (
              <circle key={r} className="funzione__ring" cx={HUB.x} cy={HUB.y} r={r} />
            ))}
            <g className="funzione__hub">
              <circle cx={HUB.x} cy={HUB.y} r="13" className="funzione__hub-ring" />
              <circle cx={HUB.x} cy={HUB.y} r="5" className="funzione__hub-dot" />
            </g>
            <text className="funzione__lbl funzione__lbl--oggi" x={HUB.x} y="536" textAnchor="middle">
              oggi — un solo nodo, Milano
            </text>
          </svg>
        </div>

        <p className="funzione__body">
          Un'alternativa al nodo milanese per collegare città, imprese,
          distretti produttivi e grandi arterie.
        </p>
      </div>
    </section>
  )
}

export default Funzione
