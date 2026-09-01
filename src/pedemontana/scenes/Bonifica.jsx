import { useRef } from 'react'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import { PEDE } from '../../data/pedemontana'
import './Bonifica.css'

/**
 * 11 — Bonifica. Registro editoriale, sobrio: la linea rossa disegna
 * la timeline dal 1976 a oggi, poi si scompone nelle quattro fasi del
 * processo nelle aree ex ICMESA. Nessuna spettacolarizzazione.
 */
const PHASES = [
  'Scavi controllati',
  'Campionamenti',
  'Monitoraggi continui',
  'Validazioni degli enti competenti',
]

const Bonifica = () => {
  const rootRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      tl.set('.bonifica__track', { scaleX: 0, transformOrigin: '0% 50%' }, 0)
        .set('.bonifica__year--end', { opacity: 0 }, 0)
        .set('.bonifica__phase', { opacity: 0, y: 16 }, 0)
        .set('.bonifica__phase-rule', { scaleX: 0, transformOrigin: '0% 50%' }, 0)
        .fromTo(
          '.bonifica__year--start',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5 }
        )
        // la linea rossa disegna la timeline da 1976 a oggi
        .to('.bonifica__track', { scaleX: 1, duration: 1.3 }, '+=0.1')
        .to('.bonifica__year--end', { opacity: 1, duration: 0.4 }, '-=0.2')
        // la timeline si scompone nelle quattro fasi del processo
        .to('.bonifica__phase-rule', { scaleX: 1, duration: 0.4, stagger: 0.18 }, '+=0.2')
        .to('.bonifica__phase', { opacity: 1, y: 0, duration: 0.4, stagger: 0.18 }, '<')
        .fromTo('.bonifica__body', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.5 })
    },
    { end: '+=360%' }
  )

  return (
    <section ref={rootRef} className="bonifica" aria-labelledby="bonifica-title">
      <div className="bonifica__inner container">
        <header className="bonifica__head">
          <p className="annotation annotation--accent">11 / 17 — Bonifica</p>
          <h2 id="bonifica-title" className="bonifica__title display">
            Da una ferita del passato
            <br />
            può nascere una nuova cura del territorio.
          </h2>
        </header>

        <div className="bonifica__timeline">
          <p className="bonifica__year bonifica__year--start big-number">{PEDE.annoIcmesa}</p>
          <div className="bonifica__track" aria-hidden="true" />
          <p className="bonifica__year bonifica__year--end big-number">oggi</p>
        </div>

        <ol className="bonifica__phases">
          {PHASES.map((p, i) => (
            <li key={p} className="bonifica__phase">
              <span className="bonifica__phase-rule" aria-hidden="true" />
              <span className="annotation annotation--accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="bonifica__phase-label">{p}</span>
            </li>
          ))}
        </ol>

        <p className="bonifica__body">
          Nelle aree ex ICMESA la bonifica procede attraverso scavi controllati,
          campionamenti, monitoraggi continui e validazioni degli enti
          competenti.
        </p>
      </div>
    </section>
  )
}

export default Bonifica
