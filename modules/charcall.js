//finds data anywhere, defaulting to userdata
exports.allData = function(client,userid,charid,datatype){
  if(client.playerMap.has(charid)){
    let sburbid = client.playerMap.get(charid,"owner");
    if(client.playerMap.get(charid).hasOwnProperty(datatype)){
      return client.playerMap.get(charid,datatype);
    } else if(client.sburbMap.get(sburbid).hasOwnProperty(datatype)){
      return client.sburbMap.get(sburbid,datatype);
    } else if(client.userMap.get(userid).hasOwnProperty(datatype)){
      return client.userMap.get(userid,datatype);
    } else{
      return "NONE";
    }
  } else if(client.npcMap.has(charid)){
    if(client.npcMap.get(charid).hasOwnProperty(datatype)){
      return client.npcMap.get(charid,datatype);
    } else if(client.userMap.get(userid).hasOwnProperty(datatype)){
    return client.userMap.get(userid,datatype);
    } else {
    return "NONE";
    }
  } else {
    return "NONE";
  }
}
//sets data in an already existing location
exports.setAnyData = function(client,userid,charid,data,key){
  if(client.playerMap.has(charid)){
    let sburbid = client.playerMap.get(charid,"owner");
    if(client.playerMap.get(charid).hasOwnProperty(key)){
      client.playerMap.set(charid,data,key);
    }else if(client.sburbMap.get(sburbid).hasOwnProperty(key)){
      client.sburbMap.set(sburbid,data,key);
    }else if(client.userMap.get(userid).hasOwnProperty(key)){
      client.userMap.set(userid,data,key);
    }else{
      console.log(`Couldn't assign data ${data} to key ${key} for ${charid}.`);
      return;
    }
  }else{
    if(client.npcMap.get(charid).hasOwnProperty(key)){
      client.npcMap.set(charid,data,key);
    } else if(client.userMap.get(userid).hasOwnProperty(key)){
      client.userMap.set(userid,data,key);
    } else {
    console.log(`Couldn't assign data ${data} to key ${key} for ${charid}.`);
    return;
    }
  }
}
//finds data only related to the charid.
exports.charData = function(client,charid,datatype){
  if(client.playerMap.has(charid)){
    if(client.playerMap.get(charid).hasOwnProperty(datatype)){
    return client.playerMap.get(charid,datatype);
  }else{
    return "NONE";
  }
  } else if(client.npcMap.has(charid)){
    if(client.npcMap.get(charid).hasOwnProperty(datatype)){
    return client.npcMap.get(charid,datatype);
  }else{
    return "NONE";
  }
  } else {
    return "NONE";
  }
}
//changes a sburbid to a charid, or keeps it as a charid for npcs.
exports.charGet = function(client,checkid){
  if(client.sburbMap.has(checkid)){
    if(client.sburbMap.get(checkid,"dreamer")){
      return client.sburbMap.get(checkid,"dreamingID");
    } else{
      return client.sburbMap.get(checkid,"wakingID");
    }
  } else if (client.npcMap.has(checkid)){
    return checkid;
  }
  return "NONE";
}
//changes a charid to a sburbid, or keeps it as a charid for npcs.
exports.sburbGet = function(client,checkid){
 if(client.playerMap.has(checkid)){
   return client.playerMap.get(checkid,"owner");
 } else if(client.npcMap.has(checkid)){
   return checkid;
 }
 return "NONE";
}
//checks if a character has a given datatype
exports.hasData = function(client,charid,datatype){
  if(client.playerMap.has(charid)){
    if(client.playerMap.get(charid).hasOwnProperty(datatype)){
      return true;
    }
  }
  if(client.npcMap.has(charid)){
    if(client.npcMap.get(charid).hasOwnProperty(datatype)){
      return true;
    }
  }
  return false;
}
//returns a bool based on if the charid belongs to an NPC or not.
 exports.npcCheck = function(client,charid){
   if(client.npcMap.has(charid)){
     return true;
   }
     return false;
 }
 //checks if a character is being controlled by a user.
 exports.controlCheck = function(client,charid){
   if(client.charcall.charData(client,charid,"control").length>0){
     return true;
   }
   return false;
 }
 //checks if there is an underling present in a given occList.
 exports.underlingCheck = function(occList,client) {
   check = false;
   if(occList.length>0){
     for(i=0;i<occList.length;i++){
       if(occList[i][0]==false&&client.charcall.charData(client,occList[i][0],"control")=="NONE"){
		   if(client.charcall.charData(client,occList[i][1],"faction") == "underling")
		   {
			 check=true;
			 return check;
		   }
       }
     }
   }
   return check;
 }


