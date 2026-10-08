import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import type { ActionError, ActionResult } from "@/lib/action-result";
import { runClientAction } from "@/lib/client-action";

import { ROTA_CONSULTA_FERRAMENTAS } from "../rotas";
import type { DadosFerramenta, ValoresFormularioFerramenta } from "../types";

export type AcaoSalvarFerramenta = (dados: DadosFerramenta) => Promise<ActionResult>;

interface OpcoesSalvarFerramenta {
  acaoSalvar: AcaoSalvarFerramenta;
  mensagemSucesso: string;
  setError: UseFormSetError<ValoresFormularioFerramenta>;
}

const CAMPOS_FORMULARIO = ["nome", "codigo", "quantidade"] as const;

export function useSalvarFerramenta({
  acaoSalvar,
  mensagemSucesso,
  setError,
}: OpcoesSalvarFerramenta) {
  const router = useRouter();
  const [erro, setErro] = useState<ActionError | null>(null);
  const [isRedirecionando, startTransition] = useTransition();

  async function salvar(dados: DadosFerramenta) {
    setErro(null);
    const resultado = await runClientAction(() => acaoSalvar(dados));
    if (!resultado.ok) {
      // SCRUM-83 AC 8: mensagem da API em toast; o bloco de erro fica ancorado no formulário
      // porque o toast some antes de o operador terminar de ler.
      toast.error(resultado.error.message);
      marcarErrosDeCampo(resultado.error.details, setError);
      setErro(resultado.error);
      return;
    }

    // SCRUM-83 AC 7: sucesso volta para a consulta de ferramentas.
    toast.success(mensagemSucesso);
    startTransition(() => {
      // Sem o refresh, o cache de rotas do cliente devolve a tela de edição já visitada e o
      // formulário reabre preso a uma versão antiga, provocando conflito falso na próxima gravação.
      router.refresh();
      router.push(ROTA_CONSULTA_FERRAMENTAS);
    });
  }

  function limparErro() {
    setErro(null);
  }

  return { salvar, erro, isRedirecionando, limparErro };
}

// O backend devolve detalhes de validação como "campo: mensagem"; os que correspondem a um campo
// do formulário aparecem junto dele.
function marcarErrosDeCampo(
  detalhes: string[],
  setError: UseFormSetError<ValoresFormularioFerramenta>,
) {
  for (const detalhe of detalhes) {
    const [campo, ...partesMensagem] = detalhe.split(":");
    const campoFormulario = CAMPOS_FORMULARIO.find((nome) => nome === campo.trim());
    const mensagem = partesMensagem.join(":").trim();
    if (campoFormulario && mensagem) {
      const mensagemFormatada = mensagem.charAt(0).toUpperCase() + mensagem.slice(1);
      setError(campoFormulario, { type: "server", message: mensagemFormatada });
    }
  }
}
