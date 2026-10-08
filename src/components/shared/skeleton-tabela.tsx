import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTabelaProps {
  linhas: number;
  rotulo: string;
}

export function SkeletonTabela({ linhas, rotulo }: SkeletonTabelaProps) {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <span className="sr-only">{rotulo}</span>
      <div className="space-y-px overflow-hidden rounded-md border">
        <Skeleton className="h-10 rounded-none" />
        {Array.from({ length: linhas }, (_, indice) => (
          <Skeleton key={indice} className="h-12 rounded-none opacity-60" />
        ))}
      </div>
    </div>
  );
}
