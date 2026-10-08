import { z } from "zod";

// Limites espelham a validação da API de gravação (SCRUM-78) e as colunas da tabela ferramentas.
export const MAX_CARACTERES_NOME = 255;
export const MAX_CARACTERES_CODIGO = 18;
// A quantidade é um Integer no backend (máx. 2.147.483.647); 9 dígitos nunca estouram esse limite.
export const MAX_DIGITOS_QUANTIDADE = 9;

// Campos de ToolResponse usados pelas telas; o restante (auditoria) é descartado pelo zod.
export const ferramentaSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  nome: z.string(),
  quantidade: z.number().int(),
  versao: z.number().int(),
});

export const listaFerramentasSchema = z.array(ferramentaSchema);

export type Ferramenta = z.infer<typeof ferramentaSchema>;

// O formulário trabalha com texto (valor dos inputs); a saída do schema já vem no formato da API.
export const formularioFerramentaSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Informe o nome da ferramenta.")
    .max(MAX_CARACTERES_NOME, `O nome pode ter no máximo ${MAX_CARACTERES_NOME} caracteres.`),
  codigo: z
    .string()
    .trim()
    .min(1, "Informe o código da ferramenta.")
    .max(MAX_CARACTERES_CODIGO, `O código pode ter no máximo ${MAX_CARACTERES_CODIGO} caracteres.`),
  quantidade: z
    .string()
    .trim()
    .min(1, "Informe a quantidade.")
    .regex(/^\d+$/, "A quantidade deve ser um número inteiro igual ou maior que zero.")
    .max(MAX_DIGITOS_QUANTIDADE, `A quantidade pode ter no máximo ${MAX_DIGITOS_QUANTIDADE} dígitos.`)
    .transform(Number),
});

export type ValoresFormularioFerramenta = z.input<typeof formularioFerramentaSchema>;

export type DadosFerramenta = z.output<typeof formularioFerramentaSchema>;

// A edição envia também a versão lida na consulta: é o optimistic lock do backend (SCRUM-93).
export type DadosEdicaoFerramenta = DadosFerramenta & { versao: number };
