# Orbita

App mobile (React Native / Expo) para acompanhar sua órbita de bem-estar e conversar com a **Lyra**, copiloto por voz e texto.

**Stack:** Expo 56 · Tamagui · Firebase Auth · Supabase · Edge Function `lyra-chat`

---

## Escolha seu caminho

| Objetivo | Vá para |
|----------|---------|
| Só testar o app (professor/colega) | [Caminho A — Instalar APK](#caminho-a--só-testar) |
| Desenvolver no simulador/emulador | [Caminho B — Dev local](#caminho-b--desenvolver-localmente) |
| Deploy backend / build EAS | [Caminho C — Mantenedor](#caminho-c--mantenedor) |

---

## Caminho A — Só testar

Não precisa clonar o repositório nem configurar `.env`.

1. Abra os **builds do projeto** no Expo:  
   https://expo.dev/accounts/marcomendessv/projects/Orbita/builds
2. Baixe o APK Android mais recente com profile **preview** (status *finished*).
3. Instale no celular Android e abra o app.
4. Toque em **Continuar com Google**.

O login Google no APK de preview já usa o certificado EAS cadastrado no Firebase — funciona para qualquer testador.

**iOS em iPhone físico** exige conta Apple Developer (US$ 99/ano). Alternativas:

- Build **preview-simulator** no EAS (só Simulador iOS no Mac).
- Dev local no Mac: [Caminho B](#caminho-b--desenvolver-localmente).

---

## Caminho B — Desenvolver localmente

### Pré-requisitos

- **Node.js 20+** e npm
- **iOS (Mac):** Xcode + Simulador iOS
- **Android (opcional):** Android Studio + emulador

### Setup automático

```bash
git clone https://github.com/eritonLongui/Orbita---react-native.git
cd Orbita---react-native

npm run setup          # instala dependências + valida backend
npm run setup:ios      # primeira vez: gera pasta ios/
# ou: npm run setup:android
```

### Rodar o app

Terminal 1:

```bash
npm start
```

Terminal 2:

```bash
npm run ios       # simulador iOS (Mac)
# ou: npm run android
```

### Importante

- **Não precisa de `.env`** — chaves públicas em [`src/config/publicEnv.ts`](src/config/publicEnv.ts).
- **Não use Expo Go** — login Google exige dev build nativo.
- Se `npx` não funcionar no terminal, use sempre `npm run <comando>`.
- Login Google em **Android dev local**: cada máquina pode precisar do SHA-1 no Firebase. Veja [`docs/GOOGLE_LOGIN.md`](docs/GOOGLE_LOGIN.md).

### Só validar (sem instalar)

```bash
npm run setup:check
```

---

## Caminho C — Mantenedor

Para publicar migrations, Lyra no Supabase ou gerar APK/IPA novo.

1. Copie [`.env.example`](.env.example) → `.env` (local, gitignored):

   ```
   SUPABASE_ACCESS_TOKEN=sbp_...
   SUPABASE_PROJECT_REF=yifgbmrpnpljjrmjwwfq
   OPENAI_API_KEY=sk-...
   ```

2. Deploy do backend:

   ```bash
   npm run deploy:supabase
   npm run validate:supabase
   ```

3. Build instalável (EAS):

   ```bash
   npm run build:preview:android
   npm run build:preview:ios-simulator   # Mac simulador, sem conta Apple paga
   ```

4. Credenciais Android (SHA-1):

   ```bash
   npm run eas:credentials:android
   ```

Documentação completa: [`docs/PRODUCTION.md`](docs/PRODUCTION.md)

---

## Scripts npm

| Comando | Descrição |
|---------|-----------|
| `npm run setup` | Instala deps + valida arquivos e Supabase |
| `npm run setup:ios` | Setup + `expo prebuild` iOS |
| `npm run setup:android` | Setup + `expo prebuild` Android |
| `npm run setup:all` | Setup + prebuild iOS e Android |
| `npm run setup:check` | Só checagens, sem instalar |
| `npm start` | Metro bundler |
| `npm run start:clean` | Metro com cache limpo |
| `npm run ios` | Build e run no simulador iOS |
| `npm run android` | Build e run no Android |
| `npm run validate:supabase` | Testa API e `lyra-chat` na nuvem |
| `npm run build:preview:android` | APK EAS para testadores |
| `npm run build:preview:ios-simulator` | Build iOS simulador (EAS) |
| `npm run auth:fingerprints` | SHA-1 local para Firebase (dev Android) |
| `npm run reset:native` | Regenera pastas `ios/` e `android/` |

---

## Documentação

| Arquivo | Conteúdo |
|---------|----------|
| [`docs/SECRETS.md`](docs/SECRETS.md) | Variáveis de ambiente e quem precisa de quê |
| [`docs/GOOGLE_LOGIN.md`](docs/GOOGLE_LOGIN.md) | Login Google e `DEVELOPER_ERROR` |
| [`docs/PRODUCTION.md`](docs/PRODUCTION.md) | Distribuição, EAS e usuários finais |

---

## Estrutura resumida

```
src/
  screens/     # Telas (auth, mission, orbit, lyra, profile)
  components/  # UI e blocos reutilizáveis
  config/      # publicEnv.ts (chaves públicas)
  services/    # Firebase, Supabase, perfil
supabase/      # Migrations e Edge Function lyra-chat
firebase/      # Cloud Functions
scripts/       # Setup, deploy e validação
```
