import type { ActionResult } from "./action-result";

// Falha não prevista numa Server Action (ex.: resposta fora do contrato) chega ao cliente como
// exceção sem mensagem original. Vira um ActionResult para a tela tratar como qualquer outro erro.
export async function runClientAction(acao: () => Promise<ActionResult>): Promise<ActionResult> {
  try {
    return await acao();
  } catch (erro) {
    console.error("[acao] falha inesperada", erro);
    return {
      ok: false,
      error: { status: 500, message: "O servidor não conseguiu concluir a operação.", details: [] },
    };
  }
}
