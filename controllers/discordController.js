const { Client, GatewayIntentBits } = require('discord.js');
const { loadWebhooks } = require('../services/webhookService');
const fetch = require('node-fetch');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    try {
        // Reload webhooks to include any new subscriptions
        const webhooks = await loadWebhooks();
        console.log(`New message in ${message.channel.name}: ${message.content}`);

        const attachments = message.attachments.map((attachment) => ({
            url: attachment.url,
            name: attachment.name,
            size: attachment.size,
            contentType: attachment.contentType,
        }));

        const payload = {
            channel: message.channel.name,
            channelId: message.channel.id,
            author: message.author.username,
            userId: message.author.id,
            messageId: message.id,
            content: message.content,
            attachments: attachments.length > 0 ? attachments : null,
        };

        // Send the payload to both prodUrl and testUrl for each webhook
        webhooks.forEach((webhook) => {
            fetch(webhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            }).catch((err) => console.error(`Failed to post to webhook: ${err}`));
        });
    } catch (err) {
        console.error('Error handling message:', err);
    }
});

const startBot = (token) => {
    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });

    client.login(token);
};

module.exports = { startBot };
