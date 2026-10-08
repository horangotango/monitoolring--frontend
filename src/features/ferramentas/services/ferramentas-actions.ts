"use server";

import { revalidatePath } from "next/cache";

import type { ActionResult } from "@/lib/action-result";
import { runApiAction } from "@/lib/api-action";

import { ROTA_CONSULTA_FERRAMENTAS, rotaEdicaoFerramenta } from "../rotas";
import type { DadosFerramenta } from "../types";
import { cadastrarFerramenta, editarFerramenta, excluirFerramenta } from "./ferramentas-api";

export async function acaoCadastrarFerramenta(dados: DadosFerramenta): Promise<ActionResult> {
  const resultado = await runApiAction(() => cadastrarFerramenta(dados));
  if (resultado.ok) {
    revalidatePath(ROTA_CONSULTA_FERRAMENTAS);
  }
  return resultado;
}

// id e versao são amarrados na página de edição (bind), então o formulário continua recebendo uma
// ação com a mesma assinatura usada no cadastro.
export async function acaoEditarFerramenta(
  id: string,
  versao: number,
  dados: DadosFerramenta,
): Promise<ActionResult> {
  const resultado = await runApiAction(() => editarFerramenta(id, { ...dados, versao }));
  if (resultado.ok) {
    revalidatePath(ROTA_CONSULTA_FERRAMENTAS);
    revalidatePath(rotaEdicaoFerramenta(id));
  }
  return resultado;
}

export async function acaoExcluirFerramenta(id: string): Promise<ActionResult> {
  const resultado = await runApiAction(() => excluirFerramenta(id));
  if (resultado.ok) {
    revalidatePath(ROTA_CONSULTA_FERRAMENTAS);
  }
  return resultado;
}
