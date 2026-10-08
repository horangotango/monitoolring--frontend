import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ROTA_CADASTRO_FERRAMENTA } from "../rotas";

interface BarraAcoesFerramentasProps {
  onEditar: () => void;
  onExcluir: () => void;
}

// Cores dos botões definidas na SCRUM-91: Inserir verde, Editar branco, Excluir vermelho.
export function BarraAcoesFerramentas({ onEditar, onExcluir }: BarraAcoesFerramentasProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild variant="sucesso">
        <Link href={ROTA_CADASTRO_FERRAMENTA}>
          <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
          Inserir
        </Link>
      </Button>
      <Button type="button" variant="outline" onClick={onEditar}>
        <Pencil aria-hidden="true" className="mr-2 h-4 w-4" />
        Editar
      </Button>
      <Button type="button" variant="destructive" onClick={onExcluir}>
        <Trash2 aria-hidden="true" className="mr-2 h-4 w-4" />
        Excluir
      </Button>
    </div>
  );
}
