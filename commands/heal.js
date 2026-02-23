const funcall = require("../modules/funcall.js");
//simple ping command to check if the bot is online.
const strifecall = require("../modules/strifecall.js");
exports.type = "house";
exports.desc = "Restores your character to full health";
exports.use = `">heal" refills your vitality, as long as your sprite is alive, released, and you are both in the house.`;
exports.run = (client, message, args) => {
  var userid = message.guild.id.concat(message.author.id);
  var charid = client.userMap.get(userid,"possess");
  var spriteid = client.sburbMap.get(userid,"spriteID");
  
  if(spriteid=="") {
    message.channel.send("If only you had some sort of magic tutorial npc to heal you. Alas, such things surely are but make-believe...");
    return;
  }

  if(!client.charcall.charData(client,spriteid,"alive")) {
	message.channel.send("Your sprite is dead.\nThey cannot heal you.");
	return;
  }
  
  let local = client.charcall.charData(client,charid,"local");
  let enter = client.landMap.get(local[4],"enter");
  let gel = client.charcall.allData(client,userid,charid,"gel");
  
  let playLocal = client.charcall.charData(client,charid,"local");
  let spriteLocal = client.charcall.charData(client,spriteid,"local");
		
  let isSameRoom = playLocal[0]==spriteLocal[0]&&playLocal[1]==spriteLocal[1]&&playLocal[2]==spriteLocal[2]&&playLocal[3]==spriteLocal[3]&&playLocal[4]==spriteLocal[4];

  if(isSameRoom){
    if(enter==true||client.funcall.dmcheck(client,message)){
      client.funcall.tick(client,message);
      client.charcall.setAnyData(client,userid,charid,gel,"vit");
      client.tutorcall.progressCheck(client,message,38,["text","You are fully healed by a sprite!"]);
	  return;
    } else {
      message.channel.send("Your sprite is not developed enough to understand what you're asking of it.");
	  return;
    }
  } else {
    message.channel.send("You can only be healed by your sprite if you're in the same room!");
	return;
  }
}
