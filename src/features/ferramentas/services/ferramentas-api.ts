import "server-only";

import { apiRequest } from "@/lib/api-client";

import {
  ferramentaSchema,
  listaFerramentasSchema,
  type DadosEdicaoFerramenta,
  type DadosFerramenta,
  type Ferramenta,
} from "../types";

const RECURSO_FERRAMENTAS = "/tools";

function recursoFerramenta(id: string): string {
  return `${RECURSO_FERRAMENTAS}/${encodeURIComponent(id)}`;
}

export async function listarFerramentas(): Promise<Ferramenta[]> {
  const resposta = await apiRequest(RECURSO_FERRAMENTAS);
  return listaFerramentasSchema.parse(resposta);
}

export async function buscarFerramenta(id: string): Promise<Ferramenta> {
  const resposta = await apiRequest(recursoFerramenta(id));
  return ferramentaSchema.parse(resposta);
}

export async function cadastrarFerramenta(dados: DadosFerramenta): Promise<Ferramenta> {
  const resposta = await apiRequest(RECURSO_FERRAMENTAS, { method: "POST", body: dados });
  return ferramentaSchema.parse(resposta);
}

export async function editarFerramenta(
  id: string,
  dados: DadosEdicaoFerramenta,
): Promise<Ferramenta> {
  const resposta = await apiRequest(recursoFerramenta(id), { method: "PUT", body: dados });
  return ferramentaSchema.parse(resposta);
}

// SCRUM-103: sucesso é 204 No Content, então não há corpo para validar.
export async function excluirFerramenta(id: string): Promise<void> {
  await apiRequest(recursoFerramenta(id), { method: "DELETE" });
}
