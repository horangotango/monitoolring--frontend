import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:ring-2 focus:ring-ring"
      >
        Pular para o conteúdo
      </a>
      <main id="conteudo" className="container py-8">
        {children}
      </main>
      {/* Dark mode fora do MVP: fixa o tema claro para o toast não seguir o sistema operacional. */}
      <Toaster theme="light" position="top-center" />
    </>
  );
}
