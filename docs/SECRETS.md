# Variáveis de ambiente

## Quem só roda ou builda o app (professor, colega, testador)

**Não precisa de `.env`.**

Tudo que o app precisa está em `src/config/publicEnv.ts` (Firebase, Supabase, Google).

```bash
git clone <repo>
npm install
npm run ios:prebuild   # ou android:prebuild — primeira vez
npm run ios            # dev build no simulador/dispositivo
```

A Lyra chama o Supabase na nuvem — a `OPENAI_API_KEY` **não** vai no celular.

---

## Quem faz deploy no Supabase (só você)

Crie `.env` local (gitignored) com:

```
SUPABASE_ACCESS_TOKEN=sbp_...
SUPABASE_PROJECT_REF=yifgbmrpnpljjrmjwwfq
OPENAI_API_KEY=sk-...
```

Depois:

```bash
npm run deploy:supabase
```

Isso publica migrations + `lyra-chat` e grava a OpenAI nos Secrets do Supabase.

---

## Validar se o Supabase está ok

```bash
npm run validate:supabase
```

Não precisa de `.env` — usa os mesmos defaults do app.

---

## Usuários finais (loja / TestFlight)

Leia [PRODUCTION.md](./PRODUCTION.md). Eles só instalam o app; nunca configuram env.
