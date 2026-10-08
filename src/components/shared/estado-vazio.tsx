import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EstadoVazioProps {
  icone: LucideIcon;
  titulo: string;
  descricao: string;
  acao?: ReactNode;
}

export function EstadoVazio({ icone: Icone, titulo, descricao, acao }: EstadoVazioProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <Icone aria-hidden="true" className="h-10 w-10 text-muted-foreground" />
      <p className="font-semibold">{titulo}</p>
      <p className="max-w-prose text-sm text-muted-foreground">{descricao}</p>
      {acao && <div className="pt-2">{acao}</div>}
    </div>
  );
}
