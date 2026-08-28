// Dati consolidati Webuild FY2025 (fonte: brief risultati FY2025)
export const FY2025 = {
  revenue: { value: 13.6, unit: '€ mld', delta: '+15% vs 2024' },
  ebitda: { value: 1.2, unit: '€ mld', delta: '+18% vs 2024' },
  lowRiskShare: 90, // % ricavi in paesi a basso rischio
  backlogTotal: 58.4,
  backlogConstruction: 50.9,
  newOrders: 13.2,
  netCash: 772, // € mln, posizione di cassa netta normalizzata
  rating: 'BB+ outlook stabile (Fitch & S&P)',
  bonds: 450, // € mln nuove obbligazioni
  people: 95000,
  nationalities: 125,
  newHires: 15000,
  safetyTrainingHours: 815000,
  safetyMeetings: 250000,
  cdpRating: 'A',
}

// Storico ricavi per la scena Growth (bars → viadotto). Valori € mld.
export const REVENUE_HISTORY = [
  { year: 2021, value: 6.7 },
  { year: 2022, value: 8.2 },
  { year: 2023, value: 10.0 },
  { year: 2024, value: 11.8 },
  { year: 2025, value: 13.6 },
]

// Capitoli macro-narrativi → id delle sezioni di apertura
export const CHAPTERS = [
  { id: 'growth', num: '01', label: 'Growth' },
  { id: 'future', num: '02', label: 'Future' },
  { id: 'milestones', num: '03', label: 'Milestones' },
  { id: 'new-projects', num: '04', label: 'New Projects' },
  { id: 'people-planet', num: '05', label: 'People & Planet' },
]

// Progetti globali — un anno attraverso il mondo
export const WORLD_PROJECTS = [
  {
    id: 'riyadh',
    name: 'Riyadh Metro',
    place: 'Riad, Arabia Saudita',
    coords: [46.7, 24.7],
    fact: 'Una delle più grandi reti metropolitane driverless al mondo, in pieno esercizio.',
    meta: 'Metropolitana · Linea 3 · in esercizio',
    plate: 'metro',
  },
  {
    id: 'nel',
    name: 'North East Link',
    place: 'Melbourne, Australia',
    coords: [145.1, -37.75],
    fact: 'Tunnel stradali gemelli scavati con alcune delle TBM più grandi dell’emisfero sud.',
    meta: 'Infrastruttura stradale · in costruzione',
    plate: 'tunnel',
  },
  {
    id: 'riachuelo',
    name: 'Sistema Riachuelo',
    place: 'Buenos Aires, Argentina',
    coords: [-58.4, -34.65],
    fact: 'Il risanamento idrico che restituisce il fiume a oltre 4 milioni di persone.',
    meta: 'Opera idraulica · completata',
    plate: 'water',
  },
  {
    id: 'gerd',
    name: 'Grand Ethiopian Renaissance Dam',
    place: 'Benishangul-Gumuz, Etiopia',
    coords: [35.1, 11.2],
    fact: 'La più grande diga d’Africa: circa 5.000 MW di energia rinnovabile.',
    meta: 'Diga · inaugurata 2025',
    plate: 'dam',
  },
]

// Progetti Italia
export const ITALY_PROJECTS = [
  {
    id: 'brennero',
    name: 'Galleria di Base del Brennero',
    place: 'Alto Adige / Tirolo',
    coords: [11.5, 46.9],
    fact: 'Il collegamento ferroviario sotterraneo più lungo al mondo: 64 km sotto le Alpi.',
    meta: 'Ferrovia · galleria di base',
  },
  {
    id: 'pcm',
    name: 'Palermo–Catania–Messina',
    place: 'Sicilia',
    coords: [14.5, 37.6],
    fact: 'La nuova alta capacità siciliana: cantieri aperti lungo tutta la dorsale.',
    meta: 'Ferrovia · alta capacità',
  },
  {
    id: 'genova',
    name: 'Diga Foranea di Genova',
    place: 'Genova, Liguria',
    coords: [8.9, 44.4],
    fact: 'La diga più profonda d’Europa, costruita su fondali fino a 50 metri.',
    meta: 'Opera marittima · in costruzione',
  },
  {
    id: 'metroc',
    name: 'Metro C — Roma',
    place: 'Roma, Lazio',
    coords: [12.5, 41.9],
    fact: 'Nuove stazioni nel cuore archeologico della capitale.',
    meta: 'Metropolitana · nuove stazioni',
  },
]

// Nuove infrastrutture — tipologie
export const INFRA_TYPES = [
  { id: 'hospitals', label: 'Ospedali', note: 'Sanità e spazi di cura' },
  { id: 'metros', label: 'Metropolitane', note: 'Mobilità urbana sotterranea' },
  { id: 'railways', label: 'Ferrovie', note: 'Alta velocità e alta capacità' },
  { id: 'roads', label: 'Strade', note: 'Reti e collegamenti viari' },
]

// Paesi illuminati nella mappa globale (id numerici world-atlas / ISO 3166-1)
export const PRESENCE_COUNTRIES = [
  840, // USA
  124, // Canada
  36, // Australia
  682, // Arabia Saudita
  784, // Emirati Arabi Uniti
  380, // Italia
  250, // Francia
  756, // Svizzera
  40, // Austria
  208, // Danimarca
  578, // Norvegia
  642, // Romania
  300, // Grecia
  32, // Argentina
  231, // Etiopia
  834, // Tanzania
  268, // Georgia
  608, // Filippine
  702, // Singapore
]

// Rotte dalla sede di Milano verso i principali hub
export const ROUTES_FROM_MILAN = [
  [-95, 38], // Nord America
  [46.7, 24.7], // Riad
  [145.1, -37.7], // Melbourne
  [-58.4, -34.6], // Buenos Aires
  [35.1, 11.2], // Etiopia
  [121, 14.6], // Manila
]

export const MILAN = [9.19, 45.46]
