import Link from "next/link";

import { MensagemErro } from "@/components/shared/mensagem-erro";
import { Button } from "@/components/ui/button";
import { ROTA_CONSULTA_FERRAMENTAS } from "@/features/ferramentas";

export default function FerramentaNaoEncontrada() {
  return (
    <section className="mx-auto max-w-xl space-y-6">
      <h1 className="text-center text-2xl font-semibold">Edição de ferramenta</h1>
      <MensagemErro
        titulo="Esta ferramenta não foi encontrada."
        motivo="O registro não existe mais ou o endereço está incorreto."
        orientacao="Volte para a consulta de ferramentas e escolha uma ferramenta da lista."
        acao={
          <Button asChild variant="outline">
            <Link href={ROTA_CONSULTA_FERRAMENTAS}>Voltar para Ferramentas</Link>
          </Button>
        }
      />
    </section>
  );
}
