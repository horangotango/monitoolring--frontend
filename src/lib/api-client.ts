import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";

import { NETWORK_ERROR_STATUS } from "./action-result";

const TIMEOUT_MS = 10_000;

export class ApiError extends Error {
  readonly status: number;
  readonly details: string[];

  constructor(status: number, message: string, details: string[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
}

// Formato do ErrorResponse devolvido pelo GlobalExceptionHandler do backend.
const errorResponseSchema = z.object({
  message: z.string(),
  details: z.array(z.string()).optional(),
});

export async function apiRequest(path: string, options: RequestOptions = {}): Promise<unknown> {
  // FR-5: dados da API nunca vêm de cache. Chamado fora do try/catch de send() porque, durante a
  // pré-renderização, o Next sinaliza a rota como dinâmica lançando um erro próprio — que não
  // pode ser confundido com falha de rede.
  noStore();
  const response = await send(path, options);
  if (!response.ok) {
    throw await toApiError(response);
  }
  return response.status === 204 ? null : response.json();
}

async function send(path: string, { method = "GET", body }: RequestOptions): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("A variável NEXT_PUBLIC_API_URL não está configurada.");
  }

  try {
    return await fetch(`${baseUrl}${path}`, {
      method,
      headers: buildHeaders(body !== undefined),
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    console.error(`[api] ${method} ${path} falhou sem resposta HTTP`, error);
    throw new ApiError(NETWORK_ERROR_STATUS, "Não foi possível conectar ao servidor.");
  }
}

function buildHeaders(hasBody: boolean): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  // DEBT: a API ainda não expõe login, então toda chamada usa um token fixo lido do ambiente do
  // servidor. Trocar pela sessão do usuário quando o login existir — card a abrir com o backend.
  const token = process.env.API_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function toApiError(response: Response): Promise<ApiError> {
  // Corpo vazio ou não-JSON não é falha da leitura: cai na mensagem genérica abaixo.
  const body: unknown = await response.json().catch(() => null);
  const parsed = errorResponseSchema.safeParse(body);
  if (!parsed.success) {
    return new ApiError(response.status, "O servidor não conseguiu processar a solicitação.");
  }
  return new ApiError(response.status, parsed.data.message, parsed.data.details);
}
