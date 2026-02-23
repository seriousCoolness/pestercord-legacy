exports.run = (client, message, args) => {
const cmd = client.commands.get("say");
cmd.run(client,message,args);
}