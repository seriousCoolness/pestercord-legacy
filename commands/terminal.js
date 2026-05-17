exports.type = "author";
exports.desc = "Set a player's terminal.";
exports.use = `">terminal [player ping] will set a player's terminal to the current channel.`;
exports.run = (client, message, args) => {
	var userid = message.guild.id.concat(message.author.id);
    var charid = client.userMap.get(userid,"possess");
	
	if(!client.funcall.dmcheck(client,message)) {
		message.channel.send("You need to be a DM in order to use this command!");
		return;
	}
	
	if(!message.mentions.members.first()){
		message.channel.send("You must @ a player to teleport to them!");
		return;
    }
	
	let targUserId = message.guild.id.concat(message.mentions.members.first().id);
	let targCharId = client.userMap.get(targUserId,"possess");
	if(targCharId == "NONE") {
		message.channel.send("That user isn't possessing anyone!");
		return;
	}
	client.userMap.set(targUserId,message.channelId,"channel");
	client.userMap.set(targUserId,message.channelId,"pesterchannel");
	
	let targSburbId = client.charcall.sburbGet(client,targCharId);
	
	client.sburbMap.set(targSburbId,message.channelId,"channel");
	client.sburbMap.set(targSburbId,message.channelId,"pesterchannel");
	
	message.channel.send("Channel set as player's terminal!");
}