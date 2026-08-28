import { useRef } from 'react'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import './Chiusura.css'

/**
 * 17 — Chiusura. La linea che ha attraversato tutta la narrazione la
 * ripercorre: assume una dopo l'altra le geometrie delle scene — l'asse,
 * il profilo interrato, l'attraversamento ferroviario, gli impulsi dei
 * sensori — e infine si distende in una linea sola.
 *
 * Il morphing è campionato: ogni forma è la stessa polilinea di N punti,
 * quindi si interpola punto per punto senza plugin di morphing.
 */
const N = 140
const X0 = 40
const X1 = 1160
const MIDY = 150

/* ─── primitive di forma ─── */
const smooth = (e) => e * e * (3 - 2 * e)

// plateau con spalle morbide: 0 fuori, 1 dentro
const plateau = (t, a, b, edge) => {
  if (t <= a - edge || t >= b + edge) return 0
  if (t < a) return smooth((t - a + edge) / edge)
  if (t > b) return 1 - smooth((t - b) / edge)
  return 1
}

// impulso triangolare stretto
const spike = (t, c, w = 0.03) => Math.max(0, 1 - Math.abs(t - c) / w)

// spezzata per nodi
const through = (nodes, t) => {
  for (let i = 0; i < nodes.length - 1; i += 1) {
    const [t0, y0] = nodes[i]
    const [t1, y1] = nodes[i + 1]
    if (t <= t1) return y0 + ((y1 - y0) * (t - t0)) / (t1 - t0)
  }
  return nodes[nodes.length - 1][1]
}

/* ─── le geometrie della storia, in ordine di racconto ─── */
const SHAPES = [
  { id: 'apertura', caption: null, f: () => MIDY },
  {
    id: 'asse',
    caption: "l'asse — 87 km da ovest a est",
    f: (t) => through([[0, 122], [0.22, 134], [0.4, 144], [0.52, 150], [0.7, 140], [1, 178]], t),
  },
  {
    id: 'sotto',
    caption: "sotto la superficie — 23,4 km interrati",
    f: (t) => MIDY + 108 * plateau(t, 0.2, 0.78, 0.11),
  },
  {
    id: 'ferrovie',
    caption: 'tre linee ferroviarie, mai interrotte',
    f: (t) => MIDY + 76 * plateau(t, 0.4, 0.6, 0.014),
  },
  {
    id: 'sensori',
    caption: 'una strada che conosce il proprio stato',
    f: (t) => MIDY - 66 * (spike(t, 0.28) + spike(t, 0.52) + spike(t, 0.76)),
  },
  { id: 'unica', caption: null, f: () => MIDY },
]

const sample = (f) =>
  Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1)
    return [X0 + t * (X1 - X0), f(t)]
  })

const POINTS = SHAPES.map((s) => sample(s.f))
const toPath = (pts) => `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ')}`
const PATHS = POINTS.map(toPath)

// echi: le forme attraversate restano come tracce in filigrana
const ECHOES = SHAPES.slice(1, 5).map((s, i) => ({ id: s.id, d: PATHS[i + 1] }))

