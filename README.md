# Missões da Família — Etapa 1

Estrutura inicial do projeto: Next.js + TypeScript + Tailwind, clients do
Supabase (browser/server), schema completo do banco com RLS, e o shell de
navegação (seletor de área, login/cadastro do responsável, placeholders das
áreas do responsável e da criança).

> Este projeto foi gerado em um ambiente sem acesso à internet, então os
> passos abaixo (`npm install`, `supabase db push`, deploy de functions)
> precisam ser rodados na sua máquina.

## 1. Instalar dependências

```bash
npm install
```

## 2. Configurar variáveis de ambiente

O arquivo `.env.local` já está preenchido com as credenciais públicas do
projeto `tisevzhlmdralhpiqfdw`:

```
NEXT_PUBLIC_SUPABASE_URL=https://tisevzhlmdralhpiqfdw.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Essa é a **publishable key** (equivalente à antiga `anon key`) — é segura
para uso no client, pois toda a proteção de dados vem do RLS. A
`service_role key` **nunca** deve entrar neste repositório; ela só será
usada como secret dentro das Edge Functions (Etapa 4 em diante), via:

```bash
supabase secrets set SERVICE_ROLE_KEY=... --project-ref tisevzhlmdralhpiqfdw
```

## 3. Aplicar as migrações no banco

```bash
npx supabase login
npx supabase link --project-ref tisevzhlmdralhpiqfdw
npx supabase db push
```

Isso aplica, na ordem:
- `0001_init_schema.sql` — todas as tabelas do produto
- `0002_rls_policies.sql` — isolamento por família/criança
- `0003_seed_catalog.sql` — temas de personagem e catálogo de conquistas
- `0004_push_subscriptions.sql` — inscrições de Web Push
- `0005_realtime.sql` — habilita Realtime nas notificações in-app

## 4. Gerar os tipos TypeScript do banco

```bash
npm run types:gen
```

Isso substitui o placeholder em `lib/types/database.types.ts` pelos tipos
reais, gerados a partir do schema aplicado.

## 5. Rodar o projeto

```bash
npm run dev
```

## O que já existe nesta etapa

- Estrutura de rotas: `/` (seletor "Quem está usando?"), `/entrar`,
  `/cadastro`, `/vincular-dispositivo`, `/dashboard` (responsável),
  `/home` (criança).
- Autenticação do responsável via Supabase Auth (email/senha).
- Schema completo (16 tabelas) + RLS cobrindo o isolamento entre famílias.
- Modelo de sessão da criança definido: Supabase Anonymous Auth com
  `app_metadata.child_id`, criado pela futura Edge Function `link-device`.
- Design tokens no Tailwind (`streak`, `points`, `xp`) já alinhados ao
  design system da seção 39 do spec.
- Manifest PWA base (faltam os ícones em `/public/icons`).

## Animações, som e notificações

- `components/Celebration.tsx` — overlay reutilizável com confete
  (`lib/confetti.ts`) + som sintetizado (`lib/sounds.ts`) para: pontos
  ganhos, subida de nível, Master Level, streak recuperado e resgate de
  recompensa. Basta renderizar `<Celebration kind="reward_redeemed" ... />`
  quando a Etapa 8 (loja/resgate) existir.
- Sons são sintetizados via Web Audio API — não dependem de nenhum
  arquivo de áudio de terceiros/licenciado. Ver comentário no topo de
  `lib/sounds.ts` para trocar por arquivos reais no futuro.
- Notificações in-app (tempo real) e push (PWA) — ver `NOTIFICATIONS.md`.
- Deploy (GitHub + Vercel) — ver `DEPLOY.md`.

## O que ainda não existe (próximas etapas)

- Edge Functions (`approve-task`, `redeem-reward`, `verify-pin`,
  `link-device`, `generate-family-code`) — pastas já criadas em
  `supabase/functions/`, vazias.
- CRUD de famílias/crianças/PIN (Etapa 2).
- Geração de tarefas a partir de `task_templates` (Etapa 3).
- Telas reais de missões, loja, dashboard (Etapas 6–10).

Cada etapa seguinte assume que esta (Etapa 1) já está rodando localmente
com o banco migrado.
