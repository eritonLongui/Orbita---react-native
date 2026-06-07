# Distribuir o Orbita para usuários finais

Usuários **não recebem** e **não configuram** nenhuma chave. Eles instalam o app (TestFlight, Play Store, APK) e usam login Google — pronto.

O que você precisa entender é a diferença entre **quem desenvolve** e **quem usa**.

---

## Arquitetura (quem vê qual segredo)

```
┌─────────────────────────────────────────────────────────────┐
│  Celular do usuário (app instalado)                          │
│  • Firebase API key, Supabase anon key, Google Client ID     │
│    → embutidos no app na hora do BUILD (públicos por design) │
│  • Nunca contém: OpenAI, service account, access token     │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS + JWT Firebase
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Supabase (produção)                                         │
│  • RLS: cada usuário só vê seus dados                        │
│  • Edge Function lyra-chat                                   │
│    → OPENAI_API_KEY fica nos Secrets do Supabase (servidor)  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                    OpenAI API (só o servidor chama)
```

| Segredo | Onde fica em produção | Usuário final vê? |
|---------|----------------------|-------------------|
| `OPENAI_API_KEY` | Supabase → Edge Functions → Secrets | **Não** |
| `SUPABASE_ACCESS_TOKEN` | Só na máquina/CI de deploy | **Não** |
| Firebase service account | Scripts admin / CI | **Não** |
| `EXPO_PUBLIC_*` (Firebase, Supabase anon, Google) | Dentro do `.ipa` / `.apk` | Sim*, mas é esperado |

\* Essas chaves são **de cliente**. A segurança vem das **regras** (Firebase Storage/Auth, Supabase RLS), não de escondê-las do app.

A Lyra já usa `supabase.functions.invoke('lyra-chat')` — a OpenAI **nunca** passa pelo celular.

---

## Passo a passo para lançar

### 1. Backend de produção (uma vez, só você / CI)

```bash
# Na sua máquina ou GitHub Actions, com .env.keys ou EAS/CI secrets
npm run deploy:supabase
```

Isso:
- aplica migrations no projeto Supabase
- publica a function `lyra-chat`
- grava `OPENAI_API_KEY` nos **Secrets do Supabase** (Dashboard → Edge Functions → Secrets)

Confirme no Dashboard que `OPENAI_API_KEY` está configurada. **Todos os usuários** passam a usar a Lyra sem você repassar a chave.

Opcional: configure também no Firebase:
- regras do Storage (`avatars/{userId}`)
- domínios autorizados para OAuth

### 2. Build de produção do app (EAS)

Instale o EAS CLI e vincule o projeto Expo:

```bash
npm install -g eas-cli
eas login
eas build:configure
```

Defina secrets de **build** no Expo (só para gerar o binário — não vão para o repositório):

```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://....supabase.co"
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sb_publishable_..."
# ... demais EXPO_PUBLIC_* se quiser sobrescrever publicEnv.ts
```

Gere o app:

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

O `eas.json` na raiz define o profile `production`.

**Alternativa FIAP (sem EAS pago):** build local após `expo prebuild` e assinatura manual — as chaves públicas em `src/config/publicEnv.ts` já entram no bundle.

### 3. Distribuir para usuários

| Canal | Uso |
|-------|-----|
| **TestFlight** (iOS) | beta com professores / piloto |
| **Google Play** (internal / closed testing) | Android |
| **Firebase App Distribution** | link direto para testadores |
| **Lojas** (App Store / Play produção) | lançamento público |

Usuário: instala → abre → login Google → tudo funciona.

---

## O que NÃO fazer

- **Não** colocar `OPENAI_API_KEY` no app, `publicEnv.ts` ou `.env` commitado descriptografado.
- **Não** enviar `.env.keys` para usuários finais — só para devs que fazem deploy.
- **Não** usar Render só para “esconder” keys do app mobile — o app precisa das chaves públicas no build; o que importa é a OpenAI ficar no Supabase.

---

## Ambientes (recomendado para crescer)

| Ambiente | Supabase | App |
|----------|----------|-----|
| **Dev** | projeto dev ou mesmo com RLS | Expo Go / dev build |
| **Produção** | projeto prod | EAS `production` + lojas |

Se no futuro tiver projeto Supabase separado para prod, atualize `publicEnv.ts` ou use EAS Secrets só no profile `production`.

---

## Checklist antes de abrir para muitos usuários

- [ ] `OPENAI_API_KEY` nos Secrets do Supabase (produção)
- [ ] RLS migrations aplicadas (`005`, `006` Firebase JWT)
- [ ] `lyra-chat` deployada e testada com usuário real
- [ ] Firebase Storage rules para avatares
- [ ] Build **production** (não Expo Go) para image picker / Google Sign-In nativo
- [ ] Política de privacidade / termos (tela já existe no app)

---

## Resumo em uma frase

**Você coloca os segredos pesados no servidor (Supabase Secrets); o app de produção só carrega chaves públicas no build; usuários baixam o binário e nunca configuram nada.**
