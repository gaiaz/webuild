import { useRef } from 'react'
import { useReveal } from '../../lib/useReveal'
import { WORLD_PROJECTS } from '../../data/fy2025'
import './WorldProjects.css'

/* ─── Tavole di progetto: illustrazioni SVG in linguaggio "disegno esecutivo".
   Slot pronti per fotografia ufficiale Webuild (sostituire la tavola con <img>). */
const PLATES = {
  metro: (
    <svg viewBox="0 0 900 600" aria-hidden="true">
      {[280, 220, 165, 115, 72].map((r, i) => (
        <circle key={r} cx="450" cy="300" r={r} className={i === 0 ? 'plate__stroke plate__stroke--accent' : 'plate__stroke'} />
      ))}
      <path className="plate__stroke" d="M 190 560 L 415 330 M 710 560 L 485 330" />
      <path className="plate__stroke plate__stroke--accent" d="M 170 590 L 450 300 M 730 590 L 450 300" />
      <line className="plate__hair" x1="450" y1="20" x2="450" y2="580" />
    </svg>
  ),
  tunnel: (
    <svg viewBox="0 0 900 600" aria-hidden="true">
      <circle cx="290" cy="330" r="180" className="plate__stroke plate__stroke--accent" />
      <circle cx="620" cy="330" r="180" className="plate__stroke" />
      {[0, 45, 90, 135].map((a) => (
        <line
          key={a}
          className="plate__hair"
          x1={290 - 180 * Math.cos((a * Math.PI) / 180)}
          y1={330 - 180 * Math.sin((a * Math.PI) / 180)}
          x2={290 + 180 * Math.cos((a * Math.PI) / 180)}
          y2={330 + 180 * Math.sin((a * Math.PI) / 180)}
        />
      ))}
      <line className="plate__hair" x1="40" y1="510" x2="860" y2="510" />
    </svg>
  ),
  water: (
    <svg viewBox="0 0 900 600" aria-hidden="true">
      {[180, 230, 280, 330].map((y, i) => (
        <path
          key={y}
          className={i === 0 ? 'plate__stroke plate__stroke--accent' : 'plate__stroke'}
          d={`M 40 ${y} Q 155 ${y - 42} 270 ${y} T 500 ${y} T 730 ${y} T 960 ${y}`}
        />
      ))}
      <rect x="600" y="120" width="56" height="380" className="plate__stroke" />
      <line className="plate__hair" x1="40" y1="500" x2="860" y2="500" />
    </svg>
  ),
  dam: (
    <svg viewBox="0 0 900 600" aria-hidden="true">
      {[0, 34, 68, 102].map((off, i) => (
        <path
          key={off}
          className={i === 0 ? 'plate__stroke plate__stroke--accent' : 'plate__stroke'}
          d={`M ${120 + off} 80 Q 450 ${300 + off * 1.4} ${780 - off} 80`}
        />
      ))}
      {[380, 420, 460, 500].map((y) => (
        <line key={y} className="plate__hair" x1="150" y1={y} x2="750" y2={y} />
      ))}
    </svg>
  ),
}

/**
 * 03a — Un anno attraverso il mondo.
 * Pannelli sticky che si impilano: ogni progetto copre il precedente.
 */
const WorldProjects = () => {
  const rootRef = useRef(null)
  useReveal(rootRef)

  return (
    <section ref={rootRef} className="wproj" aria-labelledby="wproj-title">
      <header className="wproj__intro theme-night" data-nav-theme="dark">
        <div className="container">
          <p className="annotation annotation--accent" data-reveal>
            03 · Milestones
          </p>
          <h2 id="wproj-title" className="wproj__title display" data-reveal>
            Un anno attraverso il&nbsp;mondo
          </h2>
          <p className="wproj__sub" data-reveal>
            Dai dati ai luoghi: quattro opere che nel 2025 hanno cambiato scala.
          </p>
        </div>
      </header>

      <div className="wproj__stack">
        {WORLD_PROJECTS.map((p, i) => (
          <article key={p.id} className="wproj__panel theme-night" data-nav-theme="dark">
            <div className="wproj__plate">{PLATES[p.plate]}</div>
            <div className="wproj__content container">
              <p className="annotation">
                {String(i + 1).padStart(2, '0')} / {String(WORLD_PROJECTS.length).padStart(2, '0')} — {p.meta}
              </p>
              <h3 className="wproj__name display">{p.name}</h3>
              <p className="wproj__place annotation annotation--accent">{p.place}</p>
              <p className="wproj__fact">{p.fact}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WorldProjects
