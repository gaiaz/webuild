import { useEffect } from 'react'
import { REDUCED_MOTION } from './lib/gsap'
import TraceNav from './components/TraceNav'
import ScrollHint from './components/ScrollHint'
import Opening from './components/chapters/Opening'
import Growth from './components/chapters/Growth'
import GlobalMap from './components/chapters/GlobalMap'
import Backlog from './components/chapters/Backlog'
import Finance from './components/chapters/Finance'
import WorldProjects from './components/chapters/WorldProjects'
import Italy from './components/chapters/Italy'
import NewInfra from './components/chapters/NewInfra'
import People from './components/chapters/People'
import Safety from './components/chapters/Safety'
import Climate from './components/chapters/Climate'
import Finale from './components/chapters/Finale'

const App = () => {
  useEffect(() => {
    document.documentElement.dataset.motion = REDUCED_MOTION ? 'reduced' : 'full'
  }, [])

  return (
    <>
      <TraceNav />
      <main>
        <h1 className="sr-only">Webuild FY2025 — I risultati prendono forma</h1>

        {/* 01 — GROWTH */}
        <div id="growth" data-chapter="growth">
          <Opening />
          <Growth />
          <GlobalMap />
        </div>

        {/* 02 — FUTURE */}
        <div id="future" data-chapter="future">
          <Backlog />
          <Finance />
        </div>

        {/* 03 — MILESTONES */}
        <div id="milestones" data-chapter="milestones">
          <WorldProjects />
          <Italy />
        </div>

        {/* 04 — NEW PROJECTS */}
        <div id="new-projects" data-chapter="new-projects">
          <NewInfra />
        </div>

        {/* 05 — PEOPLE & PLANET */}
        <div id="people-planet" data-chapter="people-planet">
          <People />
          <Safety />
          <Climate />
          <Finale />
        </div>
      </main>

      {/* Richiamo discreto: compare solo se ci si ferma a metà percorso,
          soprattutto sulle scene pinnate dove la pagina sembra ferma */}
      <ScrollHint mode="idle" />
    </>
  )
}

export default App
