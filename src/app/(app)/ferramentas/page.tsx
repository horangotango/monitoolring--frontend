import type { Metadata } from "next";

import { ListaFerramentas } from "@/features/ferramentas";

export const metadata: Metadata = {
  title: "Ferramentas | Monitoolring",
};

export default function FerramentasPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-center text-2xl font-semibold">Ferramentas</h1>
      <ListaFerramentas />
    </section>
  );
}
