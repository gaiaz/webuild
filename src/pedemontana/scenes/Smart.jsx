import { useRef } from 'react'
import { useReveal } from '../../lib/useReveal'
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
        {/* portale free flow */}
        <path className="smart-plate__stroke smart-plate__stroke--accent" d="M 300 430 V 196 H 600 V 430" />
        {[348, 450, 552].map((x) => (
          <rect key={x} className="smart-plate__stroke" x={x - 20} y="204" width="40" height="28" />
        ))}
        {/* veicolo */}
        <rect className="smart-plate__stroke" x="128" y="386" width="104" height="44" rx="11" />
        {/* onde veicolo ↔ infrastruttura */}
        {[1, 2, 3].map((k) => (
          <path
            key={k}
            className="smart-plate__wave"
            d={`M ${236 + k * 20} ${376 - k * 22} a ${44 * k} ${44 * k} 0 0 1 ${20 * k} ${52 * k}`}
          />
        ))}
        <text className="smart-plate__lbl" x="450" y="160" textAnchor="middle">
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
        <line className="smart-plate__stroke" x1="60" y1="320" x2="840" y2="320" />
        {[210, 450, 690].map((x) => (
          <path
            key={x}
            className="smart-plate__stroke"
            d={`M ${x - 22} 320 L ${x - 38} 480 M ${x + 22} 320 L ${x + 38} 480`}
          />
        ))}
        <line className="smart-plate__hair" x1="40" y1="480" x2="860" y2="480" />
        {/* impulsi dei sensori */}
        <path
          className="smart-plate__stroke smart-plate__stroke--accent"
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
  const rootRef = useRef(null)
  useReveal(rootRef)

  return (
    <section ref={rootRef} className="smart" aria-labelledby="smart-title">
      <header className="smart__intro theme-night" data-nav-theme="dark">
        <div className="container">
          <p className="annotation annotation--accent" data-reveal>
            13–14 / 17 — Smart Road
          </p>
          <h2 id="smart-title" className="smart__title display" data-reveal>
            La strada che comunica
          </h2>
          <p className="smart__sub" data-reveal>
            Dalla superficie al digitale: l'infrastruttura diventa un sistema
            che dialoga, misura e prevede.
          </p>
        </div>
      </header>

      <div className="smart__stack">
        {PANELS.map((p) => (
          <article key={p.id} className="smart__panel theme-night" data-nav-theme="dark">
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
        ))}
      </div>
    </section>
  )
}

export default Smart