exports.displaySylladex = function(client, message, slotChanged=undefined) {
	
  var userid = message.guild.id.concat(message.author.id);
  var charid = client.userMap.get(userid,"possess");

  let dex = client.charcall.charData(client,charid,"sdex");
  let modus = client.charcall.charData(client,charid,"modus");
  let cards = client.charcall.charData(client,charid,"cards");
  let name = client.charcall.charData(client,charid,"name");
  
  console.log(dex.length);
  //Set page to display.
  let page;
  if(slotChanged==undefined)
	  page=Math.floor((dex.length-1)/10);
  else
	  page=Math.floor(slotChanged/10);
  
  console.log(page);
	async function dexCheck(){
		
      const attachment = await client.imgcall.sdexCheck(client,message,page,[],0,dex,cards,"sylladex");
      client.tutorcall.progressCheck(client,message,7,["img",attachment]);
    }

    dexCheck();
    return;
}

exports.checkFollow = function(client,charid,targid) {
	return client.charcall.charData(client,charid,"following")==targid;
}

exports.beginFollow = function(client,userid,charid,targid) {
	
	let charLocal = client.charcall.charData(client,charid,"local");
	let targLocal = client.charcall.charData(client,targid,"local");
	
	//sanity checks
	let following = client.charcall.charData(client,charid,"following");
	if(following==targid) {
		console.log("Already following that character!");
		client.funcall.chanMsg(client,charid,"Already following that character!");
		return;
	} else if(following!="NONE") {
		client.charcall.ceaseFollow(client,userid,charid,targid);
	}

	//can only begin following from the same room.
	let isSameRoom = charLocal[0]==targLocal[0]&&charLocal[1]==targLocal[1]&&charLocal[2]==targLocal[2]&&charLocal[3]==targLocal[3]&&charLocal[4]==targLocal[4]
	if(!isSameRoom) {
		client.funcall.chanMsg(client,charid,"Tried to follow character, but they're not in the same room as you!");
		return;
	}
	
	//add following id
	client.charcall.setAnyData(client,userid,charid,targid,"following");
	
	//add follower to list
	let followers = client.charcall.charData(client,targid,"followers");
	followers.push(charid);
	client.charcall.setAnyData(client,userid,targid,followers,"followers");
	
	client.funcall.chanMsg(client,charid,`Began following **${client.charcall.charData(client,targid,"name")}**!`);
	if(client.charcall.controlCheck(client,targid))
		client.funcall.chanMsg(client,targid,`**${client.charcall.charData(client,charid,"name")}** began following you!`);
	return;
}

exports.ceaseFollow = function(client,userid,charid,targid,msg=undefined) {
	
	//delete following id
	client.charcall.setAnyData(client,userid,charid,"NONE","following");
	
	//delete follower from list
	let followers = client.charcall.charData(client,targid,"followers");
	let newFollowers = followers.filter(id => id != charid);
	client.charcall.setAnyData(client,userid,targid,newFollowers,"followers");
	
	if(msg==undefined)
		client.funcall.chanMsg(client,charid,`Stopped following **${client.charcall.charData(client,targid,"name")}**!`);
	else if(msg=="")
		return;
	else
		client.funcall.chanMsg(client,charid,msg);
	
	return;
}

exports.canFly = function(client,userid,charid) {
	if(client.charcall.allData(client,userid,charid,"godtier")||client.traitcall.traitCheck(client,charid,"ROCKET")[1]||client.traitcall.traitCheck(client,charid,"SPACE")[0]||client.charcall.allData(client,userid,charid,"dreamer")==true)
		return true;
	else
		return false;
}

exports.canTeleport = function(client,userid,charid) {
	if(client.traitcall.traitCheck(client,charid,"SPACE")[1])
		return true;
	else
		return false;
}

exports.checkFollowersCanFollow = function(client,userid,charid,movementMethod="MOVE") {
	let followers = client.charcall.charData(client,charid,"followers");
	
	if(followers.length==0)
		return;
	
	for(let i=0;i<followers.length;i++) {
		let followeruserid = userid;
		if(client.charcall.controlCheck(client,followers[i])) followeruserid=client.charcall.charData(client,followers[i],"control")[0];
		
		if (movementMethod=="FLY"&&(!client.charcall.canFly(client,followeruserid,followers[i])||(!client.traitcall.checkPendant(client,charid)&&client.charcall.charData(client,followers[i],"type")=="sprite"))) {
			client.charcall.ceaseFollow(client,followeruserid,followers[i],charid,`**${client.charcall.charData(client,followers[i],"name")}** stopped following **${client.charcall.charData(client,charid,"name")}** because they can't fly.`);
		}
		if (movementMethod=="TP"&&!client.charcall.canTeleport(client,followeruserid,followers[i])) {
			client.charcall.ceaseFollow(client,followeruserid,followers[i],charid,`**${client.charcall.charData(client,followers[i],"name")}** stopped following **${client.charcall.charData(client,charid,"name")}** because they can't teleport.`);
		}
		if (movementMethod=="GATE"&&(!client.traitcall.checkPendant(client,charid)&&client.charcall.charData(client,followers[i],"type")=="sprite")) {
			client.charcall.ceaseFollow(client,followeruserid,followers[i],charid,`**${client.charcall.charData(client,followers[i],"name")}** stopped following **${client.charcall.charData(client,charid,"name")}** because they don't possess a sprite medallion.`);
		}
	}
}