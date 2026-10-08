import type { Metadata } from "next";

import { EdicaoFerramenta } from "@/features/ferramentas";

export const metadata: Metadata = {
  title: "Edição de ferramenta | Monitoolring",
};

export default function EditarFerramentaPage({ params }: { params: { id: string } }) {
  return (
    <section className="mx-auto max-w-xl space-y-6">
      <h1 className="text-center text-2xl font-semibold">Edição de ferramenta</h1>
      <EdicaoFerramenta id={params.id} />
    </section>
  );
}
