// Convierte los datos de una receta al mismo formato LaTeX (entorno "receta")
// que ya se usaba en el documento de Overleaf, para poder seguir compilando ahí.

function escapeLatex(text) {
  if (!text) return "";
  return String(text)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_");
}

// El caracter "·" que usamos en "nutricion" se convierte al comando
// \textperiodcentered{} que usaba el documento original.
function formatConPuntos(text) {
  return escapeLatex(text).replace(/·/g, "\\textperiodcentered{}");
}

export function recetaToLatex(r) {
  const lines = [];
  lines.push(`%% ── ${r.titulo} ──`);
  lines.push(`\\hypertarget{receta-${r.slug}}{}`);
  lines.push(`\\begin{receta}{${escapeLatex(r.titulo)}}`);
  lines.push(`\\textit{${escapeLatex(r.descripcion)}}`);
  lines.push(`\\vspace{2pt}`);
  lines.push(`\\noindent\\rule{\\linewidth}{0.3pt}`);
  lines.push(`\\vspace{2pt}`);
  lines.push(
    `\\textbf{Preparación:} ${escapeLatex(r.prep)} \\quad \\textbf{Cocción:} ${escapeLatex(r.coccion)} \\quad \\textbf{Porciones:} ${escapeLatex(r.porciones)}`
  );
  lines.push(`\\vspace{2pt}`);
  lines.push(`\\noindent\\rule{\\linewidth}{0.3pt}`);
  lines.push(`\\vspace{2pt}`);
  lines.push(`\\textbf{Ingredientes}`);
  lines.push(`\\begin{itemize}\\setlength{\\itemsep}{1pt}`);
  r.ingredientes.forEach((ing) => lines.push(`  \\item ${escapeLatex(ing)}`));
  lines.push(`\\end{itemize}`);
  lines.push(`\\vspace{2pt}`);
  lines.push(`\\noindent\\rule{\\linewidth}{0.3pt}`);
  lines.push(`\\vspace{2pt}`);
  lines.push(`\\textbf{Preparación}`);
  lines.push(`\\begin{enumerate}\\setlength{\\itemsep}{3pt}`);
  r.pasos.forEach((paso) => lines.push(`  \\item ${escapeLatex(paso)}`));
  lines.push(`\\end{enumerate}`);
  lines.push(`\\vspace{2pt}`);
  lines.push(`\\noindent\\rule{\\linewidth}{0.3pt}`);
  lines.push(`\\vspace{4pt}`);
  if (r.nutricion) {
    lines.push(`\\textbf{Por porción (aprox.):} ${formatConPuntos(r.nutricion)}`);
  }
  if (r.tip) {
    lines.push(`\\vspace{4pt}`);
    lines.push(`\\textbf{Tip:} ${escapeLatex(r.tip)}`);
  }
  if (r.conservacion) {
    lines.push(`\\vspace{4pt}`);
    lines.push(`\\textbf{Conservación:} ${escapeLatex(r.conservacion)}`);
  }
  lines.push(`\\end{receta}`);
  return lines.join("\n");
}

export function recetasToLatexDoc(recetas, encabezado) {
  const cuerpo = recetas.map(recetaToLatex).join("\n\n");
  if (!encabezado) return cuerpo;
  return `%% ═══════════════════════════════════\n%% ${encabezado}\n%% ═══════════════════════════════════\n\n${cuerpo}`;
}

export function semanaToLatex(semana) {
  const filas = semana.dias
    .map((d) => `${escapeLatex(d.dia)} & ${escapeLatex(d.almuerzo)} & ${escapeLatex(d.cena)} \\\\`)
    .join("\n");
  return `\\hypertarget{semana${semana.numero}}{}\n\\semana{Semana ${semana.numero}}{\n${filas}\n}`;
}

export function semanasToLatexDoc(semanas) {
  return semanas.map(semanaToLatex).join("\n\n");
}

// Genera un data URI listo para usar en href de un <a download>
export function toDataUri(texContent) {
  return "data:text/plain;charset=utf-8," + encodeURIComponent(texContent);
}
