"use client";

import type { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DialogoConfirmacaoProps {
  aberto: boolean;
  onAlterarAberto: (aberto: boolean) => void;
  titulo: string;
  descricao: ReactNode;
  rotuloConfirmar: string;
  onConfirmar: () => void;
  isProcessando?: boolean;
  /** Conteúdo extra abaixo da descrição, como o erro da operação que acabou de falhar. */
  children?: ReactNode;
}

// Diálogo de ação irreversível: a confirmação é estilizada como ação destrutiva e o foco inicial
// fica no Cancelar (comportamento do Radix), para o clique rápido não confirmar sem querer.
export function DialogoConfirmacao({
  aberto,
  onAlterarAberto,
  titulo,
  descricao,
  rotuloConfirmar,
  onConfirmar,
  isProcessando = false,
  children,
}: DialogoConfirmacaoProps) {
  return (
    <AlertDialog open={aberto} onOpenChange={onAlterarAberto}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titulo}</AlertDialogTitle>
          <AlertDialogDescription>{descricao}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessando}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            disabled={isProcessando}
            // Sem o preventDefault o Radix fecha o diálogo no clique, antes de a operação responder.
            onClick={(evento) => {
              evento.preventDefault();
              onConfirmar();
            }}
          >
            {isProcessando ? "Processando…" : rotuloConfirmar}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
