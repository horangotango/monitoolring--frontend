import "server-only";

import type { ActionResult } from "./action-result";
import { ApiError } from "./api-client";

// Converte falhas de HTTP e de rede em ActionResult. Qualquer outro erro (ex.: resposta fora do
// contrato) continua sendo lançado, porque não é algo que o usuário consiga corrigir.
export async function runApiAction(operation: () => Promise<unknown>): Promise<ActionResult> {
  try {
    await operation();
    return { ok: true };
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error;
    }
    return {
      ok: false,
      error: { status: error.status, message: error.message, details: error.details },
    };
  }
}
