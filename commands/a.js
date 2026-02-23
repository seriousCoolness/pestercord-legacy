exports.run = (client, message, args) => {
const cmd = client.commands.get("act");
cmd.run(client,message,args);
}