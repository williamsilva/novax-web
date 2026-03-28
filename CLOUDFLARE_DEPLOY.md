# Deploy do Novax no Cloudflare Pages

## O que foi ajustado

- Removido `clientSecret` do Angular.
- Troca de `authorization_code`, `refresh_token` e `revoke` movida para Cloudflare Pages Functions.
- Adicionado fallback SPA com `_redirects`.
- Adicionado `_headers` com headers básicos.
- Adicionado `wrangler.toml`.

## Estrutura nova

- `functions/api/auth/token.ts`
- `functions/api/auth/revoke.ts`
- `src/_redirects`
- `src/_headers`
- `wrangler.toml`

## Variáveis no Cloudflare Pages

Crie estas variáveis no projeto do Cloudflare Pages:

- `OAUTH_TOKEN_URL=https://api.acquamania.com.br/oauth2/token`
- `OAUTH_REVOKE_URL=https://api.acquamania.com.br/oauth2/revoke`
- `OAUTH_CLIENT_ID=novax@angular`
- `OAUTH_CLIENT_SECRET=SEU_SECRET_REAL`

## Build

- Build command: `npm install && npm run build:cloudflare`
- Build output directory: `dist`

## Redirect URI

No servidor OAuth, garanta que a redirect URI cadastrada seja:

- produção: `https://novax.acquamania.com.br/authorized`

## Observação importante

Esta versão já remove o `clientSecret` do navegador, que era o risco principal.

Os tokens ainda ficam em `localStorage`, porque essa é a arquitetura atual do projeto. Para um endurecimento maior, o ideal é migrar depois para BFF + cookie HttpOnly.
