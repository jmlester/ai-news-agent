const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function getFirestore() {
  return admin.firestore();
}

module.exports = { getFirestore };
