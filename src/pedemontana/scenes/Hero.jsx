import { useLayoutEffect, useRef } from 'react'
import { gsap, REDUCED_MOTION } from '../../lib/gsap'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import './Hero.css'
import ScrollHint from '../../components/ScrollHint'

/**
 * 01 — Hero. Il territorio visto dall'alto, di notte.
 *
 * Tre tempi, in flusso verticale (nessun overlay sui titoli):
 *   0. primo fotogramma: il marchio grande in cima e, sotto,
 *      "Per il futuro della Lombardia" — convivono
 *   1. il marchio si ritira e la linea rossa si compone da sinistra a destra
 *   2. "Si apre una nuova strada." + il nome dell'opera
 *
 * Da qui in poi il marchio riappare piccolo, fisso in alto a destra: la hero
 * è marcata `data-hide-header` così l'header non si sovrappone all'apertura.
 */
const CONTOURS = [
  'M -40 90 Q 300 52 640 104 T 1240 74',
  'M -40 190 Q 340 150 700 202 T 1240 178',
  'M -40 300 Q 280 268 620 318 T 1240 284',
  'M -40 410 Q 360 372 720 422 T 1240 398',
  'M -40 520 Q 300 486 640 530 T 1240 504',
  'M -40 620 Q 340 592 700 636 T 1240 612',
]

const Hero = () => {
  const rootRef = useRef(null)
  const traceRef = useRef(null)

  // Entrata alla prima apertura: non è legata allo scroll, così il primo
  // fotogramma è già una composizione piena e non una viewport vuota.
  useLayoutEffect(() => {
    if (REDUCED_MOTION) return undefined
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power2.out' } })
        .from('.pede-hero__contour', { opacity: 0, duration: 1.2, stagger: 0.09 })
        .from('.pede-hero__meta', { opacity: 0, duration: 0.7 }, 0.3)
        .from(
          '.pede-hero__lead .pede-hero__word',
          { yPercent: 110, duration: 1, stagger: 0.14 },
          0.4
        )
      // ScrollHint non entra in questa timeline: si anima da sé in CSS
    }, rootRef)
    return () => ctx.revert()
  }, [])

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      const len = traceRef.current.getTotalLength()

      tl.set(traceRef.current, { strokeDasharray: len, strokeDashoffset: len }, 0)
        .set('.pede-hero__node', { opacity: 0 }, 0)
        // 1 — il marchio si ritira: da qui in poi vive in alto a destra
        .fromTo(
          '.pede-hero__mark',
          { opacity: 1, y: 0 },
          { opacity: 0, y: -28, duration: 0.9 },
          '+=0.5'
        )
        // 2 — la linea si compone da sinistra verso destra
        .to(traceRef.current, { strokeDashoffset: 0, duration: 2.4 }, '+=0.3')
        .to('.pede-hero__node--start', { opacity: 1, duration: 0.25 }, '<')
        .to('.pede-hero__node--mid', { opacity: 1, duration: 0.25 }, '<1.2')
        .to('.pede-hero__node--end', { opacity: 1, duration: 0.25 }, '<1.15')
        // 3 — il payoff entra dopo la linea
        .fromTo(
          '.pede-hero__payoff .pede-hero__word',
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, stagger: 0.16, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo('.pede-hero__opera', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
        .to({}, { duration: 0.8 })
    },
    { end: '+=460%' }
  )

  return (
    <section
      ref={rootRef}
      className="pede-hero theme-night"
      data-nav-theme="dark"
      data-hide-header
      aria-labelledby="pede-hero-title"
    >
      <svg
        className="pede-hero__terrain"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {CONTOURS.map((d) => (
          <path key={d} className="pede-hero__contour" d={d} />
        ))}
      </svg>

      <div className="pede-hero__inner container">
        {/* Il marchio apre la narrazione insieme al titolo,
            poi si ritira e riappare piccolo in alto a destra */}
        <img
          className="pede-hero__mark"
          src="/webuild-logo.svg"
          alt="Webuild"
          width="119"
          height="33"
        />

        <p className="pede-hero__meta annotation">
          Sotto la superficie — scroll narration
        </p>

        <h2 id="pede-hero-title" className="pede-hero__title">
          <span className="pede-hero__lead display">
            {['Per il futuro', 'della Lombardia'].map((w) => (
              <span key={w} className="pede-hero__mask">
                <span className="pede-hero__word">{w}</span>
              </span>
            ))}
          </span>

          <span className="pede-hero__band" aria-hidden="true">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="xMidYMid meet">
              <path
                ref={traceRef}
                className="pede-hero__trace"
                d="M 20 74 L 260 66 L 520 58 L 760 56 L 980 50 L 1180 66"
              />
              <circle className="pede-hero__node pede-hero__node--start" cx="20" cy="74" r="8" />
              <circle className="pede-hero__node pede-hero__node--mid" cx="600" cy="57" r="8" />
              <circle className="pede-hero__node pede-hero__node--end" cx="1180" cy="66" r="8" />
            </svg>
          </span>

          <span className="pede-hero__payoff display">
            {['si apre', 'una nuova strada.'].map((w) => (
              <span key={w} className="pede-hero__mask">
                <span className="pede-hero__word">{w}</span>
              </span>
            ))}
          </span>
        </h2>

        <p className="pede-hero__opera annotation annotation--accent">
          Autostrada Pedemontana Lombarda
        </p>
      </div>

      <ScrollHint label="Scorri — il tracciato si apre" />
    </section>
  )
}

export default Hero
