const { loadWebhooks, saveWebhooks } = require('../services/webhookService');

let webhooks = loadWebhooks();

const subscribeWebhook = (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send({ error: 'Webhook URL is required' });
    }

    if (webhooks.includes(url)) {
        return res.status(400).send({ error: 'Webhook URL is already subscribed' });
    }

    webhooks.push(url);
    saveWebhooks(webhooks);

    res.send({ message: 'Webhook subscribed successfully' });
};

const getWebhooks = (req, res) => {
    res.send({ webhooks });
};

module.exports = { subscribeWebhook, getWebhooks };
