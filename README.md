# Monitoolring — Frontend

Frontend do projeto Monitoolring: Next.js 14, React, Tailwind CSS e shadcn/ui.

> A branch `master` é protegida e não recebe commits diretos. Todo o desenvolvimento parte da branch `inicializacao-projeto` (ou de branches derivadas dela), integrado via Pull Request.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- TypeScript

## Pré-requisitos

- Node.js 18.18+ (recomendado 20 LTS)
- npm 9+

## Inicialização

1. Clone o repositório e entre na branch `inicializacao-projeto`:

   ```bash
   git clone https://github.com/MRanderle/monitoolring--frontend.git
   cd monitoolring--frontend
   git checkout inicializacao-projeto
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Copie o arquivo de variáveis de ambiente e ajuste se necessário:

   ```bash
   cp .env.example .env.local
   ```

   `NEXT_PUBLIC_API_URL` deve apontar para a API do backend (por padrão `http://localhost:8080/api`).

4. Suba o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

   App disponível em `http://localhost:3000`.

## Rodando com Docker

Pré-requisito: Docker instalado (com Docker Compose).

Este projeto e o [backend](https://github.com/MRanderle/monitoolring--backend) compartilham a rede externa `monitoolring-network` para poderem se comunicar entre containers. Crie-a uma vez (se ainda não existir):

```bash
docker network create monitoolring-network
```

Depois, suba o frontend:

```bash
docker compose up --build
```

App disponível em `http://localhost:3000`.

Para rodar apenas com Docker (sem compose):

```bash
docker build -t monitoolring-frontend .
docker run -p 3000:3000 monitoolring-frontend
```

> Para chamar o backend (em outro repositório) quando ambos rodam em containers, suba os dois via `docker compose up` — eles compartilham a rede externa `monitoolring-network`.

## Scripts disponíveis

| Comando         | Descrição                          |
|-----------------|--------------------------------------|
| `npm run dev`   | Sobe o servidor de desenvolvimento   |
| `npm run build` | Gera o build de produção             |
| `npm run start` | Roda o build de produção             |
| `npm run lint`  | Executa o ESLint                     |

## Estrutura

```
src/
├── app/              # Rotas e páginas (App Router)
├── components/ui/    # Componentes shadcn/ui
└── lib/              # Utilitários (ex.: cn())
```

## Adicionando componentes shadcn/ui

```bash
npx shadcn@latest add <componente>
```
