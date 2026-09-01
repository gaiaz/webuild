import { useRef } from 'react'
import { prepStroke } from '../../lib/drawStroke'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import './Impatto.css'

/**
 * 16 — Impatto. La camera torna in superficie: registro editoriale,
 * tre affermazioni che si compongono in sequenza e il territorio che
 * torna connesso attraverso la linea che si disegna.
 */
const CLAIMS = ['Meno distanze.', 'Più accessibilità.', 'Più possibilità per il territorio.']
const NODES_X = [20, 200, 400, 620, 880]
const NODES_Y = [70, 62, 74, 60, 76]

const Impatto = () => {
  const rootRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl, root }) => {
      tl.set('.impatto__claim', { opacity: 0, y: 20 }, 0)
        .set('.impatto__net-node', { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, 0)
      prepStroke(tl, '.impatto__net-line', root)
      tl.to('.impatto__claim', { opacity: 1, y: 0, duration: 0.5, stagger: 0.3 })
        .to('.impatto__net-line', { strokeDashoffset: 0, duration: 1.2 }, '+=0.2')
        .to('.impatto__net-node', { opacity: 1, scale: 1, duration: 0.4, stagger: 0.1 }, '-=0.8')
        .fromTo('.impatto__body', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.2')
        .to({}, { duration: 0.5 })
    },
    { end: '+=380%' }
  )

  return (
    <section ref={rootRef} className="impatto" aria-labelledby="impatto-title">
      <div className="impatto__inner container">
        <p className="annotation annotation--accent">16 / 17 — Impatto</p>
        <h2 id="impatto-title" className="impatto__title display">
          {CLAIMS.map((c) => (
            <span key={c} className="impatto__claim">
              {c}
            </span>
          ))}
        </h2>
        <svg
          className="impatto__net"
          viewBox="0 0 900 120"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <path
            className="impatto__net-line"
            d="M 20 70 L 200 62 L 400 74 L 620 60 L 880 76"
          />
          {NODES_X.map((x, i) => (
            <circle key={x} className="impatto__net-node" cx={x} cy={NODES_Y[i]} r="6" />
          ))}
        </svg>
        <p className="impatto__body">
          Una nuova mobilità trasversale per collegare persone, servizi, imprese
          e mercati.
        </p>
      </div>
    </section>
  )
}

export default Impatto
