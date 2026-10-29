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

// Cielo raso en PVC sobre la misma estructura (principales + omegas + cuelgas de ángulo).
// Las láminas de PVC van a lo largo del cuarto, perpendiculares a las omegas.
function calcularPVC(p) {
  const base = calcularCielo(Object.assign({}, p, { sepOmegas: p.sepOmegasPVC }));
  const { L, A, perimetro, nOmegas } = base;
  const desp = p.desperdicio / 100;
  const anchoLam = p.anchoLamPVC / 100; // viene en cm
  const largoLam = p.largoLamPVC;

  const filas = Math.ceil(A / anchoLam - 1e-9);
  let piezasBase, empalmes = 0;
  if (L <= largoLam) {
    const filasPorLamina = Math.floor(largoLam / L + 1e-9); // de una lámina salen varias filas
    piezasBase = Math.ceil(filas / filasPorLamina);
  } else {
    piezasBase = Math.ceil((filas * L) / largoLam - 1e-9);
    empalmes = filas * (Math.ceil(L / largoLam - 1e-9) - 1);
  }
  const laminas = Math.ceil(piezasBase * (1 + desp) - 1e-9);
  const m2Laminas = laminas * anchoLam * largoLam;

  // Tornillo lenteja: uno en cada cruce de lámina con omega y en cada extremo sobre el ángulo
  const tornillosLenteja = Math.ceil(filas * (nOmegas + 2) * 1.1);

  const mediaCana = Math.ceil((perimetro * (1 + desp)) / p.largoMediaCana - 1e-9);

  // Tornillos de estructura: igual que drywall
  return Object.assign({}, base, {
    laminas, filas, empalmes, m2Laminas, tornillosLenteja, mediaCana,
    piezasBase,
  });
}

if (typeof module !== 'undefined') module.exports.calcularPVC = calcularPVC;
