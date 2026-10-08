import type { Metadata } from "next";

import { acaoCadastrarFerramenta, FormularioFerramenta } from "@/features/ferramentas";

export const metadata: Metadata = {
  title: "Cadastro de ferramenta | Monitoolring",
};

export default function NovaFerramentaPage() {
  return (
    <section className="mx-auto max-w-xl space-y-6">
      <h1 className="text-center text-2xl font-semibold">Cadastro de ferramenta</h1>
      <FormularioFerramenta
        acaoSalvar={acaoCadastrarFerramenta}
        mensagemSucesso="Ferramenta cadastrada com sucesso."
      />
    </section>
  );
}
