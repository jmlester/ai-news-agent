const { getFirestore } = require('./firebaseClient');

async function seedFirestore() {
  const db = getFirestore();
  const userId = 'testuser1';

  const userRef = db.collection('userProfiles').doc(userId);
  await userRef.set({
    test: true,
    name: 'Test User',
    role: 'tester',
  });

  const historyRef = db.collection('history');
  await historyRef.add({
    userId,
    title: 'Understanding AI Ethics',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  });
  await historyRef.add({
    userId,
    title: 'Latest Advances in Machine Learning',
    timestamp: new Date(),
  });

  const toolsRef = db.collection('tools');
  await toolsRef.add({
    name: 'Text Summarizer',
    usedBy: [userId],
    lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2),
  });
  await toolsRef.add({
    name: 'GPT Prompt Optimizer',
    usedBy: [userId],
    lastUsed: new Date(),
  });

  console.log('✅ Firestore seeded with test data');
}

seedFirestore().catch(console.error);