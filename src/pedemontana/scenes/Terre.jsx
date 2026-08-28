import { useRef } from 'react'
import { prepStroke } from '../../lib/drawStroke'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import { PEDE } from '../../data/pedemontana'
import './Terre.css'

/**
 * 10 — Terre. 17 milioni di m³ come volume unico che si biforca:
 * ~8 tornano nell'opera, il resto riambienta le cave lombarde.
 * Le larghezze dei flussi sono proporzionali ai volumi.
 */
const TOTAL_H = 240
const RIUSO_H = (PEDE.terreRiuso / PEDE.terreTotali) * TOTAL_H // ≈113
const CAVE_H = TOTAL_H - RIUSO_H

const Terre = () => {
  const rootRef = useRef(null)
  const volRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl, root }) => {
      const counter = { v: 0 }
      prepStroke(tl, '.terre__flow', root)
        .fromTo(
          '.terre__source',
          { scaleY: 0, transformOrigin: '50% 100%' },
          { scaleY: 1, duration: 1.2 }
        )
        .to(
          counter,
          {
            v: PEDE.terreTotali,
            duration: 1.2,
            onUpdate: () => {
              if (volRef.current) volRef.current.textContent = Math.round(counter.v)
            },
          },
          '<'
        )
        .to('.terre__flow--riuso', { strokeDashoffset: 0, duration: 1.4 }, '+=0.3')
        .fromTo('.terre__dest--riuso', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
        .to('.terre__flow--cave', { strokeDashoffset: 0, duration: 1.4 }, '+=0.2')
        .fromTo('.terre__dest--cave', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
        .fromTo('.terre__kicker', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.3')
        .to({}, { duration: 0.5 })
    },
    { end: '+=440%' }
  )

  return (
    <section ref={rootRef} className="terre" aria-labelledby="terre-title">
      <div className="terre__inner container">
        <header className="terre__head">
          <p className="annotation annotation--accent">10 / 17 — Terre</p>
          <h2 id="terre-title" className="terre__title">
            <span className="big-number terre__figure">
              <span ref={volRef}>{PEDE.terreTotali}</span>
              <span className="terre__unit"> mln m³</span>
            </span>
            <span className="terre__caption display">
              di terreno. Una risorsa da rimettere in circolo.
            </span>
          </h2>
        </header>

        <div
          className="terre__viz"
          role="img"
          aria-label="17 milioni di metri cubi di terre scavate: circa 8 milioni tornano nell'opera, gli altri contribuiscono alla riambientazione delle cave lombarde. Le larghezze dei flussi sono proporzionali ai volumi."
        >
          <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {/* volume scavato */}
            <rect className="terre__source" x="80" y={(520 - TOTAL_H) / 2} width="130" height={TOTAL_H} />
            <text className="terre__lbl" x="80" y={(520 - TOTAL_H) / 2 - 16}>
              scavo B2 + C
            </text>
            {/* flusso verso l'opera */}
            <path
              className="terre__flow terre__flow--riuso"
              style={{ strokeWidth: RIUSO_H * 0.55 }}
              d="M 210 200 C 460 190 620 130 880 122"
            />
            {/* flusso verso le cave */}
            <path
              className="terre__flow terre__flow--cave"
              style={{ strokeWidth: CAVE_H * 0.55 }}
              d="M 210 330 C 470 345 630 400 880 408"
            />
            <g className="terre__dest terre__dest--riuso">
              <text className="terre__dest-num" x="905" y="112">~{PEDE.terreRiuso} mln m³</text>
              <text className="terre__lbl" x="905" y="146">riutilizzati nell'opera</text>
            </g>
            <g className="terre__dest terre__dest--cave">
              <text className="terre__dest-num" x="905" y="400">
                ~{PEDE.terreTotali - PEDE.terreRiuso} mln m³
              </text>
              <text className="terre__lbl" x="905" y="434">riambientazione delle cave</text>
            </g>
          </svg>
        </div>

        <p className="terre__kicker kicker">
          Le terre scavate <em>ricompongono rilevati e paesaggi.</em>
        </p>
      </div>
    </section>
  )
}

export default Terre
