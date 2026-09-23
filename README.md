# Projeto de Extensão Fatec

Site institucional dos projetos de extensão da Fatec Ivaiporã. Reúne, num só lugar, as páginas de Graduação, Pesquisa e Extensão (ligas acadêmicas, PIC/PICV, grupos de pesquisa, monitoria, TCC/TCR, revista científica, etc.) e um painel administrativo em **`/admin`**, onde a equipe publica notícias, editais, regimentos e formulários relacionados aos projetos da Fatec, com upload de arquivo (PDF, DOC…) quando for o caso.

## Como usar

- **Site público:** todo mundo vê as publicações já feitas, organizadas por seção.
- **Painel admin (`/admin`):** só quem tem login publica, edita ou exclui conteúdo. Login por e-mail/senha (Firebase Authentication).

---

## Detalhes técnicos (para quem for mexer no projeto)

Stack: Vite + React, hospedado na Vercel. Banco de dados **Firestore**, login do admin via **Firebase Authentication**, upload de arquivo via **Vercel Blob** (o Storage do Firebase exige o plano Blaze, que ainda não está ativo). Escritas (criar/editar/excluir publicação, salvar destaques) passam por *serverless functions* em `api/`, que conferem o login do admin e aplicam rate limiting por IP antes de gravar no Firestore; leitura é direto do Firestore pelo client.

### Configuração inicial (uma vez só)

1. **Firebase Authentication** — [Console do Firebase](https://console.firebase.google.com/), projeto `extensaofatec-med`: em *Authentication → Sign-in method*, ative **E-mail/senha**; em *Authentication → Users*, crie a conta única do admin e copie o **UID**.
2. **Firestore** — crie o banco (modo produção) se ainda não existir. Em *Regras*, cole o conteúdo de [`firestore.rules`](./firestore.rules) e publique. Sempre que esse arquivo mudar, republique manualmente no Console.
3. **Admin SDK** — *Configurações do projeto → Contas de serviço → Gerar nova chave privada*. O JSON baixado tem `project_id`, `client_email` e `private_key`.
4. **Vercel Blob** — no dashboard do projeto na Vercel, aba *Storage → Create Database → Blob*, conecte ao projeto.
5. Copie `.env.example` para `.env.local` e preencha `FIREBASE_ADMIN_*` (passo 3), `ADMIN_UID` (passo 1) e `BLOB_READ_WRITE_TOKEN` (rode `vercel link` e depois `vercel env pull .env.local`). As `VITE_FIREBASE_*` já vêm preenchidas.
6. Cadastre as mesmas variáveis no dashboard da Vercel (*Settings → Environment Variables*) — senão o deploy de produção quebra.

### Rodando localmente

```bash
npm install
npm run dev   # roda `vercel dev`: site Vite + functions de api/ juntos, na mesma porta
```

### Deploy

`vercel --prod`, ou conecte o repositório Git ao projeto na Vercel para deploy automático a cada push.
