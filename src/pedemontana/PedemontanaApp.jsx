import { useEffect } from 'react'
import { REDUCED_MOTION } from '../lib/gsap'
import TraceNav from '../components/TraceNav'
import SiteHeader from '../components/SiteHeader'
import { PEDE_CHAPTERS } from '../data/pedemontana'
import Hero from './scenes/Hero'
import Sistema from './scenes/Sistema'
import Funzione from './scenes/Funzione'
import TratteBC from './scenes/TratteBC'
import SottoSuperficie from './scenes/SottoSuperficie'
import Beneficio from './scenes/Beneficio'
import MetodoMilano from './scenes/MetodoMilano'
import Idrofrese from './scenes/Idrofrese'
import Ferrovie from './scenes/Ferrovie'
import Terre from './scenes/Terre'
import Bonifica from './scenes/Bonifica'
import Bosco from './scenes/Bosco'
import Smart from './scenes/Smart'
import Persone from './scenes/Persone'
import Impatto from './scenes/Impatto'
import Chiusura from './scenes/Chiusura'

const PedemontanaApp = () => {
  useEffect(() => {
    document.documentElement.dataset.motion = REDUCED_MOTION ? 'reduced' : 'full'
  }, [])

  return (
    <>
      <SiteHeader />
      <TraceNav chapters={PEDE_CHAPTERS} />
      <main id="top">
        <h1 className="sr-only">
          Sotto la superficie — Autostrada Pedemontana Lombarda
        </h1>

        {/* 01 — TERRITORIO */}
        <div id="territorio" data-chapter="territorio">
          <Hero />
          <Sistema />
          <Funzione />
        </div>

        {/* 02 — SOTTO LA SUPERFICIE */}
        <div id="sotto-la-superficie" data-chapter="sotto-la-superficie">
          <TratteBC />
          <SottoSuperficie />
          <Beneficio />
        </div>

        {/* 03 — INGEGNERIA */}
        <div id="ingegneria" data-chapter="ingegneria">
          <MetodoMilano />
          <Idrofrese />
          <Ferrovie />
        </div>

        {/* 04 — AMBIENTE */}
        <div id="ambiente" data-chapter="ambiente">
          <Terre />
          <Bonifica />
          <Bosco />
        </div>

        {/* 05 — SMART & FUTURO */}
        <div id="smart-futuro" data-chapter="smart-futuro">
          <Smart />
          <Persone />
          <Impatto />
          <Chiusura />
        </div>
      </main>
    </>
  )
}

export default PedemontanaApp
