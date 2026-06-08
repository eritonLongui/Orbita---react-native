# Login Google — funcionar para todo o time

O erro `DEVELOPER_ERROR` **não tem relação** com quem fez o commit no Git. É configuração entre o app instalado no celular/emulador e o **Firebase / Google Cloud**.

## Por que funcionou para uma pessoa e não para outra?

| Cenário | Motivo |
|--------|--------|
| **Android (emulador ou celular)** | Cada máquina usa um certificado de debug diferente. Só quem cadastrou o **SHA-1** no Firebase consegue logar. |
| **iOS simulador** | Costuma funcionar para todos se rodaram `npm run ios:prebuild` e o `GoogleService-Info.plist` está no repo. |
| **Expo Go** | Login nativo **não funciona** — é preciso dev build (`npm run ios` / `npm run android`). |

## O que o dono do Firebase precisa fazer (uma vez)

Acesso: [Firebase Console](https://console.firebase.google.com/) → projeto **orbita-fiap**

### 1. Authentication

**Build → Authentication → Sign-in method** → **Google** → **Ativado**.

### 2. App Android no Firebase

Se ainda não existir app Android:

1. **Project Settings** (engrenagem) → **Your apps** → **Add app** → Android  
2. Package name: `com.orbita.fiap`  
3. Baixe **`google-services.json`** e coloque na **raiz do repositório**  
4. Commit no Git (arquivo público, sem segredo)

No `app.json` já está previsto:

```json
"android": {
  "googleServicesFile": "./google-services.json"
}
```

(Descomente/adicione essa linha quando o arquivo existir.)

### 3. SHA-1 de cada desenvolvedor (Android)

Cada colega roda na máquina dele:

```bash
npm run auth:fingerprints
```

Envia o **SHA-1** (e se possível SHA-256) para quem administra o Firebase.

No console: **Project Settings → Android app → Add fingerprint** → colar cada SHA-1.

> Repita sempre que um colega novo for testar em **Android** no próprio computador.

### 4. OAuth Web Client (já no código)

O app usa o **Web Client ID** em `src/config/publicEnv.ts` (`EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`).  
No Google Cloud, esse client deve ser do tipo **Web**, não Android.

Confira em [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → OAuth 2.0 Client IDs.

### 5. iOS

- `GoogleService-Info.plist` na raiz (já no repo)  
- `app.json` → plugin `@react-native-google-signin/google-signin` com `iosUrlScheme` correto  
- Colega roda: `npm install` → `npm run ios:prebuild` → `npm run ios`

## Checklist para quem vai testar

```bash
git pull
npm install
npm run auth:fingerprints    # Android: mandar SHA-1 pro admin do Firebase
npm run ios:prebuild         # ou npm run android:prebuild
npm start
npm run ios                  # ou npm run android
```

**Não use Expo Go** para testar login Google.

## Solução “global” (recomendada para apresentação FIAP)

Em vez de cadastrar SHA-1 de cada notebook:

1. Gerar **um** build com EAS (mesmo certificado para todos):

   ```bash
   eas build --platform android --profile preview
   eas build --platform ios --profile preview
   ```

2. Cadastrar no Firebase **apenas** o SHA-1 desse build (EAS mostra no dashboard ou em `eas credentials`).

3. Distribuir o **mesmo APK/IPA** (TestFlight, link interno, etc.) — qualquer pessoa instala e o login funciona.

## Validar configuração

Com um APK instalado:

```bash
npx @react-native-google-signin/config-doctor
```

Siga as instruções do doctor (ele compara app vs console).

## Referência

- [Troubleshooting DEVELOPER_ERROR](https://react-native-google-signin.github.io/docs/troubleshooting)
