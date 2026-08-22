# Next.js Auth Admin Sidebar (shadcn/ui)

Aplicação full-stack em **Next.js 16** (App Router) com autenticação própria, controle de acesso por papéis (**ADMIN / USER / CLIENT**), dashboard administrativo com sidebar (**shadcn/ui**) e persistência em **PostgreSQL** via queries SQL puras (sem ORM).

> Branch de desenvolvimento: `dev-main`

---

## 📋 Sumário

- [Principais recursos](#-principais-recursos)
- [Stack](#-stack)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Como rodar localmente](#-como-rodar-localmente)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Papéis e rotas protegidas](#-papéis-e-rotas-protegidas)
- [Usuários e autenticação](#-usuários-e-autenticação)
- [Segurança de sessão](#-segurança-de-sessão)
- [Fluxo de desenvolvimento](#-fluxo-de-desenvolvimento)
- [Documentação adicional](#-documentação-adicional)

---

## ✨ Principais recursos

- **Autenticação própria** com JWT (`jose`), sessão em cookie `httpOnly` e renovação automática (sliding session).
- **Controle de acesso por papel** (`ADMIN`, `USER`, `CLIENT`) aplicado no `proxy.ts` (middleware) e nas Server Actions.
- **CSRF protection**: token gerado no middleware e validado nas Server Actions com `crypto.timingSafeEqual`.
- **Rate limiting** persistido no banco para login (5 tentativas / 10 min) e recuperação de senha (3 tentativas / 15 min).
- **Verificação de e-mail** e **recuperação/redefinição de senha** via token com expiração, enviados por e-mail (`nodemailer`).
- **Upload de avatar** com validação de formato, tamanho e dimensão, processado com `sharp` e armazenado no **Vercel Blob**.
- **CRUD de usuários, administradores e clientes** com soft delete, reativação e views SQL dedicadas (dados públicos vs. internos).
- **Dashboard com sidebar** construída com `shadcn/ui` / `radix-ui`, tema claro/escuro (`next-themes`) e animações (`gsap`).
- **Migrations versionadas** em SQL puro, com CLI própria para criar, aplicar e resetar o banco.

---

## 🧱 Stack

- **Framework**: Next.js 16 (App Router, Server Actions, Server Components)
- **UI**: React 19, Tailwind CSS 4, shadcn/ui, Radix UI, lucide-react, gsap
- **Autenticação**: jose (JWT), bcrypt-ts
- **Banco de dados**: PostgreSQL (driver `pg`, sem ORM), migrations em SQL
- **Armazenamento de arquivos**: Vercel Blob, Sharp
- **E-mail**: Nodemailer (SMTP)
- **Validação**: Zod
- **Qualidade de código**: Biome (lint + format)
- **Linguagem**: TypeScript

---

## 📁 Estrutura do projeto

```
app/
  (auth)/          # login, register, forgot/reset password, verify-email
  dashboard/       # área autenticada: admins, users, clients, settings
_actions/          # Server Actions (login, cadastro, CRUD, senha, etc.)
_components/       # componentes de UI (sidebar, forms, ui/ do shadcn)
_database/         # scripts de migration (CLI) + migrations/*.sql
_docs/             # documentação de banco de dados e storage
_hooks/            # hooks utilitários (mobile, initials, etc.)
_lib/              # sessão, csrf, rate limit, repositories, utils
_types/            # tipos e constantes compartilhadas
proxy.ts           # middleware: rotas protegidas, papéis e CSRF
```

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 20+
- PostgreSQL em execução (local ou remoto)
- Conta na Vercel com um Blob Store (para upload de avatar)
- Servidor SMTP para envio de e-mails (verificação e reset de senha)

### 1. Clonar e instalar dependências

```bash
git clone -b dev-main https://github.com/HumbertoFox/nextjs-auth-admin-sidebar-shadcn.git
cd nextjs-auth-admin-sidebar-shadcn
npm install
```

### 2. Configurar variáveis de ambiente

Copie `exemple.env` para `.env` e preencha os valores (veja a tabela abaixo).

### 3. Criar e popular o banco de dados

```bash
npm run db:setup
```

Esse comando executa `db:reset` seguido de `db:migrate`, aplicando todas as migrations em `_database/migrations` (extensões, enums, tabelas, views, triggers, permissões e índices). Veja detalhes em [`_docs/DATABASE.md`](./_docs/DATABASE.md).

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

---

### Variáveis de ambiente

```env
NEXT_PUBLIC_APP_NAME=""
DEFAULT_CLIENT_PASSWORD=""
BLOB_READ_WRITE_TOKEN=""
DATABASE_URL=""
DB_SSL=""
AUTH_SECRET=""
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
NEXT_URL=""
```

| Variável                     | Descrição                                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_NAME`       | Nome público da aplicação (exposto ao cliente via Next.js)                                                           |
| `BLOB_READ_WRITE_TOKEN`      | Token para upload de arquivos no Vercel Blob                                                                         |
| `DATABASE_URL`               | String de conexão do PostgreSQL. O nome do banco definido aqui também é usado para derivar a role de acesso          |(`<nome_do_banco>_backend_role`), criada automaticamente pelas migrations                                                                             |
| `DB_SSL`                   | Controla SSL na conexão com o banco. Use `false` em ambiente local; omita ou use `true` em produção                    |
| `AUTH_SECRET`              | Chave secreta usada para assinar os JWTs de sessão                                                                     |
| `SMTP_HOST`                | Servidor SMTP                                                                                                          |
| `SMTP_PORT`                | Porta SMTP                                                                                                             |
| `SMTP_USER`                | Usuário SMTP                                                                                                           |
| `SMTP_PASS`                | Senha SMTP                                                                                                             |
| `NEXT_URL`                 | URL base da aplicação (usada para montar links de verificação de e-mail e reset de senha)                              |
| `DEFAULT_CLIENT_PASSWORD`  | Senha temporária padrão para `CLIENT`s cadastrados por um `USER` (opcional — se omitida, usa `Client@123`)             |

---

## 🛠 Scripts disponíveis

| Comando                     | Descrição                                                       |
| --------------------------- | --------------------------------------------------------------- |
| `npm run dev`               | Inicia o servidor de desenvolvimento                            |
| `npm run build`             | Gera o build de produção                                        |
| `npm run start`             | Inicia o servidor em modo produção                              |
| `npm run lint`              | Roda o lint com Biome                                           |
| `npm run format`            | Formata o código com Biome                                      |
| `npm run db:setup`          | Reseta e aplica todas as migrations                             |
| `npm run db:reset`          | Reseta o banco (apaga todos os dados — não usar em produção)    |
| `npm run db:migrate`        | Aplica as migrations pendentes                                  |
| `npm run make:migration`    | Cria um novo arquivo de migration (`"descrição"`)               |

---

## 🔐 Papéis e rotas protegidas

O `proxy.ts` (middleware) controla o acesso conforme o papel do usuário autenticado:

- **`/dashboard/**`** — requer sessão válida.
- **`/dashboard/admins/**`** — restrito a `ADMIN`.
- **`/dashboard/user/clients`** e **`/dashboard/user/register`** — restrito a `ADMIN` e `USER`.
- Rotas públicas (`/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`) redirecionam para `/dashboard` se já houver sessão ativa.
- Se `must_change_password` estiver ativo para o usuário logado, qualquer rota de `/dashboard/**` (exceto `/dashboard/settings/password`) redireciona para a troca obrigatória de senha. Essa flag é consultada diretamente no banco a cada requisição (`updateSession`), nunca a partir do próprio JWT.

---

## 👤 Usuários e autenticação

- O **primeiro cadastro feito em `/register` sempre cria um usuário `ADMIN`**; se já existir um administrador no sistema, a rota bloqueia novos cadastros por ali (`Já existe um administrador cadastrado.`).
- A partir do primeiro `ADMIN`, novos usuários são criados pelo próprio dashboard administrativo, com permissões diferentes por papel:
  - **`ADMIN`** pode cadastrar `ADMIN`, `USER` ou `CLIENT`, definindo a senha diretamente no formulário.
  - **`USER`** só pode cadastrar `CLIENT`, com uma senha temporária padrão (`DEFAULT_CLIENT_PASSWORD`, ou `Client@123` se a variável não estiver definida) e `must_change_password` ativado — o cliente é obrigado a trocar a senha no primeiro login.
- Login: e-mail + senha, com verificação obrigatória de e-mail após 30 dias de conta criada.
- Soft delete de usuários, com reativação disponível para `ADMIN`.
- Proteção CSRF em todas as Server Actions sensíveis (cookie + token validado a cada submissão).

---

## 🔒 Segurança de sessão

- Sessões são **JWTs assinados** (`jose`), armazenados em cookie `httpOnly`, `secure` e `sameSite=lax` — sem registro do token em banco (stateless).
- Cada JWT carrega um `session_version` (snapshot do valor salvo em `users.session_version` no momento da emissão), além de `userId`, `role` e `iat`.
- A cada requisição a uma rota protegida, o middleware (`updateSession`) descriptografa o cookie e compara o `session_version` do token com o valor atual no banco. Se forem diferentes, a sessão é considerada inválida e o cookie é removido.
- `session_version` é **incrementado a cada novo login** (e no login automático após o primeiro cadastro), funcionando como um mecanismo de **sessão única**: autenticar em um novo dispositivo/navegador invalida automaticamente qualquer sessão anterior emitida para o mesmo usuário.
- O token também tem vida curta (15 min) com renovação automática (sliding session) enquanto houver atividade, e uma idade máxima absoluta de 24h a partir da emissão original.
- Trocar a senha (própria, via reset por token, ou edição por `ADMIN`), isoladamente, **não** incrementa `session_version` nem derruba sessões já ativas em outros dispositivos.

---

## 🔁 Fluxo de desenvolvimento

```text
1. Resetar banco (opcional)      → npm run db:reset
2. Inicializar/atualizar banco   → npm run db:migrate
3. Cadastrar o primeiro usuário  → /register (vira ADMIN automaticamente)
4. Desenvolver normalmente       → npm run dev
5. Resetar se necessário         → npm run db:reset && npm run db:migrate
```

---

## 📚 Documentação adicional

- [`_docs/DATABASE.md`](./_docs/DATABASE.md) — estrutura das migrations, scripts de banco e referência de tabelas/views/roles.
- [`_docs/STORAGE.md`](./_docs/STORAGE.md) — fluxo de upload de avatar com Vercel Blob e validações de segurança.

---

## 📄 Licença

Projeto pessoal de estudo/portfólio. Sem licença definida — uso livre para fins de aprendizado.