const Chiusura = () => {
  const rootRef = useRef(null)
  const lineRef = useRef(null)

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      // interpola fra due campionature e riscrive il path
      const morph = (from, to, duration, position) => {
        const k = { v: 0 }
        return tl.to(
          k,
          {
            v: 1,
            duration,
            ease: 'power2.inOut',
            onUpdate: () => {
              const a = POINTS[from]
              const b = POINTS[to]
              const pts = a.map(([x, y], i) => [x, y + (b[i][1] - y) * k.v])
              if (lineRef.current) lineRef.current.setAttribute('d', toPath(pts))
            },
          },
          position
        )
      }

      tl.set('.chiusura__echo, .chiusura__caption', { opacity: 0 }, 0)
        .set('.chiusura__claim, .chiusura__way, .chiusura__brand', { opacity: 0 }, 0)
        .fromTo('.chiusura__line', { opacity: 0 }, { opacity: 1, duration: 0.5 })

      // la linea ripercorre le geometrie della storia
      SHAPES.slice(1).forEach((shape, i) => {
        morph(i, i + 1, 1.1, i === 0 ? '>-0.2' : '>+0.35')
        if (shape.caption) {
          tl.to(`.chiusura__caption--${shape.id}`, { opacity: 1, duration: 0.3 }, '<0.25')
            .to(`.chiusura__echo--${shape.id}`, { opacity: 0.5, duration: 0.5 }, '<')
            .to(`.chiusura__caption--${shape.id}`, { opacity: 0, duration: 0.3 }, '>+0.15')
        }
      })

      tl
        // tutto si distende: gli echi si spengono, resta una linea sola
        .to('.chiusura__echo', { opacity: 0.12, duration: 0.8 }, '>-0.3')
        .to('.chiusura__line', { strokeWidth: 9, duration: 0.8 }, '<')
        .fromTo(
          '.chiusura__sweep',
          { scaleX: 0, opacity: 1, transformOrigin: '50% 50%' },
          { scaleX: 1, duration: 0.9, ease: 'power3.out' },
          '<0.2'
        )
        // e la linea diventa parola
        .fromTo('.chiusura__claim--one', { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.7 }, '+=0.2')
        .fromTo('.chiusura__claim--two', { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.7 }, '+=0.35')
        .fromTo(
          '.chiusura__way',
          { opacity: 0, scale: 0.86, letterSpacing: '0.3em' },
          { opacity: 1, scale: 1, letterSpacing: '-0.01em', duration: 1.1, ease: 'power3.out' },
          '+=0.4'
        )
        .fromTo('.chiusura__brand', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, '+=0.3')
        .to({}, { duration: 0.8 })
    },
    { end: '+=620%' }
  )

  return (
    <section
      ref={rootRef}
      className="chiusura"
      data-hide-header
      aria-labelledby="chiusura-title"
    >
      <div className="chiusura__inner container">
        <div className="chiusura__stage" aria-hidden="true">
          <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid meet">
            {ECHOES.map((e) => (
              <path key={e.id} className={`chiusura__echo chiusura__echo--${e.id}`} d={e.d} />
            ))}
            <line className="chiusura__sweep" x1="0" y1={MIDY} x2="1200" y2={MIDY} />
            <path ref={lineRef} className="chiusura__line" d={PATHS[0]} />
          </svg>

          <p className="chiusura__captions">
            {SHAPES.filter((s) => s.caption).map((s) => (
              <span key={s.id} className={`chiusura__caption chiusura__caption--${s.id} annotation`}>
                {s.caption}
              </span>
            ))}
          </p>
        </div>

        <h2 id="chiusura-title" className="chiusura__claims">
          <span className="chiusura__claim chiusura__claim--one display">
            Non solo una nuova strada.
            <br />
            Un nuovo modo di attraversare il territorio.
          </span>
          <span className="chiusura__claim chiusura__claim--two display">
            Un nuovo modo di connettere
            <br />
            persone, imprese e futuro.
          </span>
        </h2>

        <p className="chiusura__way display">My New Way</p>

        <img
          className="chiusura__brand"
          src="/webuild-logo.svg"
          alt="Webuild"
          width="119"
          height="33"
        />

        <footer className="chiusura__credits">
          <h3 className="sr-only">Fonti, note e crediti</h3>
          <p>
            Nota sui dati: il dato dell'85% si riferisce esclusivamente alle
            tratte B2 e C. Il sistema viabilistico complessivo misura 157 km,
            mentre gli 87 km indicano l'estensione dell'asse autostradale
            articolato nelle cinque tratte e nelle tangenziali di Varese e Como.
          </p>
          <p>
            Fonte: factsheet testi Pedelombarda, versione italiana del 28 luglio
            2026. Prototipo editoriale non ufficiale, realizzato a scopo di
            concept. Tipografia: Archivo, IBM Plex Mono (Google Fonts).
          </p>
        </footer>
      </div>
    </section>
  )
}

export default Chiusura
