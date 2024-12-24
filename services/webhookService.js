const fs = require('fs');

const WEBHOOK_FILE = 'webhooks.json';

const loadWebhooks = () => {
    try {
        return JSON.parse(fs.readFileSync(WEBHOOK_FILE, 'utf8'));
    } catch {
        console.log('No existing webhooks file found. Starting fresh.');
        return [];
    }
};

const saveWebhooks = (webhooks) => {
    fs.writeFileSync(WEBHOOK_FILE, JSON.stringify(webhooks, null, 2));
};

module.exports = { loadWebhooks, saveWebhooks };
