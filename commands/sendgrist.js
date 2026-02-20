const funcall = require("../modules/funcall.js");
//simple ping command to check if the bot is online.
const strifecall = require("../modules/strifecall.js");
exports.type = "sburb";
exports.desc = "Sends grist to a player";
exports.use = `">sendgrist [type of grist][# of grist given][ping of target player]" sends a player any amount of grist from your own cache.`;
exports.run = (client, message, args) => {

  var userid = message.guild.id.concat(message.author.id);
  var charid = client.userMap.get(userid,"possess");

//retrieve player location and check for computer

  var local = client.charcall.charData(client,charid,"local");
  var room = client.landMap.get(local[4],local[0])[local[1]][local[2]][2][local[3]];

  let compCheck = client.traitcall.compTest(client,message,charid,room);

  if(compCheck[0]==false){
    message.channel.send("To use GRIST TORRENT commands, you must have an item with the COMPUTER trait either in your Inventory or in the room you are in.");
    return;
  }
  if(compCheck[2]==false){
    message.channel.send("It seems that you have a computer, but you don't have GRIST TORRENT installed on it!");
    return;
  }

  const gristTypes = ["build","uranium","amethyst","garnet","iron","marble","chalk","shale","cobalt","ruby","caulk","tar","amber","artifact","zillium","diamond"];

  if(!args[0]){
    message.channel.send(`to use this command, the format is: \n${client.auth.prefix}sendgrist [type of grist] [# of grist given] [ping of target player]`);
    return;
  }
  select = parseInt(args[0], 10);
  if(isNaN(select)){
    if(gristTypes.includes(args[0])){
      select = gristTypes.indexOf(args[0]);
    } else {
      message.channel.send("That is not a valid argument");
    }
  }

  value = parseInt(args[1], 10);
  if(isNaN(value)){
    message.channel.send("That is not a valid argument!");
    return;
  }
  if(!message.mentions.members.first()){
    message.channel.send("You must @ a user to target them!");
    return;
  }

  var targUserid = message.guild.id.concat(message.mentions.members.first().id);
  var targCharid = client.userMap.get(targUserid,"possess");
 if (client.charcall.allData(client,userid,charid,"grist")=="NONE"){
   message.channel.send("This character can't carry grist!");
   return;
 }
 if (client.charcall.allData(client,targUserid,targCharid,"grist")=="NONE"){
   message.channel.send("Target character can't carry grist!");
   return;
 }
 
  let grist = client.charcall.allData(client,userid,charid,"grist");
  let targGrist = client.charcall.allData(client,targUserid,targCharid,"grist");
  
  if (grist[select] - value < 0) {
	message.channel.send("You do not have enough grist to send that amount!");
    return;  
  }

  grist[select]-=value;
  client.charcall.setAnyData(client,userid,charid,grist,"grist");
  targGrist[select]+=value;
  client.charcall.setAnyData(client,userid,targCharid,targGrist,"grist");

  message.channel.send(`Gave player ${value} ${gristTypes[select]} grist!`);
  message.channel.send(`You now have ${grist[select]} ${gristTypes[select]} grist!`);
  client.funcall.chanMsg(client,targCharid,`You received ${value} ${gristTypes[select]} grist from ${client.charcall.allData(client,userid,charid,"name")}!`);
}
