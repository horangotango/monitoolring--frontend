"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { PackageOpen } from "lucide-react";
import { toast } from "sonner";

import { EstadoVazio } from "@/components/shared/estado-vazio";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { rotaEdicaoFerramenta } from "../rotas";
import type { Ferramenta } from "../types";
import { BarraAcoesFerramentas } from "./barra-acoes-ferramentas";
import { DialogoExclusaoFerramenta } from "./dialogo-exclusao-ferramenta";

const TOTAL_COLUNAS = 4;

interface TabelaFerramentasProps {
  ferramentas: Ferramenta[];
}

export function TabelaFerramentas({ ferramentas }: TabelaFerramentasProps) {
  const router = useRouter();
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null);
  // Guarda a ferramenta escolhida ao abrir a confirmação. Se derivasse da seleção, uma atualização
  // da lista (ex.: registro que já não existe) desmontaria o diálogo e levaria junto a mensagem
  // de erro que o operador precisa ler.
  const [ferramentaParaExcluir, setFerramentaParaExcluir] = useState<Ferramenta | null>(null);

  // Derivado da lista atual: se a ferramenta sumir após um refresh, a seleção some junto.
  const ferramentaSelecionada =
    ferramentas.find((ferramenta) => ferramenta.id === idSelecionado) ?? null;

  function handleClickEditar() {
    if (!ferramentaSelecionada) {
      toast.warning("Selecione uma ferramenta na lista para editar.");
      return;
    }
    router.push(rotaEdicaoFerramenta(ferramentaSelecionada.id));
  }

  // SCRUM-103: sem seleção, o aviso explica o que falta; com seleção, a confirmação vem antes.
  function handleClickExcluir() {
    if (!ferramentaSelecionada) {
      toast.warning("Selecione uma ferramenta na lista para excluir.");
      return;
    }
    setFerramentaParaExcluir(ferramentaSelecionada);
  }

  return (
    <div className="space-y-4">
      <BarraAcoesFerramentas onEditar={handleClickEditar} onExcluir={handleClickExcluir} />
      <div className="rounded-md border">
        <Table>
          <caption className="sr-only">
            Ferramentas cadastradas. Selecione uma linha para editar ou excluir.
          </caption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">
                <span className="sr-only">Seleção</span>
              </TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ferramentas.length === 0 ? (
              <LinhaVazia />
            ) : (
              ferramentas.map((ferramenta) => (
                <LinhaFerramenta
                  key={ferramenta.id}
                  ferramenta={ferramenta}
                  isSelecionada={ferramenta.id === idSelecionado}
                  onSelecionar={setIdSelecionado}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {ferramentaParaExcluir && (
        <DialogoExclusaoFerramenta
          ferramenta={ferramentaParaExcluir}
          aberto
          onAlterarAberto={(aberto) => {
            if (!aberto) {
              setFerramentaParaExcluir(null);
            }
          }}
          onExcluida={() => setIdSelecionado(null)}
        />
      )}
    </div>
  );
}

function LinhaVazia() {
  return (
    <TableRow>
      <TableCell colSpan={TOTAL_COLUNAS}>
        <EstadoVazio
          icone={PackageOpen}
          titulo="Nenhuma ferramenta cadastrada"
          descricao="As ferramentas cadastradas aparecem aqui. Use o botão Inserir para cadastrar a primeira."
        />
      </TableCell>
    </TableRow>
  );
}

interface LinhaFerramentaProps {
  ferramenta: Ferramenta;
  isSelecionada: boolean;
  onSelecionar: (id: string) => void;
}

// A seleção usa rádio nativo e cada célula é um <label> do mesmo rádio: clicar em qualquer
// ponto da linha seleciona. O nome acessível vem de aria-labelledby (código + nome) porque
// leitores de tela divergem ao combinar vários <label> e o primeiro deles não tem texto.
function LinhaFerramenta({ ferramenta, isSelecionada, onSelecionar }: LinhaFerramentaProps) {
  const idCampo = `ferramenta-${ferramenta.id}`;
  const idCodigo = `${idCampo}-codigo`;
  const idNome = `${idCampo}-nome`;

  return (
    <TableRow data-state={isSelecionada ? "selected" : undefined}>
      <CelulaSelecionavel htmlFor={idCampo} className="justify-center">
        <input
          type="radio"
          id={idCampo}
          name="ferramenta-selecionada"
          value={ferramenta.id}
          checked={isSelecionada}
          onChange={() => onSelecionar(ferramenta.id)}
          aria-labelledby={`${idCodigo} ${idNome}`}
          className="h-5 w-5 cursor-pointer accent-primary"
        />
      </CelulaSelecionavel>
      <CelulaSelecionavel htmlFor={idCampo} className="whitespace-nowrap font-medium">
        <span id={idCodigo}>{ferramenta.codigo}</span>
      </CelulaSelecionavel>
      <CelulaSelecionavel htmlFor={idCampo}>
        <span id={idNome}>{ferramenta.nome}</span>
      </CelulaSelecionavel>
      <CelulaSelecionavel htmlFor={idCampo} className="justify-end tabular-nums">
        {ferramenta.quantidade}
      </CelulaSelecionavel>
    </TableRow>
  );
}

interface CelulaSelecionavelProps {
  htmlFor: string;
  className?: string;
  children: ReactNode;
}

function CelulaSelecionavel({ htmlFor, className, children }: CelulaSelecionavelProps) {
  return (
    <TableCell className="p-0">
      <label
        htmlFor={htmlFor}
        className={cn("flex min-h-12 cursor-pointer items-center px-4 py-2", className)}
      >
        {children}
      </label>
    </TableCell>
  );
}
