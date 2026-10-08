"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BotaoTentarNovamenteProps {
  rotulo?: string;
  onTentarNovamente?: () => void;
}

const ROTULO_PADRAO = "Tentar novamente";

// router.refresh() refaz a busca dos Server Components; o callback opcional permite a quem usa
// limpar o próprio estado de erro na mesma transição.
export function BotaoTentarNovamente({
  rotulo = ROTULO_PADRAO,
  onTentarNovamente,
}: BotaoTentarNovamenteProps) {
  const router = useRouter();
  const [isCarregando, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      router.refresh();
      onTentarNovamente?.();
    });
  }

  return (
    <Button type="button" variant="outline" onClick={handleClick} disabled={isCarregando}>
      <RotateCw
        aria-hidden="true"
        className={cn("mr-2 h-4 w-4", isCarregando && "motion-safe:animate-spin")}
      />
      {isCarregando ? "Carregando…" : rotulo}
    </Button>
  );
}
