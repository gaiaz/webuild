import { useRef } from 'react'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import './Finale.css'

/**
 * Finale — la linea completa la sua traiettoria e il sistema si semplifica.
 */
const Finale = () => {
  const rootRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      tl
        .set('.finale__line-path', { strokeDasharray: 1, strokeDashoffset: 1 })
        .to('.finale__line-path', { strokeDashoffset: 0, duration: 1.4 })
        .fromTo('.finale__year', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.5')
        .fromTo('.finale__claim', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '+=0.2')
        .fromTo('.finale__outcome', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '+=0.3')
        .fromTo('.finale__brand', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.2')
        .to({}, { duration: 0.6 })
    },
    { end: '+=300%' }
  )

  return (
    <section ref={rootRef} className="finale" aria-labelledby="finale-title">
      <div className="finale__inner container">
        <svg
          className="finale__line"
          viewBox="0 0 1600 8"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path className="finale__line-path" pathLength="1" d="M0 4 H1600" />
        </svg>

        <p className="finale__year big-number" aria-hidden="true">
          2025
        </p>

        <h2 id="finale-title" className="finale__claim display">
          I risultati prendono forma.
        </h2>

        <p className="finale__outcome annotation annotation--accent">
          Plan outperformed. Future secured.
        </p>

        <p className="finale__brand display">Webuild</p>

        <footer className="finale__credits">
          <h3 className="sr-only">Fonti e crediti</h3>
          <p>
            Fonte dati: Webuild, risultati consolidati FY2025. Prototipo
            editoriale non ufficiale, realizzato a scopo di concept.
          </p>
          <p>
            Tipografia: Roboto, Roboto Mono (Google Fonts). Geografie: Natural
            Earth via world-atlas. Visualizzazioni: elaborazione originale dei
            dati di bilancio.
          </p>
        </footer>
      </div>
    </section>
  )
}

export default Finale
