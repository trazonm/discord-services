const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin SDK
const serviceAccount = require('../firebase.json');

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set.');
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL,
});

const db = getFirestore();
const webhooksRef = db.collection('webhooks');

/**
 * Loads all webhooks from Firestore.
 * @returns {Promise<Array>} An array of webhook URLs.
 */
const loadWebhooks = async () => {
    const snapshot = await webhooksRef.get();
    const webhooks = [];
    snapshot.forEach((doc) => {
        webhooks.push(doc.data().prodUrl); // Assuming the webhook document has a 'url' field
        webhooks.push(doc.data().testUrl);
    });
    return webhooks;
};

/**
 * Saves webhooks to Firestore.
 * @param {Array} webhooks - An array of webhook objects (each should have a 'name' and 'url').
 * @returns {Promise<void>}
 */
const saveWebhooks = async (webhooks) => {
    for (const webhook of webhooks) {
        if (!webhook.name || !webhook.prodUrl || !webhook.testUrl) {
            throw new Error('Each webhook must have a "name" and "url".');
        }
        await webhooksRef.doc(webhook.name).set({ prodUrl: webhook.prodUrl, testUrl: webhook.testUrl });
    }
};

module.exports = { loadWebhooks, saveWebhooks };
