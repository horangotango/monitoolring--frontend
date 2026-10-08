import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { ActionError } from "@/lib/action-result";
import { runClientAction } from "@/lib/client-action";

import { acaoExcluirFerramenta } from "../services/ferramentas-actions";
import type { Ferramenta } from "../types";

const STATUS_NAO_ENCONTRADO = 404;

export function useExcluirFerramenta() {
  const router = useRouter();
  const [erro, setErro] = useState<ActionError | null>(null);
  const [isExcluindo, setIsExcluindo] = useState(false);

  // Devolve true quando a exclusão foi concluída, para quem chamou fechar a confirmação.
  async function excluir(ferramenta: Ferramenta): Promise<boolean> {
    setErro(null);
    setIsExcluindo(true);
    const resultado = await runClientAction(() => acaoExcluirFerramenta(ferramenta.id));
    setIsExcluindo(false);

    if (!resultado.ok) {
      // SCRUM-103: a resposta do servidor é exibida em toast; o bloco no diálogo mantém o texto
      // visível depois que o toast some.
      toast.error(resultado.error.message);
      setErro(resultado.error);
      if (resultado.error.status === STATUS_NAO_ENCONTRADO) {
        router.refresh();
      }
      return false;
    }

    toast.success(`Ferramenta ${ferramenta.codigo} excluída.`);
    return true;
  }

  function limparErro() {
    setErro(null);
  }

  return { excluir, erro, isExcluindo, limparErro };
}
