import { NETWORK_ERROR_STATUS } from "@/lib/action-result";

export interface DescricaoErro {
  motivo: string;
  orientacao: string;
}

const ORIENTACAO_PADRAO = "Tente novamente. Se o problema continuar, avise o responsável pelo sistema.";

const MOTIVO_SEM_RESPOSTA = "O servidor não respondeu. A conexão pode estar indisponível.";

const MOTIVO_SESSAO_INVALIDA = "O servidor recusou o acesso porque a sessão é inválida ou expirou.";

export function descreverErroConsulta(status: number): DescricaoErro {
  if (status === NETWORK_ERROR_STATUS) {
    return { motivo: MOTIVO_SEM_RESPOSTA, orientacao: "Verifique a conexão e tente novamente." };
  }
  if (status === 401 || status === 403) {
    return { motivo: MOTIVO_SESSAO_INVALIDA, orientacao: "Recarregue a página e tente novamente." };
  }
  return { motivo: "O servidor encontrou um problema ao consultar as ferramentas.", orientacao: ORIENTACAO_PADRAO };
}

export function descreverErroExclusao(status: number): DescricaoErro {
  if (status === 404) {
    return {
      motivo: "Esta ferramenta já não existe no sistema.",
      orientacao: "A lista foi atualizada; confira se o registro certo está selecionado.",
    };
  }
  if (status === NETWORK_ERROR_STATUS) {
    return { motivo: MOTIVO_SEM_RESPOSTA, orientacao: "Verifique a conexão e tente excluir novamente." };
  }
  if (status === 401 || status === 403) {
    return { motivo: MOTIVO_SESSAO_INVALIDA, orientacao: "Recarregue a página e tente novamente." };
  }
  return { motivo: "O servidor encontrou um problema ao excluir a ferramenta.", orientacao: ORIENTACAO_PADRAO };
}

// Em erro de dados (400) a mensagem da API diz o que corrigir e vai para a tela. Nos demais casos
// ela fica só no toast, e o bloco de erro explica a situação em linguagem do operador.
export function descreverErroGravacao(status: number, mensagemDaApi: string): DescricaoErro {
  if (status === 400) {
    return { motivo: mensagemDaApi, orientacao: "Corrija os dados e salve novamente." };
  }
  if (status === 409) {
    // SCRUM-93: o backend usa optimistic lock e recusa a gravação quando a versão enviada está velha.
    return {
      motivo: "Outra pessoa alterou esta ferramenta enquanto você editava.",
      orientacao: "Recarregue os dados para ver a versão atual e confira suas alterações antes de salvar.",
    };
  }
  if (status === 404) {
    return {
      motivo: "Esta ferramenta não existe mais no sistema.",
      orientacao: "Volte para a consulta de ferramentas para ver a lista atualizada.",
    };
  }
  if (status === NETWORK_ERROR_STATUS) {
    return { motivo: MOTIVO_SEM_RESPOSTA, orientacao: "Verifique a conexão e tente salvar novamente." };
  }
  if (status === 401 || status === 403) {
    return {
      motivo: MOTIVO_SESSAO_INVALIDA,
      orientacao: "Recarregue a página e tente novamente. Os dados preenchidos continuam no formulário.",
    };
  }
  return { motivo: "O servidor encontrou um problema ao gravar a ferramenta.", orientacao: ORIENTACAO_PADRAO };
}
