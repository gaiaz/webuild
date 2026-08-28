// Dati Autostrada Pedemontana Lombarda — tratte B2 e C
// Fonte: factsheet testi Pedelombarda, versione italiana del 28 luglio 2026.
export const PEDE = {
  kmSistema: 157, // km di sistema viabilistico complessivo
  kmAsse: 87, // km di asse autostradale (5 tratte + tangenziali VA e CO)
  tratte: ['A', 'B1', 'B2', 'C', 'D'],
  kmBC: 26.2, // km tratte B2 + C (Lentate sul Seveso → Usmate Velate)
  pctInterrata: 85, // % di B2+C in trincea o galleria
  kmInterrata: 23.4, // km di infrastruttura interrata
  profonditaDiaframmi: 25, // m: profondità diaframmi idrofrese
  terreTotali: 17, // milioni di m³ di terreno scavato
  terreRiuso: 8, // milioni di m³ riutilizzati nell'opera
  ettariVerde: 4.7, // ettari di nuove aree verdi
  ettariTaglio: 2.3, // ~ superficie del taglio permanente (il verde è "più del doppio")
  linneFerroviarie: 3, // linee ferroviarie in esercizio attraversate
  personePicco: 1300, // persone coinvolte al picco dei lavori
  annoIcmesa: 1976,
}

// Capitoli macro-narrativi della scroll narration (id delle sezioni)
export const PEDE_CHAPTERS = [
  { id: 'territorio', num: '01', label: 'Territorio' },
  { id: 'sotto-la-superficie', num: '02', label: 'Sotto la superficie' },
  { id: 'ingegneria', num: '03', label: 'Ingegneria' },
  { id: 'ambiente', num: '04', label: 'Ambiente' },
  { id: 'smart-futuro', num: '05', label: 'Smart & Futuro' },
]

/* ─── Schema di esercizio dell'asse (viewBox 1200×380) ───
   Non è cartografia: è un diagramma di linea. L'asse è dritto — le distanze
   lungo x sono proporzionate, la geometria reale no. `row` alterna i nomi su
   due righe così le etichette lunghe non si accavallano mai. */
export const AXIS_Y = 200
export const AXIS_X0 = 90
export const AXIS_X1 = 1110

export const AXIS_NODES = [
  { id: 'cassano', label: 'Cassano Magnago · A8', x: 90, row: 1, anchor: 'start' },
  { id: 'lomazzo', label: 'Lomazzo · A9', x: 330, row: 2, anchor: 'middle' },
  { id: 'lentate', label: 'Lentate sul Seveso', x: 520, row: 1, anchor: 'middle' },
  { id: 'cesano', label: 'Cesano Maderno', x: 630, row: 2, anchor: 'middle' },
  { id: 'usmate', label: 'Usmate Velate', x: 850, row: 1, anchor: 'middle' },
  { id: 'osio', label: 'Osio Sotto · A4', x: 1110, row: 2, anchor: 'end' },
]

// Le due righe di etichette, sotto l'asse
export const LABEL_ROW_Y = { 1: 298, 2: 342 }

// Tratte come segmenti tra nodi consecutivi
export const AXIS_TRATTE = [
  { id: 'A', from: 0, to: 1 },
  { id: 'B1', from: 1, to: 2 },
  { id: 'B2', from: 2, to: 3 },
  { id: 'C', from: 3, to: 4 },
  { id: 'D', from: 4, to: 5 },
]

// Tangenziali: rami che salgono dall'asse, stesso angolo per leggerli come sistema
export const AXIS_BRANCHES = [
  { id: 'tang-va', label: 'Tang. Varese', x: 150, tipX: 208, tipY: 112 },
  { id: 'tang-co', label: 'Tang. Como', x: 372, tipX: 430, tipY: 112 },
]

// Le cinque province attraversate
export const PROVINCES = ['Varese', 'Como', 'Monza e Brianza', 'Milano', 'Bergamo']
