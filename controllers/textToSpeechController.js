const { CharacterAI } = require("node_characterai"); 
const characterAI = new CharacterAI();

const textToSpeech = async (req, res) => {

         //TTS Character
         const cid = req.body.cid;
         const character = await characterAI.fetchCharacter(cid);
   
         const dm = await character.DM();
   
         // send it a message
         const message = await dm.sendMessage(`!Re ${req.body.content}`);
   
         const potentialVoices = await characterAI.searchCharacterVoices("Miles G Morales");
   
         // get the text content
         
         //Miles G Morales voice (Earth 42)
         let tts = await message.getTTSUrl(req.body.voiceId);
   
         res.send(tts);

}
const startCai = (token) => {
   characterAI.authenticate(token).then(async () => {
      console.log("Logged in to Character AI");
   });
}

module.exports = { textToSpeech, startCai };
