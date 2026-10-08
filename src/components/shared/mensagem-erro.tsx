import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface MensagemErroProps {
  titulo: string;
  motivo: string;
  orientacao: string;
  acao?: ReactNode;
}

// Três partes, sempre nesta ordem: o que aconteceu, por quê e o que fazer agora.
export function MensagemErro({ titulo, motivo, orientacao, acao }: MensagemErroProps) {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-4"
    >
      <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
      <div className="space-y-1">
        <p className="font-semibold text-destructive">{titulo}</p>
        <p className="text-sm">{motivo}</p>
        <p className="text-sm">{orientacao}</p>
        {acao && <div className="flex flex-wrap gap-2 pt-3">{acao}</div>}
      </div>
    </div>
  );
}
