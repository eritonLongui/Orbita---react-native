/**
 * Script único: aplica role:authenticated em usuários que já existiam
 * antes do deploy da Cloud Function.
 *
 * Uso (na pasta firebase/):
 *   1. Baixe a service account: Firebase Console → Project Settings → Service accounts → Generate new private key
 *   2. Salve como firebase/service-account.json (NÃO commite no git)
 *   3. export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/service-account.json"
 *   4. node scripts/set-role-claims.js
 */
'use strict';

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, '..', 'service-account.json');

if (fs.existsSync(serviceAccountPath)) {
  initializeApp({ credential: cert(require(serviceAccountPath)) });
} else {
  initializeApp({ credential: applicationDefault() });
}

async function setRoleCustomClaim() {
  let nextPageToken;
  let count = 0;

  do {
    const listUsersResult = await getAuth().listUsers(1000, nextPageToken);
    nextPageToken = listUsersResult.pageToken;

    await Promise.all(
      listUsersResult.users.map(async (userRecord) => {
        try {
          await getAuth().setCustomUserClaims(userRecord.uid, { role: 'authenticated' });
          count += 1;
          console.log(`OK: ${userRecord.email ?? userRecord.uid}`);
        } catch (error) {
          console.error(`Falhou: ${userRecord.uid}`, error.message);
        }
      })
    );
  } while (nextPageToken);

  console.log(`\nConcluído. ${count} usuário(s) atualizado(s).`);
}

setRoleCustomClaim().then(() => process.exit(0));
