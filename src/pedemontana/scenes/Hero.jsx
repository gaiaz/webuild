import { useLayoutEffect, useRef } from 'react'
import { gsap, REDUCED_MOTION } from '../../lib/gsap'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import './Hero.css'
import ScrollHint from '../../components/ScrollHint'
import heroSkyway from '../assets/hero-skyway.jpg'

/**
 * 01 — Hero. Il territorio visto dall'alto.
 *
 * Quattro tempi, in un'unica scena pinnata:
 *   0. apertura (non legata allo scroll): la foto aerea a piena pagina,
 *      il marchio rivelato da una maschera che si apre da sinistra
 *   1. la foto sfuma, il marchio si ritira piccolo in alto: emergono
 *      "Per il futuro della" e "LOMBARDIA" (il cui riempimento è ancora la foto)
 *   2. "LOMBARDIA" passa da foto a bianco pieno e il titolo si compatta
 *   3. la strada si disegna da sinistra a destra, poi il payoff finale
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
  const roadClipRef = useRef(null)
  const brandRef = useRef(null)

  // Entrata alla prima apertura: non è legata allo scroll, così il primo
  // fotogramma è già una composizione piena e non una viewport vuota.
  useLayoutEffect(() => {
    if (REDUCED_MOTION) return undefined
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power2.out' } })
        .from('.pede-hero__contour', { opacity: 0, duration: 1.2, stagger: 0.09 })
        .fromTo(
          '.pede-hero__mark-wrap',
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.inOut' },
          0.2
        )
        .from('.pede-hero__meta', { opacity: 0, duration: 0.6 }, 0.9)
      // ScrollHint non entra in questa timeline: si anima da sé in CSS
    }, rootRef)
    return () => ctx.revert()
  }, [])

  useSceneTimeline(
    rootRef,
    ({ tl, root }) => {
      // Il marchio risale fino quasi al bordo superiore: la distanza va
      // misurata dal vivo (non stimata in vh) perché dipende dal padding
      // reale della sezione, che a sua volta varia con la viewport.
      const brandTop = brandRef.current.getBoundingClientRect().top
      const brandTravel = -(brandTop - 12)

      // Il rimpicciolimento di "Per il futuro della"/"LOMBARDIA" va fatto
      // sul font-size reale (non su transform:scale): scale non riduce
      // l'ingombro nel flusso, lasciando uno spazio vuoto sotto al testo
      // e rompendo l'uniformità dei gap con la strada e il payoff.
      const subEl = root.querySelector('.pede-hero__sub')
      const wordStackEl = root.querySelector('.pede-hero__word-stack')
      const subBigPx = parseFloat(getComputedStyle(subEl).fontSize)
      const wordStackBigPx = parseFloat(getComputedStyle(wordStackEl).fontSize)

      tl.set('.pede-hero__node', { opacity: 0 }, 0)
        .set(roadClipRef.current, { attr: { width: 0 } }, 0)
        .set('.pede-hero__word-solid', { opacity: 0 }, 0)
        .set('.pede-hero__sub .pede-hero__word', { yPercent: 110 }, 0)
        .set('.pede-hero__word-stack', { opacity: 0, y: 24 }, 0)
        // 1 — la foto sfuma, il marchio risale in alto (stessa identica
        // dimensione: nel Figma non si rimpicciolisce mai) e passa da
        // bianco (leggibile sulla foto) a rosso (leggibile sul nero)
        .to('.pede-hero__photo', { opacity: 0, scale: 1.08, duration: 1.4 }, '+=0.3')
        .to(brandRef.current, { y: brandTravel, duration: 1.1 }, '<')
        // il rosso emerge sopra al bianco (che resta opaco sotto, mai
        // semitrasparente) con uno scatto breve, quando il fondo è ormai
        // quasi nero: niente stati intermedi rosa-lavato prolungati
        .to('.pede-hero__mark--red', { opacity: 1, duration: 0.3 }, '<0.9')
        .to('.pede-hero__meta', { color: '#a0a0a0', duration: 0.8 }, '<') // --color-text-night: GSAP non risolve var()
        .to('.pede-hero__sub .pede-hero__word', { yPercent: 0, duration: 0.8 }, '<0.3')
        .to('.pede-hero__word-stack', { opacity: 1, y: 0, duration: 0.8 }, '<')
        // 2 — LOMBARDIA passa da foto a bianco, il titolo si compatta
        // (font-size reale: il box si riduce davvero, niente spazio fantasma)
        .to(subEl, { fontSize: subBigPx * 0.56, duration: 0.9 }, '+=0.4')
        .to(wordStackEl, { fontSize: wordStackBigPx * 0.56, duration: 0.9 }, '<')
        .to('.pede-hero__word-photo', { opacity: 0, duration: 0.6 }, '<')
        .to('.pede-hero__word-solid', { opacity: 1, duration: 0.6 }, '<')
        // 3 — la strada si disegna da sinistra verso destra (maschera che si
        // allarga: funziona su un tracciato curvo senza conflitti con lo
        // stile decorativo tratteggiato, a differenza di strokeDashoffset)
        .to(roadClipRef.current, { attr: { width: 1200 }, duration: 2.2 }, '+=0.3')
        .to('.pede-hero__node--start', { opacity: 1, duration: 0.25 }, '<')
        .to('.pede-hero__node--mid', { opacity: 1, duration: 0.25 }, '<1.1')
        .to('.pede-hero__node--end', { opacity: 1, duration: 0.25 }, '<1.05')
        // 4 — il payoff entra dopo la linea
        .fromTo(
          '.pede-hero__payoff .pede-hero__word',
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, stagger: 0.16, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo('.pede-hero__opera', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
        .to({}, { duration: 0.8 })
    },
    { end: '+=520%' }
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

      <div
        className="pede-hero__photo"
        style={{ backgroundImage: `url(${heroSkyway})` }}
        aria-hidden="true"
      />

      {/* Ancorato in modo indipendente al centro esatto della viewport (come
          nel Figma: il gruppo logo+caption è centrato, non in cima a uno
          stack con il resto del titolo, che a inizio scena è ancora invisibile) */}
      <div className="pede-hero__brand-anchor">
        <div className="pede-hero__brand" ref={brandRef}>
          <span className="pede-hero__mark-wrap">
            <img
              className="pede-hero__mark pede-hero__mark--white"
              src="/webuild-logo.svg"
              alt=""
              aria-hidden="true"
              width="119"
              height="33"
            />
            <img
              className="pede-hero__mark pede-hero__mark--red"
              src="/webuild-logo.svg"
              alt="Webuild"
              width="119"
              height="33"
            />
          </span>
          <p className="pede-hero__meta annotation">
            Sotto la superficie — scroll narration
          </p>
        </div>
      </div>

      <div className="pede-hero__inner container">
        <h2 id="pede-hero-title" className="pede-hero__title">
          <span className="pede-hero__headline">
            <span className="pede-hero__sub">
              <span className="pede-hero__mask">
                <span className="pede-hero__word">Per il futuro della</span>
              </span>
            </span>

            <span className="pede-hero__word-stack">
              <span
                className="pede-hero__word-photo"
                style={{ backgroundImage: `url(${heroSkyway})` }}
                aria-hidden="true"
              >
                Lombardia
              </span>
              <span className="pede-hero__word-solid">Lombardia</span>
            </span>
          </span>

          <span className="pede-hero__band" aria-hidden="true">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="xMidYMid meet">
              <defs>
                <clipPath id="pede-hero-road-clip">
                  <rect ref={roadClipRef} x="0" y="0" width="1200" height="120" />
                </clipPath>
              </defs>
              <g clipPath="url(#pede-hero-road-clip)">
                <path className="pede-hero__road-base" d="M 20 80 Q 300 40 600 62 T 1180 70" />
                <path className="pede-hero__road-dash" d="M 20 80 Q 300 40 600 62 T 1180 70" />
              </g>
              <circle className="pede-hero__node pede-hero__node--start" cx="20" cy="80" r="9" />
              <circle className="pede-hero__node pede-hero__node--mid" cx="600" cy="62" r="9" />
              <circle className="pede-hero__node pede-hero__node--end" cx="1180" cy="70" r="9" />
            </svg>
          </span>

          <span className="pede-hero__payoff display">
            <span className="pede-hero__mask">
              <span className="pede-hero__word">si apre</span>
            </span>
            <span className="pede-hero__mask">
              <span className="pede-hero__word">
                una <em className="pede-hero__accent">nuova strada.</em>
              </span>
            </span>
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
