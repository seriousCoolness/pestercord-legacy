exports.run = (client, message, args) => {
const cmd = client.commands.get("move");
cmd.run(client,message,args);
}