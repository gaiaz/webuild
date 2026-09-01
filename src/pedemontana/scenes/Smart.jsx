import { useLayoutEffect, useRef } from 'react'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import { prepStroke } from '../../lib/drawStroke'
import { gsap, REDUCED_MOTION } from '../../lib/gsap'
import './Smart.css'

/**
 * 13–14 — Smart Road e Monitoraggio. Due pannelli sticky che si impilano
 * (stesso pattern delle tavole progetto FY2025), tema night: la strada digitale.
 */
const PANELS = [
  {
    id: 'smart-road',
    num: '13 / 17',
    meta: 'Smart Road · C-ITS',
    title: 'Big data e grandi opportunità.',
    fact: 'Zero caselli. Pedaggio Free Flow. Sistemi C-ITS e comunicazione tra veicolo e infrastruttura.',
    note: 'I portali rilevano i veicoli e scambiano dati su traffico, meteo e sicurezza.',
    plate: (
      <svg viewBox="0 0 900 560" aria-hidden="true">
        {/* strada */}
        <line className="smart-plate__stroke" x1="40" y1="430" x2="860" y2="430" />
        <line className="smart-plate__hair" x1="70" y1="410" x2="830" y2="410" strokeDasharray="18 16" />

        {/* portale free flow: traliccio con base e trave piena */}
        <line className="smart-plate__stroke smart-plate__post" x1="300" y1="430" x2="300" y2="190" />
        <line className="smart-plate__stroke smart-plate__post" x1="600" y1="430" x2="600" y2="190" />
        <rect className="smart-plate__footing" x="288" y="424" width="24" height="10" />
        <rect className="smart-plate__footing" x="588" y="424" width="24" height="10" />
        <rect className="smart-plate__beam" x="292" y="178" width="316" height="16" />

        {/* sensori: telecamere appese al traliccio, con lente attiva */}
        {[348, 450, 552].map((x) => (
          <g key={x} className="smart-plate__camera">
            <rect className="smart-plate__stroke" x={x - 20} y="204" width="40" height="28" />
            <circle className="smart-plate__lens" cx={x} cy="218" r="6" />
          </g>
        ))}

        {/* veicolo, con ruote e antenna di trasmissione */}
        <g className="smart-plate__car">
          <rect className="smart-plate__stroke" x="128" y="386" width="104" height="44" rx="11" />
          <circle className="smart-plate__wheel" cx="150" cy="430" r="8" />
          <circle className="smart-plate__wheel" cx="210" cy="430" r="8" />
          <circle className="smart-plate__antenna" cx="180" cy="386" r="3.5" />
        </g>

        {/* onde veicolo ↔ infrastruttura */}
        {[1, 2, 3].map((k) => (
          <path
            key={k}
            className="smart-plate__wave"
            d={`M ${236 + k * 20} ${376 - k * 22} a ${44 * k} ${44 * k} 0 0 1 ${20 * k} ${52 * k}`}
          />
        ))}
        <text className="smart-plate__lbl" x="450" y="150" textAnchor="middle">
          zero caselli — free flow
        </text>
      </svg>
    ),
  },
  {
    id: 'monitoraggio',
    num: '14 / 17',
    meta: 'Monitoraggio permanente',
    title: 'Una strada sempre connessa.',
    fact: 'Il monitoraggio permanente rileva carichi, vibrazioni, deformazioni e temperatura per rendere la manutenzione più tempestiva e mirata.',
    note: 'I dati attraversano ponti e gallerie come impulsi; le anomalie vengono identificate in anticipo.',
    plate: (
      <svg viewBox="0 0 900 560" aria-hidden="true">
        {/* impalcato con pile */}
        <line className="smart-plate__stroke smart-plate__deck" x1="60" y1="320" x2="840" y2="320" />
        {[210, 450, 690].map((x) => (
          <path
            key={x}
            className="smart-plate__stroke smart-plate__pier"
            d={`M ${x - 22} 320 L ${x - 38} 480 M ${x + 22} 320 L ${x + 38} 480`}
          />
        ))}
        <line className="smart-plate__hair" x1="40" y1="480" x2="860" y2="480" />
        {/* impulsi dei sensori */}
        <path
          className="smart-plate__stroke smart-plate__stroke--accent smart-plate__pulse"
          d="M 60 310 H 250 L 276 262 L 302 356 L 328 310 H 560 L 586 266 L 612 352 L 638 310 H 840"
        />
        {[210, 450, 690].map((x) => (
          <circle key={x} className="smart-plate__sensor" cx={x} cy="320" r="8" />
        ))}
        <text className="smart-plate__lbl" x="450" y="180" textAnchor="middle">
          carichi · vibrazioni · deformazioni · temperatura
        </text>
      </svg>
    ),
  },
]

