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

### 2. Login Google em produção (funciona para **qualquer** usuário)

Em dev, cada notebook Android tem SHA-1 diferente — por isso só quem cadastrou o fingerprint loga.

Em **produção**, todo mundo instala o **mesmo** `.ipa` / `.apk` assinado com **um** certificado. Você cadastra **esse** SHA-1 no Firebase uma vez e pronto — professor, colega e usuário final logam igual.

#### 2.1 Firebase (uma vez)

1. [Firebase Console](https://console.firebase.google.com/) → **orbita-fiap**
2. **Authentication** → **Google** → ativado
3. **Project Settings** → app **Android** `com.orbita.fiap`
   - Se não existir, crie e baixe `google-services.json` → coloque na **raiz do repo**
   - Em `app.json`, adicione em `android`:
     ```json
     "googleServicesFile": "./google-services.json"
     ```
4. App **iOS** `com.orbita.fiap` — `GoogleService-Info.plist` já está no repo

#### 2.2 SHA-1 do build de produção (não do notebook de cada dev)

Depois do primeiro build EAS Android:

```bash
eas credentials -p android
```

Copie o **SHA-1** (e SHA-256) do keystore de **upload/production** e cadastre em Firebase → Android app → **Add fingerprint**.

Se for publicar na **Play Store**, cadastre também o SHA-1 de **App signing** (Play Console → Setup → App signing) — a Google re-assina o app e esse fingerprint também precisa estar no Firebase.

> iOS em produção (TestFlight/App Store): não usa SHA-1; o plist + bundle id bastam.

#### 2.3 Build EAS

```bash
npm install -g eas-cli
eas login
eas build:configure
```

Opcional — secrets no Expo (só se quiser sobrescrever `publicEnv.ts`):

```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://....supabase.co"
```

**Teste interno (FIAP, antes da loja):**

```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

**Loja (produção final):**

```bash
eas build --platform ios --profile production
eas build --platform android --profile production
```

Perfis em `eas.json`: `preview` gera APK para link interno; `production` gera AAB/IPA para lojas.

### 3. Distribuir para usuários

| Canal | Uso |
|-------|-----|
| **TestFlight** (iOS) | beta com professores / piloto |
| **Google Play** (internal / closed testing) | Android |
| **Firebase App Distribution** | link direto para testadores |
| **Lojas** (App Store / Play produção) | lançamento público |

Usuário: instala o **binário de produção** → abre → login Google → funciona (sem configurar nada).

**Não** peça para usuários finais rodarem `npm run ios` ou cadastrarem SHA-1 — isso é só ambiente de desenvolvimento. Veja também [GOOGLE_LOGIN.md](./GOOGLE_LOGIN.md).

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
- [ ] `google-services.json` no repo + `googleServicesFile` no `app.json` (Android)
- [ ] SHA-1 do keystore **EAS/production** (e Play App Signing, se Android na loja) no Firebase
- [ ] Build **preview** ou **production** via EAS (não Expo Go / não dev build local)
- [ ] Política de privacidade / termos (tela já existe no app)

---

## Resumo em uma frase

**Você coloca os segredos pesados no servidor (Supabase Secrets); o app de produção só carrega chaves públicas no build; usuários baixam o binário e nunca configuram nada.**
