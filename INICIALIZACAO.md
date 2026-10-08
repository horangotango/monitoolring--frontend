# Inicialização — Monitoolring Frontend

Guia completo para colocar o frontend do Monitoolring rodando, localmente ou via Docker.

## Visão geral

| Item        | Valor                                    |
|-------------|----------------------------------------------|
| Framework   | Next.js 14.2.35 (App Router)                 |
| UI          | React 18, Tailwind CSS, shadcn/ui             |
| Linguagem   | TypeScript                                    |
| Porta       | `3000`                                       |

## Opção 1 — Rodando localmente (sem Docker)

### Pré-requisitos

- Node.js 18.18+ (recomendado 20 LTS) — `node -v` para conferir
- npm 9+
- Git

### Passo a passo

1. Clone o repositório e vá para a branch de trabalho:

   ```bash
   git clone https://github.com/MRanderle/monitoolring--frontend.git
   cd monitoolring--frontend
   git checkout inicializacao-projeto
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Copie o arquivo de variáveis de ambiente:

   ```bash
   cp .env.example .env.local
   ```

   Ajuste `NEXT_PUBLIC_API_URL` se o backend não estiver em `http://localhost:8080/api`.

4. Suba o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:3000`.

### Outros comandos úteis

| Comando         | Descrição                          |
|-----------------|--------------------------------------|
| `npm run build` | Gera o build de produção             |
| `npm run start` | Roda o build de produção             |
| `npm run lint`  | Executa o ESLint                     |

## Opção 2 — Rodando com Docker

### Pré-requisitos

- Docker instalado (Docker Desktop no Windows/Mac, ou Docker Engine no Linux)
- Docker Compose (já incluso no Docker Desktop)

### Passo a passo

1. Clone o repositório (se ainda não tiver feito):

   ```bash
   git clone https://github.com/MRanderle/monitoolring--frontend.git
   cd monitoolring--frontend
   git checkout feature/docker   # ou a branch/tag que contém os arquivos Docker
   ```

2. Crie a rede externa compartilhada com o backend (só precisa fazer uma vez por máquina):

   ```bash
   docker network create monitoolring-network
   ```

   Se a rede já existir, o comando retorna um erro inofensivo (`network already exists`) — pode ignorar.

3. Suba o frontend:

   ```bash
   docker compose up --build
   ```

   Isso vai:
   - Buildar a imagem (`monitoolring-frontend:local`) usando o [Dockerfile](Dockerfile) multi-stage (`deps` → `build` → `run`, com output `standalone` do Next.js)
   - Subir o container `monitoolring-frontend` na porta `3000`
   - Conectar o container à rede `monitoolring-network`

4. Acesse `http://localhost:3000`.

5. Para rodar em segundo plano:

   ```bash
   docker compose up -d --build
   ```

6. Para parar:

   ```bash
   docker compose down
   ```

### Rodando apenas com `docker build` / `docker run` (sem compose)

```bash
docker build -t monitoolring-frontend .
docker run -p 3000:3000 monitoolring-frontend
```

> Nesse modo o container **não** entra na rede `monitoolring-network`, então ele não vai conseguir chamar o backend pelo nome do serviço — use o compose se for rodar os dois juntos.

## Rodando frontend + backend juntos

O [backend](https://github.com/MRanderle/monitoolring--backend) tem seu próprio `docker-compose.yml` e entra na mesma rede externa `monitoolring-network`. Ordem sugerida:

```bash
docker network create monitoolring-network

# Terminal 1
cd monitoolring--backend
docker compose up --build

# Terminal 2
cd monitoolring--frontend
docker compose up --build
```

Depois disso:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080/api/health`
- De dentro do container do frontend, o backend é acessível em `http://monitoolring-backend:8080`

## Estrutura do projeto

```
.
├── Dockerfile                  # Build multi-stage (deps -> build -> run)
├── docker-compose.yml          # Sobe o frontend na rede compartilhada
├── src/
│   ├── app/                    # Rotas e páginas (App Router)
│   ├── components/ui/          # Componentes shadcn/ui
│   └── lib/                    # Utilitários (ex.: cn())
└── public/                     # Arquivos estáticos
```

## Adicionando componentes shadcn/ui

```bash
npx shadcn@latest add <componente>
```

## Branches do repositório

| Branch                  | Propósito                                                |
|--------------------------|-------------------------------------------------------------|
| `master`                 | Branch protegida, integrada via Pull Request                |
| `inicializacao-projeto`  | Scaffolding inicial do projeto                               |
| `feature/docker`         | Arquivos de containerização (Dockerfile, docker-compose)     |

## Troubleshooting

- **Porta `3000` já em uso**: outro processo está usando a porta. Pare-o ou mude a porta no `docker-compose.yml` (`"3001:3000"`, por exemplo).
- **`network monitoolring-network not found`**: rode `docker network create monitoolring-network` antes de subir o compose.
- **Frontend não consegue chamar o backend**: confirme que ambos os containers estão na mesma rede (`docker network inspect monitoolring-network`) e que `NEXT_PUBLIC_API_URL` aponta para o host/porta corretos.
