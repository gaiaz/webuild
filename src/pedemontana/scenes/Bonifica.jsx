import { useRef } from 'react'
import { useReveal } from '../../lib/useReveal'
import { PEDE } from '../../data/pedemontana'
import './Bonifica.css'

/**
 * 11 — Bonifica. Registro editoriale, sobrio: la timeline dal 1976 a oggi
 * e il processo per fasi nelle aree ex ICMESA. Nessuna spettacolarizzazione.
 */
const PHASES = [
  'Scavi controllati',
  'Campionamenti',
  'Monitoraggi continui',
  'Validazioni degli enti competenti',
]

const Bonifica = () => {
  const rootRef = useRef(null)
  useReveal(rootRef)

  return (
    <section ref={rootRef} className="bonifica" aria-labelledby="bonifica-title">
      <div className="bonifica__inner container">
        <header className="bonifica__head">
          <p className="annotation annotation--accent" data-reveal>
            11 / 17 — Bonifica
          </p>
          <h2 id="bonifica-title" className="bonifica__title display" data-reveal>
            Da una ferita del passato
            <br />
            può nascere una nuova cura del territorio.
          </h2>
        </header>

        <div className="bonifica__timeline" data-reveal>
          <p className="bonifica__year big-number">{PEDE.annoIcmesa}</p>
          <div className="bonifica__track" aria-hidden="true" />
          <p className="bonifica__year big-number">oggi</p>
        </div>

        <ol className="bonifica__phases">
          {PHASES.map((p, i) => (
            <li key={p} className="bonifica__phase" data-reveal>
              <span className="annotation annotation--accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="bonifica__phase-label">{p}</span>
            </li>
          ))}
        </ol>

        <p className="bonifica__body" data-reveal>
          Nelle aree ex ICMESA la bonifica procede attraverso scavi controllati,
          campionamenti, monitoraggi continui e validazioni degli enti
          competenti.
        </p>
      </div>
    </section>
  )
}

export default Bonifica
