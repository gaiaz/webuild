import { useRef } from 'react'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import {
  PEDE,
  AXIS_Y,
  AXIS_X0,
  AXIS_X1,
  AXIS_NODES,
  AXIS_TRATTE,
  AXIS_BRANCHES,
  LABEL_ROW_Y,
  PROVINCES,
} from '../../data/pedemontana'
import './Sistema.css'

/**
 * 02 — Il sistema. Schema di esercizio: l'asse si costruisce da ovest a est,
 * una tratta alla volta, e collega le cinque province.
 *
 * Regole di composizione dello schema:
 *  · asse dritto — è un diagramma, non cartografia
 *  · nomi su due righe alternate + linea di richiamo: nessuna sovrapposizione
 *  · lettere delle tratte in una fascia loro, sotto l'asse e sopra i nomi
 *  · metà superiore riservata alle tangenziali
 */
const LETTER_Y = 242
const TICK = 7

const Sistema = () => {
  const rootRef = useRef(null)
  const kmRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      const counter = { v: 0 }
      const tratte = AXIS_TRATTE.map((t) => `.sistema__tratta--${t.id}`)

      tl.set('.sistema__node, .sistema__leader, .sistema__place, .sistema__letter', { opacity: 0 }, 0)
        .set('.sistema__branch, .sistema__branch-lbl', { opacity: 0 }, 0)
        // il contatore corre mentre l'asse si costruisce
        .to(counter, {
          v: PEDE.kmSistema,
          duration: 2.6,
          onUpdate: () => {
            if (kmRef.current) kmRef.current.textContent = Math.round(counter.v)
          },
        })
        .fromTo('.sistema__baseline', { scaleX: 0 }, { scaleX: 1, duration: 2.6, transformOrigin: '0% 50%' }, '<')

      // Ogni tratta si disegna, poi si accendono il suo nodo, il nome e la lettera
      tratte.forEach((sel, i) => {
        const node = AXIS_NODES[AXIS_TRATTE[i].to]
        tl.fromTo(
          sel,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, transformOrigin: '0% 50%' },
          i === 0 ? '<' : '>-0.1'
        )
          .to(`.sistema__letter--${AXIS_TRATTE[i].id}`, { opacity: 1, duration: 0.25 }, '<0.15')
          .to(`.sistema__node--${node.id}`, { opacity: 1, duration: 0.25 }, '<0.1')
          .to(`.sistema__leader--${node.id}`, { opacity: 1, duration: 0.25 }, '<')
          .to(`.sistema__place--${node.id}`, { opacity: 1, duration: 0.3 }, '<')
      })

      tl.to('.sistema__node--cassano, .sistema__leader--cassano, .sistema__place--cassano', { opacity: 1, duration: 0.3 }, 0.3)
        // le tangenziali si innestano alla fine
        .to('.sistema__branch', { opacity: 1, duration: 0.5, stagger: 0.14 }, '>-0.1')
        .to('.sistema__branch-lbl', { opacity: 1, duration: 0.4, stagger: 0.14 }, '<0.15')
        .fromTo('.sistema__province', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.2')
        .fromTo('.sistema__kicker', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '+=0.2')
        .to({}, { duration: 0.6 })
    },
    { end: '+=460%' }
  )

  return (
    <section ref={rootRef} className="sistema" aria-labelledby="sistema-title">
      <div className="sistema__inner container">
        <header className="sistema__head">
          <p className="annotation annotation--accent">02 / 17 — Il sistema</p>
          <h2 id="sistema-title" className="sistema__title display">
            Un nuovo asse attraversa il Nord Italia.
          </h2>
          <dl className="sistema__stats">
            <div className="sistema__stat">
              <dd className="sistema__stat-num big-number">
                <span ref={kmRef}>{PEDE.kmSistema}</span> km
              </dd>
              <dt className="annotation">di sistema viabilistico</dt>
            </div>
            <div className="sistema__stat">
              <dd className="sistema__stat-num big-number">{PEDE.kmAsse} km</dd>
              <dt className="annotation">di asse autostradale</dt>
            </div>
            <div className="sistema__stat">
              <dd className="sistema__stat-num big-number">5</dd>
              <dt className="annotation">tratte: A, B1, B2, C e D</dt>
            </div>
          </dl>
        </header>

        <div
          className="sistema__map"
          role="img"
          aria-label="Schema dell'asse Pedemontana da ovest a est: cinque tratte — A, B1, B2, C e D — da Cassano Magnago sulla A8 a Osio Sotto sulla A4, passando per Lomazzo, Lentate sul Seveso, Cesano Maderno e Usmate Velate, con le tangenziali di Varese e di Como."
        >
          <svg viewBox="0 0 1200 380" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            {/* orientamento */}
            <text className="sistema__compass" x={AXIS_X0} y="172">Ovest</text>
            <text className="sistema__compass" x={AXIS_X1} y="172" textAnchor="end">Est</text>

            {/* tangenziali: rami che salgono dall'asse */}
            {AXIS_BRANCHES.map((b) => (
              <g key={b.id}>
                <path
                  className="sistema__branch"
                  d={`M ${b.x} ${AXIS_Y} L ${b.tipX} ${b.tipY}`}
                />
                <text className="sistema__branch-lbl" x={b.tipX} y={b.tipY - 18} textAnchor="middle">
                  {b.label}
                </text>
              </g>
            ))}

            {/* binario di fondo + le cinque tratte che lo ricoprono */}
            <line
              className="sistema__baseline"
              x1={AXIS_X0}
              y1={AXIS_Y}
              x2={AXIS_X1}
              y2={AXIS_Y}
            />
            {AXIS_TRATTE.map((t) => (
              <line
                key={t.id}
                className={`sistema__tratta sistema__tratta--${t.id}`}
                x1={AXIS_NODES[t.from].x}
                y1={AXIS_Y}
                x2={AXIS_NODES[t.to].x}
                y2={AXIS_Y}
              />
            ))}

            {/* lettere delle tratte, nella loro fascia */}
            {AXIS_TRATTE.map((t) => (
              <text
                key={`l${t.id}`}
                className={`sistema__letter sistema__letter--${t.id}`}
                x={(AXIS_NODES[t.from].x + AXIS_NODES[t.to].x) / 2}
                y={LETTER_Y}
                textAnchor="middle"
              >
                {t.id}
              </text>
            ))}

            {/* nodi, richiami e nomi su due righe alternate */}
            {AXIS_NODES.map((n) => (
              <g key={n.id}>
                <line
                  className={`sistema__leader sistema__leader--${n.id}`}
                  x1={n.x}
                  y1={AXIS_Y + TICK}
                  x2={n.x}
                  y2={LABEL_ROW_Y[n.row] - 14}
                />
                <line
                  className={`sistema__node sistema__node--${n.id}`}
                  x1={n.x}
                  y1={AXIS_Y - TICK}
                  x2={n.x}
                  y2={AXIS_Y + TICK}
                />
                <text
                  className={`sistema__place sistema__place--${n.id}`}
                  x={n.x}
                  y={LABEL_ROW_Y[n.row]}
                  textAnchor={n.anchor}
                >
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
          <p className="sistema__province annotation">{PROVINCES.join(' · ')}</p>
        </div>

        <p className="sistema__kicker kicker">
          Da ovest a est: <em>cinque province collegate.</em>
        </p>
      </div>
    </section>
  )
}

export default Sistema
