const functions = require('firebase-functions/v1');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

initializeApp();

/**
 * Quando um usuário faz login pela primeira vez (Google),
 * adiciona o claim "role: authenticated" no token JWT.
 * O Supabase usa esse claim para aplicar as políticas RLS.
 */
exports.processSignUp = functions.auth.user().onCreate(async (user) => {
  try {
    await getAuth().setCustomUserClaims(user.uid, {
      role: 'authenticated',
    });
    functions.logger.info(`role:authenticated definido para ${user.uid}`);
  } catch (error) {
    functions.logger.error('Erro ao definir custom claim:', error);
  }
});
