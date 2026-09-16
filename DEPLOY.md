# Deploy — colocando o app online

## Por que não "só GitHub"

O GitHub guarda o código e roda o CI (`.github/workflows/ci.yml`), mas não
executa a aplicação. Este app usa Server Actions, Server Components e
middleware do Next.js — ou seja, precisa de um servidor Node rodando, não
apenas arquivos estáticos. **GitHub Pages não serve para isso.**

O caminho padrão (e gratuito no plano hobby) é:

**GitHub (código) → Vercel (hospedagem, conecta direto no repo)**

A Vercel é feita pela mesma equipe do Next.js, faz deploy automático a
cada push, e o app fica com uma URL pública tipo
`missoes-da-familia.vercel.app` (ou um domínio próprio depois).

## Passo a passo

1. Criar o repositório no GitHub e subir o código:

   ```bash
   cd gamificacao-familiar
   git init
   git add .
   git commit -m "Etapa 1: estrutura, schema, auth, animações e notificações"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/gamificacao-familiar.git
   git push -u origin main
   ```

   **Confira antes de commitar**: o `.gitignore` já exclui `.env.local`,
   mas vale abrir o arquivo e confirmar que nenhum segredo real (a
   `service_role key`, por exemplo) foi digitado nele por engano.

2. Em [vercel.com](https://vercel.com), "Import Project" → selecionar o
   repositório no GitHub.

3. Nas variáveis de ambiente do projeto na Vercel, adicionar:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (depois de gerar as chaves — ver
     `NOTIFICATIONS.md`)

4. Deploy. A partir daí, todo `git push` na `main` gera um deploy novo
   automaticamente.

5. (Opcional) Repetir as duas primeiras variáveis também como **GitHub
   Secrets** do repositório (`Settings → Secrets and variables →
   Actions`), para o workflow de CI conseguir rodar `npm run build`.

## Banco de dados

O Supabase (`tisevzhlmdralhpiqfdw`) já está hospedado — não precisa de
nenhum passo extra de deploy para o banco. Só é preciso ter rodado
`supabase db push` (ver `README.md`) antes do primeiro deploy do app.
