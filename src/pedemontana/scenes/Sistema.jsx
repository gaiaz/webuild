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
 *  · l'asse è reso come segnaletica autostradale: barra piena con striscia
 *    di mezzeria, frecce cerchiate ai due estremi (ovest/est)
 */
const LETTER_Y = 242
const BAR_H = 30
const PILL_W = 116
const PILL_H = 30
const ARROW_R = 18
const WEST_X = AXIS_X0 - 18
const EST_X = AXIS_X1 + 18
const ARROW_Y = AXIS_Y - 44
const COMPASS_Y = AXIS_Y - 110

const Sistema = () => {
  const rootRef = useRef(null)
  const kmRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      const counter = { v: 0 }
      const tratte = AXIS_TRATTE.map((t) => `.sistema__tratta--${t.id}`)

      tl.set('.sistema__leader, .sistema__place, .sistema__letter', { opacity: 0 }, 0)
        .set('.sistema__branch, .sistema__branch-pill, .sistema__branch-lbl', { opacity: 0 }, 0)
        // il contatore corre mentre l'asse si costruisce
        .to(counter, {
          v: PEDE.kmSistema,
          duration: 2.6,
          onUpdate: () => {
            if (kmRef.current) kmRef.current.textContent = Math.round(counter.v)
          },
        })

      // Ogni tratta si disegna, poi si accendono il suo nome e la lettera
      tratte.forEach((sel, i) => {
        const node = AXIS_NODES[AXIS_TRATTE[i].to]
        tl.fromTo(
          sel,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, transformOrigin: '0% 50%' },
          i === 0 ? '<' : '>-0.1'
        )
          .to(`.sistema__letter--${AXIS_TRATTE[i].id}`, { opacity: 1, duration: 0.25 }, '<0.15')
          .to(`.sistema__leader--${node.id}`, { opacity: 1, duration: 0.25 }, '<0.1')
          .to(`.sistema__place--${node.id}`, { opacity: 1, duration: 0.3 }, '<')
      })

      tl.to('.sistema__leader--cassano, .sistema__place--cassano', { opacity: 1, duration: 0.3 }, 0.3)
        // le tangenziali si innestano alla fine
        .to('.sistema__branch', { opacity: 1, duration: 0.5, stagger: 0.14 }, '>-0.1')
        .to('.sistema__branch-pill, .sistema__branch-lbl', { opacity: 1, duration: 0.4, stagger: 0.14 }, '<0.15')
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
            Un nuovo asse
            <br aria-hidden="true" /> attraversa il Nord Italia.
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
            {/* orientamento: testo verticale + freccia cerchiata, ai due estremi dell'asse */}
            <text
              className="sistema__compass"
              transform={`translate(${WEST_X} ${COMPASS_Y}) rotate(-90)`}
              textAnchor="middle"
            >
              Ovest
            </text>
            <text
              className="sistema__compass"
              transform={`translate(${EST_X} ${COMPASS_Y}) rotate(-90)`}
              textAnchor="middle"
            >
              Est
            </text>
            <g className="sistema__compass-icon" transform={`translate(${WEST_X} ${ARROW_Y})`}>
              <circle r={ARROW_R} />
              <path d={`M 6 0 H -6 M -2 -4 L -6 0 L -2 4`} />
            </g>
            <g className="sistema__compass-icon" transform={`translate(${EST_X} ${ARROW_Y}) scale(-1 1)`}>
              <circle r={ARROW_R} />
              <path d={`M 6 0 H -6 M -2 -4 L -6 0 L -2 4`} />
            </g>

            {/* tangenziali: rami che salgono dall'asse verso un'etichetta a pillola */}
            {AXIS_BRANCHES.map((b) => (
              <g key={b.id}>
                <path
                  className="sistema__branch"
                  d={`M ${b.x} ${AXIS_Y - BAR_H / 2} L ${b.tipX} ${b.tipY + PILL_H / 2}`}
                />
                <rect
                  className="sistema__branch-pill"
                  x={b.tipX - PILL_W / 2}
                  y={b.tipY - PILL_H / 2}
                  width={PILL_W}
                  height={PILL_H}
                  rx="4"
                />
                <text className="sistema__branch-lbl" x={b.tipX} y={b.tipY + 5} textAnchor="middle">
                  {b.label}
                </text>
              </g>
            ))}

            {/* asse come segnaletica autostradale: barra piena + striscia di mezzeria,
                una tratta alla volta */}
            {AXIS_TRATTE.map((t) => {
              const x1 = AXIS_NODES[t.from].x
              const x2 = AXIS_NODES[t.to].x
              return (
                <g key={t.id} className={`sistema__tratta sistema__tratta--${t.id}`}>
                  <rect x={x1} y={AXIS_Y - BAR_H / 2} width={x2 - x1} height={BAR_H} />
                  <line className="sistema__lane" x1={x1} y1={AXIS_Y} x2={x2} y2={AXIS_Y} />
                </g>
              )
            })}

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

            {/* richiami e nomi su due righe alternate, dal bordo della barra */}
            {AXIS_NODES.map((n) => (
              <g key={n.id}>
                <line
                  className={`sistema__leader sistema__leader--${n.id}`}
                  x1={n.x}
                  y1={AXIS_Y + BAR_H / 2}
                  x2={n.x}
                  y2={LABEL_ROW_Y[n.row] - 14}
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
