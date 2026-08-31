# Webuild FY2025 — I risultati prendono forma

Data story interattiva longform sui risultati consolidati Webuild FY2025.
Prototipo editoriale non ufficiale (concept). Repo: https://github.com/cmarino-hdraadv/webuild

## Comandi

```bash
npm install      # dipendenze
npm run dev      # dev server Vite su :5173
npm run build    # build produzione (due entry: index.html + pedemontana.html)
npm run preview  # serve dist/ su :4173 — com'è servito online
```

`.claude/launch.json` ha due config per il Browser pane: `webuild-dev` (sviluppo)
e `webuild-preview` (build di produzione, per verificare prima di deployare).

**Node**: installato con Homebrew (v26). Se `node`/`npm` non si trovano, sono in
`/opt/homebrew/bin`. Se il build fallisce con `Cannot find module
@rollup/rollup-darwin-arm64`: `rm -rf node_modules package-lock.json && npm install`
(bug npm sulle optional deps quando le dipendenze arrivano da un'altra macchina).

## Stack

- **React 18 + Vite 5** (JSX, no TypeScript)
- **GSAP 3 + ScrollTrigger** per tutta la scroll choreography (pin + scrub)
- **d3-geo + topojson-client + world-atlas** solo per le mappe (mondo e Italia)
- CSS puro con custom properties, **BEM**, un file CSS co-locato per componente
- Font: **Roboto variable** (display, `font-stretch` 76–82% per i titoli — asse
  wdth 75–100) + **Roboto Mono** (annotazioni tecniche), da Google Fonts nelle
  due entry HTML. Sono i font usati da webuildgroup.com: la scelta è di fedeltà
  al brand, non estetica. Non reintrodurre Archivo/IBM Plex Mono.

## Concept creativo

**"La linea che costruisce"** — un'unica linea rossa attraversa tutta l'esperienza:
disegna l'apertura, diventa curva dei ricavi → impalcato di un viadotto → rotte
sulla mappa mondiale → ferrovia sull'Italia → la "A" del rating CDP → chiude il finale.
La stessa linea è la **nav persistente dei 5 capitoli** (`TraceNav`).

Metafora ricorrente: **DATO → STRUTTURA → INFRASTRUTTURA**. Ogni scena trasforma
la visualizzazione dati in geometria costruttiva (barre→pile di viadotto,
skyline dai valori di backlog, punti→persone, tally marks→ore di formazione).
Mai KPI card, mai estetica dashboard/SaaS.

## Struttura

```
src/
  data/fy2025.js          # TUTTI i numeri, progetti, capitoli, paesi, rotte
  lib/gsap.js             # registrazione plugin + REDUCED_MOTION + refresh post-load
  lib/useSceneTimeline.js # hook per scene pinnate con timeline scrubbed + fmtInt
  lib/useReveal.js        # reveal semplice per sezioni non pinnate ([data-reveal])
  styles/tokens.css       # design tokens (colori Webuild, scala fs-1..13, spacing)
  styles/base.css         # reset, .container, primitivi (.annotation, .kicker,
                          #   .big-number, .display, .theme-night, .theme-forest)
  components/TraceNav.*   # nav-linea persistente (verticale ≥1280px, orizzontale sotto)
  components/chapters/    # 12 scene, in ordine di scroll:
    Opening    (pin)  2025 + linea che si traccia + titolo
    Growth     (pin)  €13,6 mld ricavi: barre 2021-25 → viadotto, archi = EBITDA €1,2
    GlobalMap  (pin)  >90% ricavi low-risk: mappa mondo a punti, paesi + rotte da Milano
    Backlog    (pin)  skyline 3 strati: 50,9 costruzioni / 13,2 nuovi ordini / 58,4 totale
    Finance           registro editoriale: cassa 772M, BB+ stabile, bond 450M
    WorldProjects     4 pannelli sticky-stack (Riyadh, North East Link, Riachuelo, GERD)
    Italy             mappa sticky dx + step sx (Brennero, PA-CT-ME, Genova, Metro C)
    NewInfra          4 tipologie con glifi stroke-drawn (ospedali/metro/ferrovie/strade)
    People     (pin)  ~95.000 → campo di 1.188 punti (1 punto ≈ 80 persone)
    Safety     (pin)  815.000 ore = 163 tally marks (1 segno = 5.000 ore) + 250k meeting
    Climate    (pin)  la linea disegna la "A" del rating CDP (tema forest)
    Finale     (pin)  la linea si completa: 2025 / claim / WEBUILD / crediti
```

App.jsx raggruppa le scene nei **5 capitoli macro** con id: `growth`, `future`,
`milestones`, `new-projects`, `people-planet` (usati da TraceNav per jump e attivo).

## Design system (VINCOLANTE — sistema personale di Gaia)

- **Breakpoint**: 375 / 768 / 1280 / 1512 / 1920, mobile-first
- **Tipografia fluida**: SOLO i token `--fs-1 … --fs-13` in tokens.css (clamp 375→1920).
  Mai font-size hardcoded nei componenti.
- **Margini container**: 16px mobile / 40px tablet / 80px desktop, max-width 1440 centrato
  (già incapsulati in `.container`)
- **Colori — palette Webuild ufficiale**, rilevata dai colori computati di
  webuildgroup.com. Primitive `--wb-*` solo in tokens.css; nei componenti solo
  token semantici:
  - `--color-accent` = **#db002f** (rosso Webuild)
  - `--color-accent-on-dark` = **#ee2148**, obbligatorio per il **testo piccolo
    su fondo scuro**: il rosso brand su nero dà 4,05:1, sotto AA. Non usare
    `--color-accent` per le annotazioni dentro `.theme-night`/`.theme-forest`.
  - `--color-bg-night` = **#000** nero puro · `--color-bg-base` = bianco
  - testo `#1f1f1f`, secondario `#5f5f5f`, su scuro `#a0a0a0`
- **BEM** rigoroso: `.blocco__elemento--modificatore`, kebab-case, un solo livello
  di elemento, niente selettori annidati per specificità
- HTML semantico: un solo h1 (sr-only in App), h2 per sezione con `aria-labelledby`,
  SVG decorativi `aria-hidden`, SVG informativi `role="img"` + `aria-label`

## Pattern GSAP (leggere prima di toccare le animazioni)

- Scene pinnate: `useSceneTimeline(rootRef, ({tl}) => {...}, {end: '+=XXX%'})` —
  crea timeline scrubbed dentro `gsap.context`, pin sulla sezione.
- **Tutti i `.set()` di stato iniziale (strokeDasharray ecc.) vanno a posizione `0`
  della timeline** (`tl.set(..., 0)`), altrimenti l'elemento è visibile prima del suo momento.
- **Header delle scene pinnate sempre visibili da subito** (niente fade-in iniziale
  dell'header) per evitare viewport vuote all'ingresso del pin.
- Trasformazioni SVG: usare `transformOrigin: '50% 100%'` dentro il tween GSAP,
  MAI `style={{transformOrigin}}` inline sugli elementi SVG (origini sballate).
- `lib/gsap.js` fa `ScrollTrigger.refresh()` 300ms dopo `window load` — necessario,
  senza questo i pin partono con start sbagliati (layout non assestato). Non rimuoverlo.
- In dev `window.__ST` espone ScrollTrigger per debug da console.
- **Reduced motion**: se `prefers-reduced-motion`, nessuna timeline viene creata;
  `[data-motion='reduced']` in CSS rimette le fasi in flusso statico. Ogni nuova
  scena deve funzionare anche così.
- Disegno progressivo tratti: preferire `pathLength="1"` sull'elemento SVG +
  dasharray/dashoffset 0..1 (evita di calcolare lunghezze reali).

## Seconda pagina — Pedemontana Lombarda (`/pedemontana.html`)

Scroll narration "Sotto la superficie" sulle tratte B2 e C, claim **MY NEW WAY**.
Entry Vite separata (vedi `vite.config.js`), stessi token e stessi pattern GSAP.

```
pedemontana.html            # entry
src/data/pedemontana.js     # numeri, capitoli, schema dell'asse
src/components/SiteHeader.* # logo fisso in alto a destra (condiviso, non duplicare)
src/pedemontana/
  main.jsx · PedemontanaApp.jsx
  scenes/                   # 16 scene, in ordine di scroll:
    Hero (pin) · Sistema (pin) · Funzione (pin) · TratteBC (pin)
    SottoSuperficie (pin, night) · Beneficio · MetodoMilano (pin)
    Idrofrese (pin) · Ferrovie (pin) · Terre (pin) · Bonifica
    Bosco (pin, forest) · Smart (sticky-stack, night) · Persone (pin)
    Impatto · Chiusura (pin)
```

Capitoli macro: `territorio`, `sotto-la-superficie`, `ingegneria`, `ambiente`, `smart-futuro`.

**Logo**: `public/webuild-logo.svg` (Wikimedia Commons, pubblico dominio).
Grande in cima all'apertura, poi fisso piccolo in alto a destra, di nuovo grande
nell'endframe. `SiteHeader` si ritira sulle sezioni con `data-hide-header`
(hero e chiusura) misurando il **pin-spacer** dal vivo, non con start/end
di ScrollTrigger — su sezioni pinnate quella geometria è sbagliata.

## Insidie GSAP scoperte su questa pagina

- **`strokeDashoffset` non si interpola fra 1 e 0**: con `pathLength="1"` GSAP
  salta al valore finale e il tratto *compare* invece di disegnarsi. Usare
  `prepStroke(tl, sel, root)` in `lib/drawStroke.js`, che passa la lunghezza
  reale del path. Il margine extra copre il `stroke-linecap: round`, che
  altrimenti lascia un punto visibile a tratto nascosto.
- **Un elemento non può stare in due timeline**: se la timeline d'ingresso fa
  `.from(el, {opacity: 0})` e quella scrubbed anima lo stesso `el`, lo scrub
  registra 0 come valore di partenza e l'elemento resta invisibile. Assegnare
  ogni elemento a una sola delle due (o usare `fromTo` con valori espliciti).
- **`vector-effect: non-scaling-stroke` + `preserveAspectRatio="none"`**:
  combinazione da evitare sui tratti animati con dash.
- `.annotation--accent` veniva schiacciato da `.theme-night .annotation`
  (specificità 0,2,0 vs 0,1,0): risolto in `base.css` con regole scoped.

## Stato lavoro (aggiornato al 28/08/2026)

**FY2025** — fatto e verificato visivamente (desktop): tutte le 12 scene, nav,
jump tra capitoli, tema chiaro/scuro della nav sulle sezioni night/forest.

**Pedemontana** — tutte le 16 scene verificate a schermo. Rifatte su feedback di
Gaia: schema dell'asse (le etichette si accavallavano), scena Funzione (i
raccordi non toccavano l'asse), pannelli Smart (testo schiacciato in basso),
endframe (ora la linea ripercorre le geometrie della storia e si distende).

**Decisioni utente da rispettare:**
1. **TESTI**: Gaia deve sostituire i copy. Stanno in `src/data/fy2025.js` (numeri,
   progetti, fact) e inline nei componenti (headline e kicker). Proposta aperta:
   centralizzare tutto in un `copy.js` quando arrivano i testi nuovi.
2. **IMMAGINI in standby**: niente fotografie per ora — le tavole progetto sono
   SVG "engineering plates" con slot pronti (`.wproj__plate` → sostituibile con
   `<img>`). **Richiedere a Gaia** se inserire foto ufficiali Webuild DOPO che
   avrà sostituito i testi. Non scaricare immagini senza il suo ok esplicito.
3. **Mobile**: "sticazz del mobile" — regge (verificato sommariamente a 375px)
   ma non è priorità; non investirci tempo se non richiesto.
4. Feedback recepito: skyline Backlog ridisegnata (setback, telai, gru a traliccio),
   niente sovrapposizioni testo (stat in flusso, mai overlay assoluti sui titoli).

**Git**: repo `origin` = https://github.com/cmarino-hdraadv/webuild.git, branch `main`
(migrato da gaiaz/webuild il 31/08/2026, tenuto come remote `gaiaz-old` per
riferimento). Gaia vuole commit + push dei progressi ("pusha e committa tutto qui").

## Deploy (Vercel)

URL produzione: https://webuild-drab.vercel.app — `vercel.json` in repo fissa
framework `vite`, build `npm run build`, output `dist`.

**Risolto il 28/08/2026 — entrambe le pagine sono online** (`/` e
`/pedemontana.html`, HTTP 200, bundle `main-*.js` e `pedemontana-*.js`).

**La causa vera** (la diagnosi precedente — "integrazione Git scollegata" — era
sbagliata): la build pipeline *del solo progetto webuild* si è piantata. Ogni
deploy creato dopo le 16:15 restava in stato `UNKNOWN` con durata `?`, cioè il
build non partiva proprio. Verificato che non fosse colpa nostra:

- `npm run build` in locale produce correttamente due entry
- status page Vercel: nessun incidente
- **altri progetti dello stesso account** (`noto`) buildavano in 20s nella stessa
  finestra temporale → problema isolato a questo progetto, non all'account

**La soluzione che ha funzionato — deploy prebuilt**, che carica il build fatto
in locale e salta del tutto la pipeline di Vercel:

```bash
vercel build --prod                    # build nel formato .vercel/output
vercel deploy --prebuilt --prod --yes  # upload; aliasa da solo l'URL pubblico
```

Attenzione: `vercel build` e `vercel deploy --prebuilt` devono avere lo **stesso
target**. Senza `--prod` sul primo, il secondo fallisce con
"prebuilt output was built with target environment preview".

Se serve rilinkare la cartella: `vercel link --yes --project webuild` (crea
`.vercel/`, già in `.gitignore`), poi `vercel pull --yes` per le impostazioni.

Se in futuro il push su `main` non aggiorna il sito, prima di dare la colpa al
repo controllare `vercel ls webuild`: se gli ultimi deploy sono `UNKNOWN` con
durata `?`, è la pipeline di Vercel bloccata → usare la via prebuilt qui sopra.

Per capire quale versione è online:
```bash
curl -s https://webuild-drab.vercel.app/ | grep -o 'assets/[a-zA-Z0-9_-]*\.js'
```
Se compare `index-*.js` è il build vecchio; se compaiono `main-*.js` e
`pedemontana-*.js` è aggiornato.

## Insidie note

- **Una sezione pinnata non deve mai essere più alta della viewport**: la parte
  che eccede è irraggiungibile (il pin la tiene ferma) e lo scroll sembra
  bloccato. Successo sull'endframe Pedemontana: contenuto 1285px su viewport
  1165. Soluzione applicata: i crediti fuori dal pin in un footer normale, e
  misure limitate anche in vh (`min(var(--fs-3), 13vh)`, `height: min(22vh, 280px)`),
  non solo dalla scala tipografica fluida che guarda solo la larghezza.
- **`vite.config.js` è ESM** (`"type": "module"` in package.json): niente
  `__dirname`, usare `fileURLToPath(new URL(file, import.meta.url))`. Con
  `__dirname` funziona solo per lo shim che Vite inietta nel config — fragile.

- Gli elementi pinnati sono `position: fixed` durante il pin: `getBoundingClientRect().top + scrollY` NON dà la posizione nel documento. Per misurare, usare i `.pin-spacer`.
- `html { scroll-behavior: smooth }` è attivo: nei test via console fare prima `document.documentElement.style.scrollBehavior='auto'`.
- Il resize del viewport ricalcola tutti i pin: se il layout sembra rotto dopo un resize, ricaricare la pagina prima di indagare.
- La mappa mondo esclude l'Antartide (filtro id '010' in GlobalMap).
- Dati: usare ESATTAMENTE i valori di `fy2025.js` (vengono dal brief FY2025); lo storico ricavi 2021-24 in `REVENUE_HISTORY` è approssimato per la scena Growth.
