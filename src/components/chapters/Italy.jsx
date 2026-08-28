import { useEffect, useMemo, useRef, useState } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'
import { gsap, ScrollTrigger, REDUCED_MOTION } from '../../lib/gsap'
import { ITALY_PROJECTS } from '../../data/fy2025'
import './Italy.css'

const MAP_W = 520
const MAP_H = 640

/**
 * 03b — Italia. La mappa globale collassa sull'Italia:
 * mappa sticky a destra, i progetti scorrono a sinistra;
 * la linea-rotta diventa geometria ferroviaria tra i cantieri.
 */
const Italy = () => {
  const rootRef = useRef(null)
  const [active, setActive] = useState(0)

  const { italyPath, nodes, routeD } = useMemo(() => {
    const countries = feature(world, world.objects.countries).features
    const italy = countries.find((c) => String(c.id) === '380')
    const projection = geoMercator().fitExtent(
      [
        [30, 30],
        [MAP_W - 30, MAP_H - 30],
      ],
      italy
    )
    const path = geoPath(projection)
    const pts = ITALY_PROJECTS.map((p) => ({ ...p, xy: projection(p.coords) }))
    return {
      italyPath: path(italy),
      nodes: pts,
      routeD: `M ${pts.map((p) => `${p.xy[0]} ${p.xy[1]}`).join(' L ')}`,
    }
  }, [])

  useEffect(() => {
    if (REDUCED_MOTION) return undefined
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.italy__step').forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // La rotta si costruisce fino al progetto attivo
  const routeProgress = (active + 1) / ITALY_PROJECTS.length

  return (
    <section ref={rootRef} className="italy" aria-labelledby="italy-title">
      <div className="container">
        <header className="italy__head">
          <p className="annotation annotation--accent">03 · Italia</p>
          <h2 id="italy-title" className="italy__title display">
            La scala si fa vicina
          </h2>
        </header>

        <div className="italy__layout">
          <div className="italy__steps">
            {nodes.map((p, i) => (
              <article
                key={p.id}
                className={`italy__step ${i === active ? 'italy__step--active' : ''}`}
              >
                <p className="annotation">{p.meta}</p>
                <h3 className="italy__name">{p.name}</h3>
                <p className="annotation annotation--accent">{p.place}</p>
                <p className="italy__fact">{p.fact}</p>
              </article>
            ))}
          </div>

          <div className="italy__map-wrap">
            <div
              className="italy__map"
              role="img"
              aria-label="Mappa dell'Italia con i quattro cantieri principali collegati da una linea ferroviaria."
            >
              <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden="true">
                <path className="italy__shape" d={italyPath} />
                <path
                  className="italy__route"
                  d={routeD}
                  pathLength="1"
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: 1 - routeProgress,
                  }}
                />
                {nodes.map((p, i) => (
                  <g key={p.id} className={i <= active ? 'italy__node italy__node--on' : 'italy__node'}>
                    <circle cx={p.xy[0]} cy={p.xy[1]} r="9" className="italy__node-ring" />
                    <circle cx={p.xy[0]} cy={p.xy[1]} r="4" className="italy__node-dot" />
                  </g>
                ))}
              </svg>
              <p className="italy__map-caption annotation">
                {String(active + 1).padStart(2, '0')} — {nodes[active].name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Italy
