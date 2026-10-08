import { BotaoTentarNovamente } from "@/components/shared/botao-tentar-novamente";
import { MensagemErro } from "@/components/shared/mensagem-erro";
import { ApiError } from "@/lib/api-client";

import { descreverErroConsulta } from "../mensagens-erro";
import { listarFerramentas } from "../services/ferramentas-api";
import type { Ferramenta } from "../types";
import { TabelaFerramentas } from "./tabela-ferramentas";

export async function ListaFerramentas() {
  let ferramentas: Ferramenta[];
  try {
    ferramentas = await listarFerramentas();
  } catch (erro) {
    // Falha de rede ou HTTP tem tratamento na própria tela; resposta fora do contrato (zod)
    // é erro inesperado e segue para o error boundary da rota.
    if (!(erro instanceof ApiError)) {
      throw erro;
    }
    return <ErroCarregamentoFerramentas status={erro.status} />;
  }

  return <TabelaFerramentas ferramentas={ferramentas} />;
}

function ErroCarregamentoFerramentas({ status }: { status: number }) {
  const { motivo, orientacao } = descreverErroConsulta(status);
  return (
    <MensagemErro
      titulo="Não foi possível carregar as ferramentas."
      motivo={motivo}
      orientacao={orientacao}
      acao={<BotaoTentarNovamente />}
    />
  );
}
