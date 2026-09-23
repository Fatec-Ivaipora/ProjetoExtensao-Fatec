# Projeto de Extensão Fatec

## Painel administrativo

O site tem uma área administrativa em **`/admin`** para publicar notícias, editais, regimentos, formulários e demais seções, com envio de arquivos (PDF, DOC…).

**Arquitetura:** site estático (Vite + React) hospedado na Vercel, banco de dados **Firestore**, login do admin via **Firebase Authentication** (e-mail/senha) e arquivos anexados via **Vercel Blob** (o Firebase Storage exige o plano Blaze, que ainda não está ativo neste projeto). As operações sensíveis (criar/editar/excluir publicação, salvar destaques, gerar link de upload) passam por *serverless functions* em `api/`, que conferem o login do admin e aplicam rate limiting por IP antes de escrever no Firestore — as páginas públicas só leem, direto do Firestore, sem passar por essas functions.

### Configuração inicial (uma vez só)

1. **Firebase Authentication** — no [Console do Firebase](https://console.firebase.google.com/), projeto `extensaofatec-med`: em *Authentication → Sign-in method*, ative o provedor **E-mail/senha**; em *Authentication → Users*, clique em **Add user** e crie a conta única do admin. Copie o **UID** gerado.
2. **Firestore** — em *Firestore Database*, crie o banco (modo produção) se ainda não existir. Depois, em *Regras*, cole o conteúdo de [`firestore.rules`](./firestore.rules) e publique. **Sempre que esse arquivo mudar, republique manualmente no Console.**
3. **Admin SDK** — em *Configurações do projeto → Contas de serviço*, clique em **Gerar nova chave privada**. O JSON baixado tem `project_id`, `client_email` e `private_key`.
4. **Vercel Blob** — no dashboard do projeto na Vercel, aba *Storage → Create Database → Blob*, e conecte ao projeto.
5. Copie `.env.example` para `.env.local` (se ainda não existir) e preencha:
   - `FIREBASE_ADMIN_PROJECT_ID` / `FIREBASE_ADMIN_CLIENT_EMAIL` / `FIREBASE_ADMIN_PRIVATE_KEY` — do JSON do passo 3 (a private key mantém as quebras de linha como `\n`).
   - `ADMIN_UID` — do passo 1.
   - `BLOB_READ_WRITE_TOKEN` — depois de rodar `vercel link` (associa a pasta a um projeto na Vercel), rode `vercel env pull .env.local` pra puxar esse token automaticamente.
   - As `VITE_FIREBASE_*` já vêm preenchidas com a config pública do projeto.
6. As mesmas variáveis (exceto as que `vercel env pull` já sincroniza) precisam existir também no dashboard da Vercel (*Settings → Environment Variables*), senão o deploy de produção quebra.

### Rodando localmente

```bash
npm install
npm run dev   # roda `vercel dev`: serve o site Vite e as functions de api/ juntos, na mesma porta
```

- As publicações ficam no Firestore (uma coleção por seção, ex. `noticias`, `editais`…) e os destaques da home em `settings/highlights`.
- As páginas públicas mesclam o que foi publicado no painel com o conteúdo fixo de `src/data/academicPosts.ts`. Se o Firestore estiver fora do ar, o site continua no ar só com o conteúdo fixo.
- Rate limiting: cada rota de escrita aceita um número limitado de requisições por IP a cada 5 minutos (contador guardado na coleção interna `rateLimits`, sem acesso do client).

### Deploy

`vercel --prod`, ou conecte o repositório Git ao projeto na Vercel para deploy automático a cada push.

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
