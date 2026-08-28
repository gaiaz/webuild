import { useRef } from 'react'
import { useReveal } from '../../lib/useReveal'
import './Impatto.css'

/**
 * 16 — Impatto. La camera torna in superficie: registro editoriale,
 * tre affermazioni staccate e il territorio di nuovo connesso.
 */
const CLAIMS = ['Meno distanze.', 'Più accessibilità.', 'Più possibilità per il territorio.']

const Impatto = () => {
  const rootRef = useRef(null)
  useReveal(rootRef)

  return (
    <section ref={rootRef} className="impatto" aria-labelledby="impatto-title">
      <div className="impatto__inner container">
        <p className="annotation annotation--accent" data-reveal>
          16 / 17 — Impatto
        </p>
        <h2 id="impatto-title" className="impatto__title display">
          {CLAIMS.map((c) => (
            <span key={c} className="impatto__claim" data-reveal>
              {c}
            </span>
          ))}
        </h2>
        <svg
          className="impatto__net"
          viewBox="0 0 900 120"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          data-reveal
        >
          <path
            className="impatto__net-line"
            d="M 20 70 L 200 62 L 400 74 L 620 60 L 880 76"
          />
          {[20, 200, 400, 620, 880].map((x, i) => (
            <circle key={x} className="impatto__net-node" cx={x} cy={[70, 62, 74, 60, 76][i]} r="6" />
          ))}
        </svg>
        <p className="impatto__body" data-reveal>
          Una nuova mobilità trasversale per collegare persone, servizi, imprese
          e mercati.
        </p>
      </div>
    </section>
  )
}

export default Impatto
