/**
 * Prepara uno o più tratti SVG per il disegno progressivo, a posizione 0
 * della timeline. Dopo `prepStroke` basta un normale
 * `tl.to(sel, { strokeDashoffset: 0, duration })` per disegnarli.
 *
 * Perché non `pathLength="1"` + dasharray/dashoffset 1→0 (il pattern usato
 * altrove nel progetto): GSAP non interpola fra 1 e 0 su strokeDashoffset,
 * salta direttamente al valore finale — il tratto compare invece di
 * comporsi. Si passa quindi la lunghezza reale del path.
 *
 * Il margine extra copre il `stroke-linecap: round`: senza, a tratto
 * nascosto il cap resta visibile come un punto all'estremità.
 */
export function prepStroke(tl, target, root = document) {
  const els =
    typeof target === 'string' ? [...root.querySelectorAll(target)] : [target].flat()

  els.forEach((el) => {
    const len = el.getTotalLength() + 12
    tl.set(el, { strokeDasharray: len, strokeDashoffset: len }, 0)
  })
  return tl
}
