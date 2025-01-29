require('dotenv').config();

const startCai = async function (token) {
    try {
        const client = new (await import("cainode")).CAINode();
        await client.login(token);
        console.log("Logged in to Character AI");
        return client;
    } catch (error) {
        console.error("Error logging in to Character AI:", error);
        throw error;  // Re-throw error to be handled upstream
    }
};

const endCai = async function (client) {
    try {
        if (client) {
            await client.logout();
            console.log("Logged out of Character AI");
        }
    } catch (error) {
        console.error("Error logging out of Character AI:", error);
    }
};

const textToSpeech = async (req, res) => {
    console.log("Received request to text to speech");

    let client;
    try {
        client = await startCai(process.env.CHARACTER_AI_ACCESS_TOKEN);

        const { cid, content, voiceId } = req.body;

        if (!cid || !content || !voiceId) {
            throw new Error("Missing required parameters: cid, content, or voiceId");
        }

        const sanitizedContent = content.replace(/(\r\n|\n|\r)/gm, "");

        console.log("Character ID:", cid);
        console.log("Voice ID:", voiceId);

        await client.character.connect(cid);
        await client.character.create_new_conversation(true);

        const response = await client.character.send_message(`!Re "${sanitizedContent}"`, false);

        if (!response || !response.turn || !response.turn.turn_key || !response.turn.candidates.length) {
            throw new Error("Invalid response from Character AI");
        }

        const turnId = response.turn.turn_key.turn_id;
        const candidateId = response.turn.candidates[0].candidate_id;
        const tts = await client.character.replay_tts(turnId, candidateId, voiceId);

        res.send(tts);
    } catch (error) {
        console.error("Error processing text-to-speech request:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    } finally {
        if (client) {
            await client.character.disconnect();
            await endCai(client);
        }
    }
};

module.exports = { textToSpeech };
