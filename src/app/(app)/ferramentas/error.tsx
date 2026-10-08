"use client";

import { useEffect } from "react";
import Link from "next/link";

import { BotaoTentarNovamente } from "@/components/shared/botao-tentar-novamente";
import { MensagemErro } from "@/components/shared/mensagem-erro";
import { Button } from "@/components/ui/button";

interface ErroFerramentasProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErroFerramentas({ error, reset }: ErroFerramentasProps) {
  useEffect(() => {
    console.error("[ferramentas] erro inesperado na rota", error);
  }, [error]);

  return (
    <section className="space-y-6">
      <h1 className="text-center text-2xl font-semibold">Ferramentas</h1>
      <MensagemErro
        titulo="A tela de Ferramentas não pôde ser exibida."
        motivo="Ocorreu um erro inesperado ao montar a tela."
        orientacao="Tente novamente ou volte ao início."
        acao={
          <>
            <BotaoTentarNovamente onTentarNovamente={reset} />
            <Button asChild variant="ghost">
              <Link href="/">Voltar ao início</Link>
            </Button>
          </>
        }
      />
    </section>
  );
}
