"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { BotaoTentarNovamente } from "@/components/shared/botao-tentar-novamente";
import { MensagemErro } from "@/components/shared/mensagem-erro";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ActionError } from "@/lib/action-result";

import { useSalvarFerramenta, type AcaoSalvarFerramenta } from "../hooks/use-salvar-ferramenta";
import { descreverErroGravacao } from "../mensagens-erro";
import { ROTA_CONSULTA_FERRAMENTAS } from "../rotas";
import {
  formularioFerramentaSchema,
  MAX_CARACTERES_CODIGO,
  MAX_CARACTERES_NOME,
  MAX_DIGITOS_QUANTIDADE,
  type DadosFerramenta,
  type ValoresFormularioFerramenta,
} from "../types";

const VALORES_VAZIOS: ValoresFormularioFerramenta = { nome: "", codigo: "", quantidade: "" };

const STATUS_VERSAO_DESATUALIZADA = 409;

interface FormularioFerramentaProps {
  acaoSalvar: AcaoSalvarFerramenta;
  mensagemSucesso: string;
  valoresIniciais?: ValoresFormularioFerramenta;
}

export function FormularioFerramenta({
  acaoSalvar,
  mensagemSucesso,
  valoresIniciais,
}: FormularioFerramentaProps) {
  const form = useForm<ValoresFormularioFerramenta, unknown, DadosFerramenta>({
    resolver: zodResolver(formularioFerramentaSchema),
    defaultValues: valoresIniciais ?? VALORES_VAZIOS,
    // Valida ao sair do campo, não a cada tecla (04-ui-design-system §9).
    mode: "onBlur",
  });
  const { salvar, erro, isRedirecionando, limparErro } = useSalvarFerramenta({
    acaoSalvar,
    mensagemSucesso,
    setError: form.setError,
  });
  const isSalvando = form.formState.isSubmitting || isRedirecionando;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(salvar)} noValidate className="space-y-6">
        <p className="text-sm text-muted-foreground">Todos os campos são obrigatórios.</p>

        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoFocus
                  autoComplete="off"
                  aria-required="true"
                  maxLength={MAX_CARACTERES_NOME}
                />
              </FormControl>
              <FormDescription>Até {MAX_CARACTERES_NOME} caracteres.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="codigo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  autoComplete="off"
                  aria-required="true"
                  maxLength={MAX_CARACTERES_CODIGO}
                />
              </FormControl>
              <FormDescription>
                Código de estoque com letras e números, até {MAX_CARACTERES_CODIGO} caracteres.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  // SCRUM-83 AC 4: só aceita dígitos; texto com type="text" evita os caracteres
                  // "e", "-" e "." que um input type="number" deixa passar.
                  onChange={(evento) => field.onChange(evento.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
                  autoComplete="off"
                  aria-required="true"
                  maxLength={MAX_DIGITOS_QUANTIDADE}
                  className="max-w-40 tabular-nums"
                />
              </FormControl>
              <FormDescription>Número inteiro, zero ou mais.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {erro && <ErroGravacao erro={erro} onRecarregar={limparErro} />}

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isSalvando}>
            {isSalvando ? "Salvando…" : "Salvar"}
          </Button>
          <Button asChild variant="outline">
            {/* SCRUM-83 AC 9: cancela sem gravar e volta para a consulta. */}
            <Link href={ROTA_CONSULTA_FERRAMENTAS}>Cancelar</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface ErroGravacaoProps {
  erro: ActionError;
  onRecarregar: () => void;
}

function ErroGravacao({ erro, onRecarregar }: ErroGravacaoProps) {
  const { motivo, orientacao } = descreverErroGravacao(erro.status, erro.message);
  // Na disputa de versão, recarregar traz a versão atual do servidor para o formulário sem
  // descartar o que o operador digitou.
  const acao =
    erro.status === STATUS_VERSAO_DESATUALIZADA ? (
      <BotaoTentarNovamente rotulo="Recarregar dados" onTentarNovamente={onRecarregar} />
    ) : undefined;

  return (
    <MensagemErro
      titulo="Não foi possível salvar a ferramenta."
      motivo={motivo}
      orientacao={orientacao}
      acao={acao}
    />
  );
}
