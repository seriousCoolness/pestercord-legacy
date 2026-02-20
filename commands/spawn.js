exports.type = "author";
exports.desc = "Spawn underlings or NPCS";
exports.use = `">spawn [underling type]" spawns an underling in your current location of the specified type (imp,ogre,basilisk etc).
">spawn [underling type] [grist type]" changes the grist type from random to the specified type.`;
exports.run = function(client,message,args){

if(!client.funcall.dmcheck(client,message)){
message.channel.send("You must be a DM or Author to use this command!");
return;
}

if(!args[0]){
message.channel.send(`Please select what you want to spawn, such as \"${client.auth.prefix}spawn imp\".\nOptionally, you can specify the grist type with another argument, like \"${client.auth.prefix}spawn imp shale\".`);
return;
}

let spawnList = ["imp","ogre","basilisk","lich","giclopse","titachnid","hecatoncheires","denizen","archagent","shopkeep"];
if(!spawnList.includes(args[0].toLowerCase())){
let msg = `Sorry, your choice isn't recognized. The current spawns supported are:`;
for(let i=0;i<spawnList.length;i++){
  msg+=`\n${spawnList[i]}`;
}
message.channel.send(msg);
return;
}

if(spawnList.indexOf(args[0].toLowerCase())<8)
{
  let gristList = ["uranium","amethyst","garnet","iron","marble","chalk","shale","cobalt","ruby","caulk","tar","amber"];
  if(args[1]&&!gristList.includes(args[1].toLowerCase())){
    let msg = `Sorry, that's not a valid grist type. The availible grist types are:\n`;
    for (let i=0;i<gristList.length;i++){
      msg+=`${gristList[i]}, `;
    }
    message.channel.send(msg);
    return;
  }
  let undername;
  if(!args[1]){
    undername = client.strifecall.spawn(client,message,args[0].toLowerCase())
  } else {
    undername = client.strifecall.spawn(client,message,args[0].toLowerCase(),args[1].toLowerCase());
  }
  message.channel.send(`Spawned ${undername} in current room!`);
}
if(spawnList.indexOf(args[0].toLowerCase())==8) {
	
  let sessionid = message.guild.id;
  let charid = client.userMap.get(message.guild.id.concat(message.author.id),"possess");
  let sburbid = client.charcall.charData(client,charid,"owner");
  let npcCount = client.landMap.get(sessionid+"medium","npcCount");
  let local = client.charcall.charData(client,charid,"local");
  let sec = client.landMap.get(local[4],local[0]);
  let occ = [];
  
  let npcSet = {
    name: `Jack Noir`,
    control:[],
    type: "archagent",
    faction: "underling",
    vit:client.underlings["archagent"].vit,
    gel:client.underlings["archagent"].vit,
    gristtype: "diamond",
    strife:false,
    pos:0,
    alive:true,
    local:local,
    sdex:[],
    equip:0,
    trinket:[],
    armor:[],
    spec:[],
    equip:0,
    scards:1,
    kinds:[],
    port:1,
    modus:"STACK",
    cards:4,
    prototype:[],
    prospitRep:-99999999,
    derseRep:1,
    underlingRep:1,
    playerRep:-999,
    consortRep:-100,
    prefTarg:[],
    xp:0,
    rung:0,
    b:0,
    bio:`Archagent everlasting.`,
    img:"https://file.garden/Z_W1uUldwUL6rf2p/jack_noir.png",
    questData:[]
  }
  
  let id = `n${sessionid}/${npcCount}`;
  client.npcMap.set(id,npcSet);
  let occSet = [false,id];
  occ.push(occSet);
  sec[local[1]][local[2]][2][local[3]][4].push(occSet);
  client.landMap.set(sessionid+"medium",npcCount+1,"npcCount");
  client.landMap.set(local[4],sec,local[0]);
  
  
  
  message.channel.send(`Spawned Archagent in current room!`);
}
if(spawnList.indexOf(args[0].toLowerCase())==9) {
  let sessionid = message.guild.id;
  let charid = client.userMap.get(message.guild.id.concat(message.author.id),"possess");
  let sburbid = client.charcall.charData(client,charid,"owner");
  let npcCount = client.landMap.get(sessionid+"medium","npcCount");
  let local = client.charcall.charData(client,charid,"local");
  let sec = client.landMap.get(local[4],local[0]);
  
  message.channel.send(`Spawned shopkeep in current room!`);
}
}
