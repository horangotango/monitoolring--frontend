// Rotas das telas de ferramentas num só lugar: redirecionamentos, links e revalidação de cache
// usam estes valores, então renomear uma rota muda um arquivo.
export const ROTA_CONSULTA_FERRAMENTAS = "/ferramentas";

export const ROTA_CADASTRO_FERRAMENTA = "/ferramentas/nova";

export function rotaEdicaoFerramenta(id: string): string {
  return `/ferramentas/${encodeURIComponent(id)}/editar`;
}
