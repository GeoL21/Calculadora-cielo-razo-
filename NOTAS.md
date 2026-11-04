# Calculadora de cielo raso — Notas para Claude

## Qué es
PWA personal (no es de la clínica) para calcular los materiales de un cielo raso
en láminas de yeso cartón (drywall) o en PVC, en Colombia. Sin costos.
No usa hoja de Google ni servidor: todo se calcula en el teléfono (`calculo.js`).

## Dónde vive
- Este repo, publicado en GitHub Pages.

## Cómo se calcula
- Cuartos solo rectangulares.
- Se elige Drywall o PVC con un selector.
- Estructura: principales + omegas, en los dos sistemas.
- Calcula láminas, perfiles, fijaciones/cuelgas y acabado.
- PVC: remate perimetral con media caña; la medida de la lámina es un campo editable
  porque hay varias medidas.

## Palabras locales (usarlas así)
- "Principales" = lo que en otros lados llaman viguetas. Miden 2,44 m.
- La estructura se sostiene con ángulos (cuelgas de ángulo), no con alambre.

## Cómo trabajar aquí
- Preguntar antes de cambiar algo y mostrar un bosquejo para aprobar.
- Se pueden subir los cambios directamente a este repo.
- Al cambiar archivos, subir el número de `CACHE` en `sw.js`.
- Todo en español.
