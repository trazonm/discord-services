require('dotenv').config();


const startCai = (async function (token) {
   const client = new (await import("cainode")).CAINode();
   await client.login(token);  
   console.log("Logged in to Character AI");
   return client;
})

const endCai = (async function (client) {
   await client.logout();  
   console.log("Logged out of Character AI");
   return;
})

const textToSpeech = async (req, res) => {

   console.log("Received request to text to speech");


   const client = await startCai(process.env.CHARACTER_AI_ACCESS_TOKEN);

   const cid = req.body.cid;
   const text = req.body.content;
   const voiceId = req.body.voiceId;
   const content = text.replace(/(\r\n|\n|\r)/gm, "");

   console.log("Character ID", cid);
   console.log("Voice ID", voiceId);

   await client.character.connect(cid);
   await client.character.create_new_conversation(true);

   const response = await client.character.send_message(`!Re "${content}"`, false);

   const turnId = response.turn.turn_key.turn_id;
   const candidateId = response.turn.candidates[0].candidate_id;
   const tts = await client.character.replay_tts(turnId, candidateId, voiceId);

   res.send(tts);

   await client.character.disconnect();
   await endCai(client);

}

module.exports = { textToSpeech };