exports.type = "sburb";
exports.desc = "Speak to others in your location";
exports.use = `">say [message]" will send any other characters in the same room as you your message.`;
exports.run = async function(client, message, args){

  var userid = message.guild.id.concat(message.author.id);
  var charid = client.userMap.get(userid,"possess");
  let name = client.charcall.charData(client,charid,"name");
  let img = client.charcall.charData(client,charid,"img");
  let local = client.charcall.charData(client,charid,"local");

  let sec = client.landMap.get(local[4],local[0]);
  let occList = sec[local[1]][local[2]][2][local[3]][4];
  let channelCheck = [];

  if(!args[0]){
    message.channel.send("Type a message to send to everyone in the room with you!");
    return;
  }

  let msg=`**${name}**: `;

  let i;

  for(i=0;i<args.length;i++){
    msg+=`${args[i]} `;
  }
 let count = 0;

  client.funcall.roomMsg(client,message,msg);
  console.log(`${name}: ${msg}`);
  message.channel.send(`Sent message to ${count} channel(s)!`);

}
