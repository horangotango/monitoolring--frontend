import { SkeletonFormulario } from "@/components/shared/skeleton-formulario";

export default function CarregandoEdicaoFerramenta() {
  return (
    <section className="mx-auto max-w-xl space-y-6">
      <h1 className="text-center text-2xl font-semibold">Edição de ferramenta</h1>
      <SkeletonFormulario campos={3} rotulo="Carregando dados da ferramenta" />
    </section>
  );
}
