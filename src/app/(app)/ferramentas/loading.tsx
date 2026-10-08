import { SkeletonTabela } from "@/components/shared/skeleton-tabela";

export default function CarregandoFerramentas() {
  return (
    <section className="space-y-6">
      <h1 className="text-center text-2xl font-semibold">Ferramentas</h1>
      <SkeletonTabela linhas={5} rotulo="Carregando ferramentas" />
    </section>
  );
}
