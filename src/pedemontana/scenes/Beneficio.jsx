import { useRef } from 'react'
import { useReveal } from '../../lib/useReveal'
import './Beneficio.css'

/**
 * 06 — Il beneficio. Registro editoriale, non pinnato:
 * i due livelli sovrapposti — sopra la vita quotidiana, sotto l'autostrada.
 */
const TREES = [140, 320, 520, 700, 900, 1060]

const Beneficio = () => {
  const rootRef = useRef(null)
  useReveal(rootRef)

  return (
    <section ref={rootRef} className="beneficio" aria-labelledby="beneficio-title">
      <div className="beneficio__inner container">
        <header className="beneficio__head">
          <p className="annotation annotation--accent" data-reveal>
            06 / 17 — Il beneficio
          </p>
          <h2 id="beneficio-title" className="beneficio__title display" data-reveal>
            Sotto, una nuova autostrada.
            <br />
            Sopra, spazi, connessioni e vita quotidiana.
          </h2>
        </header>

        <div
          className="beneficio__plate"
          role="img"
          aria-label="Sezione a due livelli: in superficie strade locali, verde e spazi pubblici; sotto, l'autostrada in galleria."
          data-reveal
        >
          <svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {/* sopra: verde e strade locali */}
            {TREES.map((x) => (
              <g key={x} className="beneficio__tree">
                <line x1={x} y1="150" x2={x} y2="118" />
                <circle cx={x} cy="102" r="20" />
              </g>
            ))}
            <line className="beneficio__street" x1="40" y1="150" x2="1160" y2="150" />
            <line className="beneficio__street-dash" x1="60" y1="142" x2="1140" y2="142" />
            {/* sotto: il tubo dell'autostrada */}
            <rect className="beneficio__tunnel" x="120" y="250" width="960" height="110" rx="14" />
            <line className="beneficio__lane" x1="160" y1="305" x2="1040" y2="305" />
            <text className="beneficio__lbl" x="60" y="196">superficie</text>
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
