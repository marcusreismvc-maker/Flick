# Notificações — in-app e push

O produto tem dois canais, que já compartilham a mesma origem de dados
(tabela `notifications`):

## 1. In-app (tempo real, já funcional)

`components/NotificationBell.tsx` escuta a tabela `notifications` via
Supabase Realtime e mostra um sininho com contador de não lidas. Basta
renderizar:

```tsx
<NotificationBell recipientType="parent" recipientId={user.id} />
// ou, na área da criança:
<NotificationBell recipientType="child" recipientId={childId} />
```

Não precisa de nenhuma configuração extra além da migração
`0005_realtime.sql` já estar aplicada.

## 2. Push (fora do app, precisa de configuração única)

Usado quando o app não está aberto — ex: "João concluiu a missão" chega
mesmo com o responsável de app fechado.

### Gerar as chaves VAPID (uma vez)

```bash
npx web-push generate-vapid-keys
```

Isso gera um par de chaves pública/privada. Guardar:

- `VAPID_PUBLIC_KEY` → variável `NEXT_PUBLIC_VAPID_PUBLIC_KEY` no `.env.local`
  e na Vercel (é pública, vai para o client).
- `VAPID_PRIVATE_KEY` → **nunca** no `.env.local`. Só como secret da
  Edge Function:

  ```bash
  supabase secrets set VAPID_PUBLIC_KEY=... VAPID_PRIVATE_KEY=... \
    VAPID_SUBJECT="mailto:contato@seuapp.com" --project-ref tisevzhlmdralhpiqfdw
  ```

### Deploy da function

```bash
supabase functions deploy send-push --project-ref tisevzhlmdralhpiqfdw
```

### Inscrever um dispositivo

Chamar `subscribeToPush()` de `lib/push-client.ts` depois que o
usuário concede a permissão do navegador (ex: um botão "Ativar
notificações" nas Configurações — seção 41/42 do spec já prevê essa
tela).

### Disparar uma notificação

Qualquer Edge Function que conceda pontos/XP, ou o job diário de
streak, deve chamar `send-push` internamente (via `fetch` para a URL
da function, com a service_role key), por exemplo depois de aprovar
uma missão:

```ts
await fetch(`${SUPABASE_URL}/functions/v1/send-push`, {
  method: "POST",
  headers: { Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
  body: JSON.stringify({
    family_id: familyId,
    recipient_type: "parent",
    recipient_id: parentUserId,
    title: "João concluiu Lavar prato",
    body: "Toque para aprovar",
    url: "/dashboard/aprovacoes",
  }),
});
```

Isso entra junto com a Edge Function `approve-task` na Etapa 4.

## Frequência

Seguindo a seção 24 do spec ("não criar notificações excessivas"): o
gatilho de push deve ficar restrito a eventos que exigem ação do
responsável (aprovação pendente, resgate pendente) ou marcos
importantes da criança (subiu de nível, streak em risco) — não a cada
pontinho ganho.
