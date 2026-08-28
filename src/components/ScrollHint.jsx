import { useEffect, useRef, useState } from 'react'
import { REDUCED_MOTION } from '../lib/gsap'
import './ScrollHint.css'

/**
 * Invito allo scroll, condiviso fra le due pagine. Due modalità:
 *
 * - `intro` (default): sta in fondo all'apertura, visibile finché non si
 *   scrolla. Dice "questa pagina si scorre".
 * - `idle`: vive a livello di pagina, fisso in basso. Compare solo se
 *   l'utente resta fermo qualche secondo dopo aver già iniziato a scorrere.
 *   Serve sulle scene pinnate, dove la pagina sembra bloccata perché il
 *   contenuto resta fermo: il richiamo chiarisce che si va avanti scrollando.
 *
 * Grafica: una miniatura della "linea che costruisce" — un tratto rosso che
 * percorre di continuo una guida verticale verso il basso.
 * Interazione: è un <button> vero, cliccabile e raggiungibile da tastiera;
 * un clic fa avanzare di una schermata.
 *
 * L'animazione è in CSS e non in GSAP: le scene sono pinnate con timeline
 * scrubbed e un elemento animato da entrambe resterebbe bloccato sul valore
 * iniziale (vedi CLAUDE.md → insidie GSAP).
 *
 * @param {string} label - testo dell'invito (solo in modalità intro)
 * @param {'intro'|'idle'} mode
 * @param {number} idleAfter - ms di immobilità prima di comparire (modalità idle)
 */
const ScrollHint = ({ label, mode = 'intro', idleAfter = 4000 }) => {
  const [visible, setVisible] = useState(mode === 'intro')
  const timer = useRef(null)

  useEffect(() => {
    // Modalità intro: presente all'inizio, si ritira al primo scroll
    if (mode === 'intro') {
      const onScroll = () => setVisible(window.scrollY <= 80)
      onScroll()
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll)
    }

    // Modalità idle: compare dopo una pausa, sparisce appena si riprende
    const atEnd = () =>
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 200

    const arm = () => {
      clearTimeout(timer.current)
      setVisible(false)
      // Non in cima (là c'è già l'intro) e non a fine pagina: lì non serve
      if (window.scrollY < 400 || atEnd()) return
      timer.current = setTimeout(() => setVisible(true), idleAfter)
    }

    arm()
    window.addEventListener('scroll', arm, { passive: true })
    return () => {
      clearTimeout(timer.current)
      window.removeEventListener('scroll', arm)
    }
  }, [mode, idleAfter])

  const handleClick = () => {
    window.scrollBy({
      top: window.innerHeight * 0.9,
      behavior: REDUCED_MOTION ? 'auto' : 'smooth',
    })
  }

  const isIdle = mode === 'idle'
  const text = isIdle ? 'Continua a scorrere' : label

  return (
    <button
      type="button"
      className={[
        'scroll-hint',
        isIdle ? 'scroll-hint--idle' : 'scroll-hint--intro',
        visible ? '' : 'scroll-hint--gone',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
      tabIndex={visible ? 0 : -1}
      aria-hidden={visible ? undefined : 'true'}
      aria-label={`${text}. Attiva per scorrere alla sezione successiva.`}
    >
      <span className="scroll-hint__label annotation">{text}</span>
      <span className="scroll-hint__rail" aria-hidden="true">
        <span className="scroll-hint__trace" />
      </span>
    </button>
  )
}

export default ScrollHint
