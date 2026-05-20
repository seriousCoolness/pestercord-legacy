exports.type = "character";
exports.desc = "Follow a creature or player.";
exports.use = `">follow" without any arguments acts identically to ">list". Also clears your following status.
">follow [list slot]" will allow you to begin following the specified creature.`;
exports.run = (client,message,args) =>{
	var userid = message.guild.id.concat(message.author.id);
    var charid = client.userMap.get(userid,"possess");

    let local = client.charcall.charData(client,charid,"local");

    let inStrife = client.charcall.charData(client,charid,"strife");
	
	if(inStrife==true) {
		message.channel.send("You can't follow characters during strife!");
		return;
	}
	
	if(!args[0]) {
		message.channel.send("Please specify a creature to follow!");
		
		const cmd = client.commands.get("list");
		cmd.run(client,message,args);
		
		//if following someone, cease.
		if(client.charcall.charData(client,charid,"following")!="NONE") {
			client.charcall.ceaseFollow(client,userid,charid,client.charcall.charData(client,charid,"following"));
		}
		
		return;
	}
	
	//If you have specified a target, check if the creature is YOU.
	let sec = client.landMap.get(local[4],local[0]);
    let occList = sec[local[1]][local[2]][2][local[3]][4];
	//console.log(occList);
	let targid = occList[args[0]-1][1];
	
	if(targid==charid) {
		message.channel.send("You can't follow yourself, numbnuts!");
		return;
	}
	
	console.log(client.charcall.charData(client,targid,"name"));
	client.charcall.beginFollow(client,userid,charid,targid);
	return;
}