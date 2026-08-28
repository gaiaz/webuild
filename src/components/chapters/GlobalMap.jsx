import { useMemo, useRef } from 'react'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import world from 'world-atlas/countries-110m.json'
import { useSceneTimeline } from '../../lib/useSceneTimeline'
import { FY2025, PRESENCE_COUNTRIES, ROUTES_FROM_MILAN, MILAN } from '../../data/fy2025'
import './GlobalMap.css'

const MAP_W = 1400
const MAP_H = 640

const GlobalMap = () => {
  const rootRef = useRef(null)

  const { landPath, presencePaths, routePaths, milanXY } = useMemo(() => {
    const countries = feature(world, world.objects.countries).features.filter(
      (c) => String(c.id) !== '010' // niente Antartide: mappa editoriale
    )
    const projection = geoNaturalEarth1().fitSize([MAP_W, MAP_H], {
      type: 'Sphere',
    })
    const path = geoPath(projection)
    const presenceIds = new Set(PRESENCE_COUNTRIES.map(String))
    return {
      landPath: countries.map((c) => path(c)).join(' '),
      presencePaths: countries
        .filter((c) => presenceIds.has(String(c.id)))
        .map((c) => ({ id: c.id, d: path(c) })),
      routePaths: ROUTES_FROM_MILAN.map((dest) =>
        path({ type: 'LineString', coordinates: [MILAN, dest] })
      ),
      milanXY: projection(MILAN),
    }
  }, [])

  useSceneTimeline(
    rootRef,
    ({ tl }) => {
      tl
        // Il 90% domina la scena, da solo
        .to({}, { duration: 0.7 })
        // Il dato finanziario si dissolve in geografia
        .to('.gmap__lead', { scale: 0.42, transformOrigin: 'left top', duration: 1 })
        .fromTo('.gmap__map', { opacity: 0 }, { opacity: 1, duration: 1 }, '<0.3')
        // I paesi si illuminano
        .fromTo(
          '.gmap__country',
          { opacity: 0 },
          { opacity: 1, duration: 0.5, stagger: 0.07 },
          '-=0.3'
        )
        // Le rotte si tracciano da Milano
        .set('.gmap__route', { strokeDasharray: 3000, strokeDashoffset: 3000 }, 0)
        .fromTo('.gmap__milan', { scale: 0, transformOrigin: 'center' }, { scale: 1, duration: 0.3 })
        .to('.gmap__route', { strokeDashoffset: 0, duration: 1.4, stagger: 0.12 })
        .fromTo('.gmap__kicker', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .to({}, { duration: 0.6 })
    },
    { end: '+=380%' }
  )

  return (
    <section
      ref={rootRef}
      className="gmap theme-night"
      data-nav-theme="dark"
      aria-labelledby="gmap-title"
    >
      <div className="gmap__inner container">
        <header className="gmap__lead">
          <p className="annotation annotation--accent">01 · Solidità globale</p>
          <h2 id="gmap-title" className="gmap__title">
            <span className="gmap__figure big-number">
              &gt;{FY2025.lowRiskShare}
              <span className="gmap__pct">%</span>
            </span>
            <span className="gmap__caption">
              dei ricavi generato in <strong>paesi a basso rischio</strong>
            </span>
          </h2>
        </header>

        <div
          className="gmap__map"
          role="img"
          aria-label="Mappa del mondo: i paesi in cui Webuild opera si illuminano, collegati da rotte che partono dall'Italia."
        >
          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden="true">
            <defs>
              <pattern id="gmap-dots" width="7" height="7" patternUnits="userSpaceOnUse">
                <circle cx="1.4" cy="1.4" r="1.15" className="gmap__dot" />
              </pattern>
              <mask id="gmap-land">
                <path d={landPath} fill="#fff" />
              </mask>
            </defs>
            <rect
              width={MAP_W}
              height={MAP_H}
              fill="url(#gmap-dots)"
              mask="url(#gmap-land)"
            />
            {presencePaths.map((c) => (
              <path key={c.id} className="gmap__country" d={c.d} />
            ))}
            {routePaths.map((d, i) => (
              <path key={i} className="gmap__route" d={d} />
            ))}
            <circle
              className="gmap__milan"
              cx={milanXY[0]}
              cy={milanXY[1]}
              r="7"
            />
          </svg>
        </div>

        <p className="gmap__kicker kicker">
          Una crescita globale. <em>Costruita su basi solide.</em>
        </p>
      </div>
    </section>
  )
}

export default GlobalMap
