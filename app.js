const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer'); // Add multer to handle file uploads
require('dotenv').config();

const { startBot } = require('./controllers/discordController');
const { subscribeWebhook, getWebhooks } = require('./controllers/webhookController');
const { htmlToImageFunction } = require('./controllers/htmlToImageController'); // Updated import
const { textToSpeech } = require('./controllers/textToSpeechController');
// const { startCai } = require('./controllers/textToSpeechController');

// Set up multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(bodyParser.json()); // This is fine for JSON data, not for file uploads

// Webhook routes
app.post('/subscribe', subscribeWebhook);
app.get('/webhooks', getWebhooks);
app.post('/tts', textToSpeech);

// HTML to Image route
app.post('/html-to-image', upload.single('htmlFile'), htmlToImageFunction); // Use multer to handle file uploads

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Start Discord bot
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
startBot(DISCORD_TOKEN);