const Smart = () => {
  const introRef = useRef(null)
  const smartRoadRef = useRef(null)
  const monitoraggioRef = useRef(null)
  const panelRefs = { 'smart-road': smartRoadRef, monitoraggio: monitoraggioRef }

  // Il radar del nodo "dialoga" pulsa in loop continuo, indipendente
  // dallo scroll: la timeline scrubbata rivela solo il gruppo che lo
  // contiene, mai l'opacity dei singoli cerchi del ping (altrimenti le
  // due timeline si contenderebbero la stessa proprietà).
  useLayoutEffect(() => {
    if (REDUCED_MOTION) return undefined
    const ctx = gsap.context(() => {
      gsap.set('.smart-intro__ping', { attr: { r: 6 }, opacity: 0.6 })
      gsap.to('.smart-intro__ping--a', {
        attr: { r: 22 },
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: 'power1.out',
      })
      gsap.to('.smart-intro__ping--b', {
        attr: { r: 22 },
        opacity: 0,
        duration: 2,
        repeat: -1,
        delay: 1,
        ease: 'power1.out',
      })
    }, introRef)
    return () => ctx.revert()
  }, [])

  useSceneTimeline(
    introRef,
    ({ tl, root }) => {
      tl.set(
        '.smart-intro__hinge, .smart-intro__node, .smart-intro__bar, .smart-intro__trend, .smart-intro__lbl, .smart-intro__ping-group',
        { opacity: 0 },
        0
      )
      prepStroke(tl, '.smart-intro__road', root)
      prepStroke(tl, '.smart-intro__signal', root)
      tl.to('.smart-intro__road', { strokeDashoffset: 0, duration: 1 })
        .to('.smart-intro__hinge', { opacity: 1, duration: 0.3 }, '-=0.2')
        .to('.smart-intro__signal', { strokeDashoffset: 0, duration: 1 }, '<')
        // dialoga: nodo + radar
        .to('.smart-intro__node--dialoga, .smart-intro__lbl--dialoga', { opacity: 1, duration: 0.4 }, '+=0.1')
        .to('.smart-intro__ping-group', { opacity: 1, duration: 0.3 }, '<')
        // misura: nodo + istogramma
        .to('.smart-intro__node--misura, .smart-intro__lbl--misura', { opacity: 1, duration: 0.4 }, '+=0.3')
        .to('.smart-intro__bar', { opacity: 1, duration: 0.3, stagger: 0.1 }, '<')
        // prevede: nodo + tendenza
        .to('.smart-intro__node--prevede, .smart-intro__lbl--prevede', { opacity: 1, duration: 0.4 }, '+=0.3')
        .to('.smart-intro__trend', { opacity: 1, duration: 0.3 }, '<')
        .to({}, { duration: 0.4 })
    },
    { end: '+=320%' }
  )

  // Pin vero (non più sticky-stack): con position:sticky il pannello
  // successivo saliva da sotto e ricopriva progressivamente quello
  // corrente per tutta la durata dello scroll, indipendentemente da quanto
  // fosse completo il disegno. Il pin tiene lo scroll fermo sulla scena
  // finché la sua timeline non è arrivata in fondo.
  useSceneTimeline(
    smartRoadRef,
    ({ tl, root }) => {
      tl.set('.smart-plate__post', { scaleY: 0, transformOrigin: '50% 100%' }, 0)
        .set('.smart-plate__footing, .smart-plate__beam', { opacity: 0 }, 0)
        .set('.smart-plate__camera', { opacity: 0, y: -8 }, 0)
        .set('.smart-plate__lens', { opacity: 0 }, 0)
        .set('.smart-plate__car', { x: -220 }, 0)
        .set('.smart-plate__wave', { opacity: 0 }, 0)
        .set('.smart-plate__lbl', { opacity: 0 }, 0)
        .to('.smart-plate__post', { scaleY: 1, duration: 1, stagger: 0.15 })
        .to('.smart-plate__footing', { opacity: 1, duration: 0.3 }, '<')
        .to('.smart-plate__beam', { opacity: 1, duration: 0.4 }, '+=0.1')
        .to('.smart-plate__camera', { opacity: 1, y: 0, duration: 0.4, stagger: 0.12 }, '+=0.1')
        .to('.smart-plate__lens', { opacity: 1, duration: 0.3, stagger: 0.12 }, '<0.1')
        .to('.smart-plate__car', { x: 0, duration: 1 }, '+=0.2')
        .to('.smart-plate__wave', { opacity: 0.7, duration: 0.3, stagger: 0.15 }, '-=0.3')
        .to('.smart-plate__lbl', { opacity: 1, duration: 0.4 }, '+=0.1')
        // l'illustrazione completa resta ferma per il resto dello stuck,
        // invece di finire l'animazione proprio mentre il pannello
        // successivo la ricopre
        .to({}, { duration: 2 })
    },
    { end: '+=420%' }
  )

  useSceneTimeline(
    monitoraggioRef,
    ({ tl, root }) => {
      prepStroke(tl, '.smart-plate__deck', root)
      prepStroke(tl, '.smart-plate__pulse', root)
      tl.set('.smart-plate__pier', { scaleY: 0, transformOrigin: '50% 0%' }, 0)
        .set('.smart-plate__hair', { opacity: 0 }, 0)
        .set('.smart-plate__sensor', { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, 0)
        .set('.smart-plate__lbl', { opacity: 0 }, 0)
        .to('.smart-plate__deck', { strokeDashoffset: 0, duration: 0.9 })
        .to('.smart-plate__pier', { scaleY: 1, duration: 0.7, stagger: 0.15 }, '-=0.3')
        .to('.smart-plate__hair', { opacity: 1, duration: 0.3 }, '<')
        .to('.smart-plate__sensor', { opacity: 1, scale: 1, duration: 0.4, stagger: 0.15 }, '+=0.1')
        .to('.smart-plate__pulse', { strokeDashoffset: 0, duration: 1.2 }, '+=0.1')
        .to('.smart-plate__lbl', { opacity: 1, duration: 0.4 }, '-=0.3')
        // l'illustrazione completa resta ferma per il resto dello stuck
        .to({}, { duration: 2 })
    },
    { end: '+=380%' }
  )

  return (
    <section className="smart" aria-labelledby="smart-title">
      <header ref={introRef} className="smart__intro">
        <div className="container">
          <p className="annotation annotation--accent">13–14 / 17 — Smart Road</p>
          <h2 id="smart-title" className="smart__title display">
            La strada che comunica
          </h2>
          <p className="smart__sub">
            Dalla superficie al digitale: l'infrastruttura diventa un sistema
            che dialoga, misura e prevede.
          </p>

          <div
            className="smart-intro__viz"
            role="img"
            aria-label="La strada fisica diventa una linea di dati: un nodo dialoga via segnale radio, uno misura con un piccolo istogramma, uno prevede con una linea di tendenza in salita."
          >
            <svg viewBox="0 0 1200 220" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
              <line className="smart-intro__road" x1="0" y1="140" x2="560" y2="140" />
              <line className="smart-intro__signal" x1="560" y1="140" x2="1200" y2="140" />
              <circle className="smart-intro__hinge" cx="560" cy="140" r="7" />

              {/* dialoga: nodo radio con impulso continuo */}
              <g className="smart-intro__ping-group">
                <circle className="smart-intro__ping smart-intro__ping--a" cx="680" cy="140" r="6" />
                <circle className="smart-intro__ping smart-intro__ping--b" cx="680" cy="140" r="6" />
              </g>
              <circle className="smart-intro__node smart-intro__node--dialoga" cx="680" cy="140" r="6" />
              <text className="smart-intro__lbl smart-intro__lbl--dialoga" x="680" y="176" textAnchor="middle">
                dialoga
              </text>

              {/* misura: piccolo istogramma di lettura */}
              <circle className="smart-intro__node smart-intro__node--misura" cx="880" cy="140" r="6" />
              <rect className="smart-intro__bar" x="864" y="126" width="8" height="14" />
              <rect className="smart-intro__bar" x="876" y="116" width="8" height="24" />
              <rect className="smart-intro__bar" x="888" y="106" width="8" height="34" />
              <text className="smart-intro__lbl smart-intro__lbl--misura" x="880" y="176" textAnchor="middle">
                misura
              </text>

              {/* prevede: linea di tendenza */}
              <circle className="smart-intro__node smart-intro__node--prevede" cx="1080" cy="140" r="6" />
              <path className="smart-intro__trend" d="M 1080 140 L 1128 96 M 1114 96 H 1128 V 110" />
              <text className="smart-intro__lbl smart-intro__lbl--prevede" x="1080" y="176" textAnchor="middle">
                prevede
              </text>
            </svg>
          </div>
        </div>
      </header>

      <div className="smart__stack">
        {PANELS.map((p) => {
          const isLight = p.id === 'smart-road'
          return (
            <article
              key={p.id}
              ref={panelRefs[p.id]}
              className={`smart__panel ${isLight ? 'smart__panel--light' : 'theme-night'}`}
              {...(isLight ? {} : { 'data-nav-theme': 'dark' })}
            >
              <div className="smart__layout container">
                <div className="smart__content">
                  <p className="annotation">{p.num} — {p.meta}</p>
                  <h3 className="smart__name display">{p.title}</h3>
                  <p className="smart__fact">{p.fact}</p>
                  <p className="smart__note annotation">{p.note}</p>
                </div>
                <div className="smart__plate">{p.plate}</div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Smart
