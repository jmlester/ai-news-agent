const { getFirestore } = require('./firebaseClient');

async function composeUserContext(userId) {
  const db = getFirestore();
  const userDoc = await db.collection('userProfiles').doc(userId).get();

  const userProfile = userDoc.exists ? userDoc.data() : null;

  const historySnap = await db
    .collection('history')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(5)
    .get();

  const recentArticles = historySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const toolsSnap = await db
    .collection('tools')
    .where('usedBy', 'array-contains', userId)
    .orderBy('lastUsed', 'desc')
    .limit(5)
    .get();

  const recentTools = toolsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return { userProfile, recentArticles, recentTools };
}

module.exports = { composeUserContext };