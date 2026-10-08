// Status usado quando não houve resposta HTTP (rede indisponível ou timeout).
export const NETWORK_ERROR_STATUS = 0;

export interface ActionError {
  status: number;
  message: string;
  details: string[];
}

// Server Actions devolvem erro esperado como dado, não como exceção: exceções lançadas numa
// Server Action chegam ao cliente sem a mensagem original em produção.
export type ActionResult = { ok: true } | { ok: false; error: ActionError };
