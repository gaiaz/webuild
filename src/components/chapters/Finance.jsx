import { useRef } from 'react'
import { useReveal } from '../../lib/useReveal'
import { FY2025 } from '../../data/fy2025'
import './Finance.css'

const ROWS = [
  {
    label: 'Posizione di cassa netta normalizzata',
    value: `€${FY2025.netCash} mln`,
    note: 'liquidità che sostiene gli investimenti',
  },
  {
    label: 'Rating — Fitch & S&P',
    value: 'BB+',
    note: 'outlook stabile per entrambe le agenzie',
  },
  {
    label: 'Nuove obbligazioni emesse',
    value: `€${FY2025.bonds} mln`,
    note: 'accesso continuo al mercato dei capitali',
  },
]

/**
 * 02b — Solidità finanziaria. Ritmo lento, registro istituzionale:
 * righe da quotidiano finanziario, filetti sottili, nessuna dashboard.
 */
const Finance = () => {
  const rootRef = useRef(null)
  useReveal(rootRef)

  return (
    <section ref={rootRef} className="finance" aria-labelledby="finance-title">
      <div className="container">
        <header className="finance__head" data-reveal>
          <p className="annotation annotation--accent">02 · Solidità finanziaria</p>
          <h2 id="finance-title" className="finance__title">
            Una struttura che regge,
            <br />
            anche nei numeri più silenziosi.
          </h2>
        </header>

        <dl className="finance__rows">
          {ROWS.map((row) => (
            <div key={row.label} className="finance__row" data-reveal>
              <dt className="finance__label annotation">{row.label}</dt>
              <dd className="finance__value">
                <span className="finance__figure">{row.value}</span>
                <span className="finance__note">{row.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default Finance
