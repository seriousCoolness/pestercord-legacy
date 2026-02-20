exports.type = "sburb";
exports.desc = "Kernelsprite interaction";
exports.use = `">sprite" allows you to perform various interactions with your sprite. Leave it blank to check up on them!
">sprite" will run the ">check" command on your sprite, regardless of location.
">sprite follow" will toggle your sprite between following you between rooms and staying put when you are both in the same room.
">sprite rename [name]" will set your sprite's name to "[name]sprite".
">sprite call" will allow you to summon your sprite as long as they're in the same section as you. Acquiring a Sprite Medallion lifts this range restriction.
">sprite prototype [slot]" will prototype an item from your inventory, as long as you're in the same room.`;
exports.run = (client, message, args) => {
	
	var userid = message.guild.id.concat(message.author.id);
	var spriteID = client.sburbMap.get(userid,"spriteID");
	
	if(spriteID=="") {
		message.channel.send("Your character's spriteID is not set! This is probably because you were created before update 16.");
		return;
	}
		
	
	if(!args[0]) {
		message.channel.send(`">sprite" allows you to perform various interactions with your sprite. Leave it blank to check up on them!
">sprite" will run the ">check" command on your sprite, regardless of location.
">sprite follow" will toggle your sprite between following you between rooms and staying put when you are both in the same room.
">sprite rename [name]" will set your sprite's name to "[name]sprite".
">sprite call" will allow you to summon your sprite as long as they're in the same section as you. Acquiring a Sprite Medallion lifts this range restriction.
">sprite prototype [slot]" will prototype an item from your inventory, as long as you're in the same room.`);

		client.funcall.checkCharacter(client,message,spriteID);
		return;
	}
	
	if(args[0]=="rename") {
		if(!args[1]) {
			message.channel.send(`Please specify a name!`);
			return;
		}
		
		client.charcall.setAnyData(client,userid,spriteID,`${args[1].toUpperCase()}SPRITE`,"name");
		client.funcall.checkCharacter(client,message,spriteID);
		return;
	}
	
	if(args[0]=="call") {
		var charid = client.userMap.get(userid,"possess");
		let playLocal = client.charcall.charData(client,charid,"local");
		let spriteLocal = client.charcall.charData(client,spriteID,"local");
		
		let isSameSection = playLocal[0]==spriteLocal[0]&&playLocal[4]==spriteLocal[4];
		
		if(!isSameSection) {
			message.channel.send("You call for your sprite, but nothing happens. They must be too far away to hear.");
			return;
		} else {
			
			//Check whether the player is currently in a fight.
			if(client.charcall.charData(client,charid,"strife")==true) {
				//Check whether its the player's turn. If not, cancel.
				if(client.strifecall.turnTest(client,message,playLocal)==false) {
					message.channel.send("You can only do this on your turn!");
					return;
				}
				
				let strifeLocal = `${playLocal[0]}/${playLocal[1]}/${playLocal[2]}/${playLocal[3]}/${playLocal[4]}`;
				let list = client.strifeMap.get(strifeLocal, "list");
				let pos = client.charcall.charData(client,charid,"pos");
				
				//If they don't have enough stamina, also cancel.
				if(list[pos][5]<4) {
					message.channel.send("You don't have enough stamina to do that! Requires at least 4 stm.");
					return;
				} else {
					list[pos][5]-=4;
					client.strifeMap.set(strifeLocal,list,"list");
					
					client.funcall.move(client,message,spriteID,spriteLocal,playLocal,false,"","FLYING TO",false);
					client.strifecall.enterStrife(client,message,spriteID);
					message.channel.send("Your sprite moves to your location, costing you four stamina!");
					return;
				}
			}
			//if not in strife, its free.
			else {
			client.funcall.move(client,message,spriteID,spriteLocal,playLocal,false,"");
			message.channel.send("Your sprite moves to your location!");
			return;
			}
		}
	}
	if(args[0]=="follow") {
		var charid = client.userMap.get(userid,"possess");
		let playLocal = client.charcall.charData(client,charid,"local");
		let spriteLocal = client.charcall.charData(client,spriteID,"local");
		
		let isSameRoom = playLocal[0]==spriteLocal[0]&&playLocal[1]==spriteLocal[1]&&playLocal[2]==spriteLocal[2]&&playLocal[3]==spriteLocal[3]&&playLocal[4]==spriteLocal[4];
		if(!isSameRoom) {
			message.channel.send("Sprite must be in the same room as you to toggle following!");
			return;
		}
		
		if(client.charcall.checkFollow(client,spriteID,charid)) {
			client.charcall.ceaseFollow(client,userid,spriteID,charid);
			message.channel.send(`**${client.charcall.charData(client,spriteID,"name")}** stopped following you.`);
			return;
		} else {
			client.charcall.beginFollow(client,userid,spriteID,charid);
			//message.channel.send("Your sprite began following you.");
			return;
		}
	}
	
	if(args[0]) {
		message.channel.send(`Not implemented yet!`);
		return;
	}
}