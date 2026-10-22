// Cálculo de materiales para cielo raso de yeso cartón
// Sistema: principales (colgadas de la losa con cuelgas de ángulo) + omegas (donde se atornilla la lámina)
// Principales paralelas al largo del cuarto; omegas perpendiculares a ellas.

const LAMINA_ANCHO = 1.22;
const LAMINA_LARGO = 2.44;

function calcularCielo(p) {
  const L = Math.max(p.largo, p.ancho);
  const A = Math.min(p.largo, p.ancho);
  const area = L * A;
  const perimetro = 2 * (L + A);
  const desp = p.desperdicio / 100;

  // Líneas interiores (los bordes los recibe el ángulo perimetral)
  const nPrincipales = Math.max(1, Math.ceil(A / p.sepPrincipales) - 1);
  const nOmegas = Math.max(1, Math.ceil(L / p.sepOmegas) - 1);

  const mPrincipales = nPrincipales * L;
  const mOmegas = nOmegas * A;

  const piezas = (metros, largoPieza) => Math.ceil((metros * (1 + desp)) / largoPieza);

  // Láminas
  const areaLamina = LAMINA_ANCHO * LAMINA_LARGO;
  const laminas = Math.ceil((area * (1 + desp)) / areaLamina);

  // Cuelgas de ángulo: una cada sepCuelgas sobre cada principal
  const cuelgasPorPrincipal = Math.max(2, Math.ceil(L / p.sepCuelgas));
  const cuelgas = nPrincipales * cuelgasPorPrincipal;
  const largoCuelga = p.descuelgue + p.extraCuelga; // descuelgue + lo que se fija a losa y principal
  let anguloCuelgas;
  if (largoCuelga <= p.largoAngulo) {
    const cuelgasPorPieza = Math.floor(p.largoAngulo / largoCuelga);
    anguloCuelgas = Math.ceil(cuelgas / cuelgasPorPieza);
  } else {
    anguloCuelgas = Math.ceil((cuelgas * largoCuelga) / p.largoAngulo);
  }
  const mCuelgas = cuelgas * largoCuelga;

  const anguloPerimetral = piezas(perimetro, p.largoAngulo);

  // Tornillos lámina → omega: cada 0,30 m sobre cada omega que cruza la lámina
  const omegasPorLamina = Math.ceil(LAMINA_LARGO / p.sepOmegas) + 1;
  const tornillosPorFila = Math.ceil(LAMINA_ANCHO / 0.3) + 1;
  const tornillosLamina = Math.ceil(laminas * omegasPorLamina * tornillosPorFila * 1.1);

  // Tornillos estructura (framer): 2 por cruce omega-principal, 1 por extremo sobre ángulo, 2 por cuelga a la principal
  const cruces = nPrincipales * nOmegas;
  const extremos = 2 * (nPrincipales + nOmegas);
  const tornillosEstructura = Math.ceil((cruces * 2 + extremos + cuelgas * 2) * 1.1);

  // Fijaciones
  const fijacionesLosa = cuelgas; // clavo de impacto o chazo + tornillo por cuelga
  const fijacionesMuro = Math.ceil(perimetro / 0.6) + 4; // ángulo al muro cada 0,60 m

  // Acabado
  const cintaM = area * 1.4 * 1.1; // juntas de láminas, ~1,4 m por m²
  const rollosCinta = Math.ceil(cintaM / p.rolloCinta);
  const kgMasillaM2 = p.acabado === 'total' ? 1.2 : 0.6;
  const kgMasilla = area * kgMasillaM2 * 1.1;
  const cunetes = Math.ceil(kgMasilla / p.cuneteMasilla);
  const galones = (area * p.manos) / p.rendimientoPintura;
  const galonesRed = Math.ceil(galones);

  return {
    L, A, area, perimetro, nPrincipales, nOmegas,
    laminas,
    principales: { metros: mPrincipales, piezas: piezas(mPrincipales, p.largoPrincipal) },
    omegas: { metros: mOmegas, piezas: piezas(mOmegas, p.largoOmega) },
    angulo: { metros: perimetro, piezas: anguloPerimetral },
    cuelgas, largoCuelga, mCuelgas, anguloCuelgas,
    anguloTotal: anguloPerimetral + anguloCuelgas,
    tornillosLamina, tornillosEstructura,
    fijacionesLosa, fijacionesMuro,
    cintaM, rollosCinta,
    kgMasilla, cunetes,
    galones, galonesRed,
  };
}

if (typeof module !== 'undefined') module.exports = { calcularCielo };
