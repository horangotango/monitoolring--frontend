import { notFound } from "next/navigation";

import { BotaoTentarNovamente } from "@/components/shared/botao-tentar-novamente";
import { MensagemErro } from "@/components/shared/mensagem-erro";
import { ApiError } from "@/lib/api-client";

import { descreverErroConsulta } from "../mensagens-erro";
import { acaoEditarFerramenta } from "../services/ferramentas-actions";
import { buscarFerramenta } from "../services/ferramentas-api";
import type { Ferramenta } from "../types";
import { FormularioFerramenta } from "./formulario-ferramenta";

export async function EdicaoFerramenta({ id }: { id: string }) {
  let ferramenta: Ferramenta;
  try {
    ferramenta = await buscarFerramenta(id);
  } catch (erro) {
    if (!(erro instanceof ApiError)) {
      throw erro;
    }
    if (erro.status === 404) {
      notFound();
    }
    return <ErroCarregamentoFerramenta status={erro.status} />;
  }

  return (
    <FormularioFerramenta
      // A versão lida agora é amarrada à ação: se o registro mudar antes do envio, o backend
      // recusa com 409 e a tela oferece recarregar (SCRUM-93).
      acaoSalvar={acaoEditarFerramenta.bind(null, ferramenta.id, ferramenta.versao)}
      valoresIniciais={{
        nome: ferramenta.nome,
        codigo: ferramenta.codigo,
        quantidade: String(ferramenta.quantidade),
      }}
      mensagemSucesso="Alterações salvas com sucesso."
    />
  );
}

function ErroCarregamentoFerramenta({ status }: { status: number }) {
  const { motivo, orientacao } = descreverErroConsulta(status);
  return (
    <MensagemErro
      titulo="Não foi possível carregar a ferramenta."
      motivo={motivo}
      orientacao={orientacao}
      acao={<BotaoTentarNovamente />}
    />
  );
}
