import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonFormularioProps {
  campos: number;
  rotulo: string;
}

export function SkeletonFormulario({ campos, rotulo }: SkeletonFormularioProps) {
  return (
    <div role="status" aria-live="polite" className="space-y-6">
      <span className="sr-only">{rotulo}</span>
      {Array.from({ length: campos }, (_, indice) => (
        <div key={indice} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-4 w-48 opacity-60" />
        </div>
      ))}
      <Skeleton className="h-11 w-32" />
    </div>
  );
}
