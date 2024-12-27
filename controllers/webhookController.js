const { loadWebhooks, saveWebhooks } = require('../services/webhookService');

/**
 * Subscribes a new webhook URL.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const subscribeWebhook = async (req, res) => {
    const { prodUrl, testUrl, name } = req.body;

    if (!prodUrl || !testUrl) {
        return res.status(400).send({ error: 'All Webhook URLs (prod and test) are required.' });
    }

    try {
        // Load current webhooks
        const webhooks = await loadWebhooks();

        if (webhooks.includes(prodUrl) || webhooks.includes(testUrl)) {
            return res.status(400).send({ error: 'Webhook URL is already subscribed.' });
        }

        // Add the new webhook and save
        const updatedWebhooks = [{ name: name, prodUrl: prodUrl, testUrl: testUrl }];
        await saveWebhooks(updatedWebhooks);

        res.send({ message: 'Webhook subscribed successfully.' });
    } catch (error) {
        console.error('Error subscribing webhook:', error);
        res.status(500).send({ error: 'Failed to subscribe webhook. Please try again later.' });
    }
};

/**
 * Retrieves all subscribed webhooks.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getWebhooks = async (req, res) => {
    try {
        const webhooks = await loadWebhooks();
        res.send({ webhooks });
    } catch (error) {
        console.error('Error fetching webhooks:', error);
        res.status(500).send({ error: 'Failed to load webhooks. Please try again later.' });
    }
};

module.exports = { subscribeWebhook, getWebhooks };
