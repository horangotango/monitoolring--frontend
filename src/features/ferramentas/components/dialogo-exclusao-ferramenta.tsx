"use client";

import { DialogoConfirmacao } from "@/components/shared/dialogo-confirmacao";
import { MensagemErro } from "@/components/shared/mensagem-erro";

import { useExcluirFerramenta } from "../hooks/use-excluir-ferramenta";
import { descreverErroExclusao } from "../mensagens-erro";
import type { Ferramenta } from "../types";

interface DialogoExclusaoFerramentaProps {
  ferramenta: Ferramenta;
  aberto: boolean;
  onAlterarAberto: (aberto: boolean) => void;
  onExcluida: () => void;
}

export function DialogoExclusaoFerramenta({
  ferramenta,
  aberto,
  onAlterarAberto,
  onExcluida,
}: DialogoExclusaoFerramentaProps) {
  const { excluir, erro, isExcluindo, limparErro } = useExcluirFerramenta();

  async function handleConfirmar() {
    const isExcluida = await excluir(ferramenta);
    if (isExcluida) {
      onAlterarAberto(false);
      onExcluida();
    }
  }

  function handleAlterarAberto(aberto: boolean) {
    if (!aberto) {
      limparErro();
    }
    onAlterarAberto(aberto);
  }

  return (
    <DialogoConfirmacao
      aberto={aberto}
      onAlterarAberto={handleAlterarAberto}
      titulo="Excluir ferramenta"
      descricao={
        <>
          A ferramenta {ferramenta.codigo} — {ferramenta.nome} será removida do sistema. O registro
          não poderá ser recuperado.
        </>
      }
      rotuloConfirmar="Excluir ferramenta"
      onConfirmar={handleConfirmar}
      isProcessando={isExcluindo}
    >
      {erro && <ErroExclusao status={erro.status} />}
    </DialogoConfirmacao>
  );
}

function ErroExclusao({ status }: { status: number }) {
  const { motivo, orientacao } = descreverErroExclusao(status);
  return (
    <MensagemErro
      titulo="Não foi possível excluir a ferramenta."
      motivo={motivo}
      orientacao={orientacao}
    />
  );
}
