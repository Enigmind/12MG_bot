const Discord = require("discord.js");
const Welcome = require("discord-welcome");
const bot_token = require("./auth.json").token;
const client = new Discord.Client();

function processCommand(receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1); // Remove the +
  let splitCommand = fullCommand.split(" "); // Split the message up in to pieces for each space
  let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
  let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

  console.log("Command received: " + primaryCommand);
  console.log("Arguments: " + arguments); // There may not be any arguments

  /** Creates jobs rôles */
  if (primaryCommand == "createjobs") {
    let list_jobs = [
      "Paysan",
      "Alchimiste",
      "Pêcheur",
      "Mineur",
      "Chasseur",
      "Bûcheron",
      "Bricoleur",
      "Bijoutier",
      "Cordonnier",
      "Forgeron",
      "Tailleur",
      "Sculpteur",
      "Façonneur",
      "Façomage",
      "Forgemage",
      "Sculptemage",
      "Costumage",
      "Cordomage",
      "Joaillomage",
    ];
    let color_jobs = [
      "GREEN",
      "GREEN",
      "GREEN",
      "GREEN",
      "GREEN",
      "GREEN",
      "BLUE",
      "YELLOW",
      "YELLOW",
      "YELLOW",
      "YELLOW",
      "YELLOW",
      "YELLOW",
      "PURPLE",
      "PURPLE",
      "PURPLE",
      "PURPLE",
      "PURPLE",
      "PURPLE",
    ];

    console.log("hey")

    for (i=0; i<list_jobs; i++) {
      if (receivedMessage.guild.roles.find(role => role.name === job)) {
        console.log("le rôle existe déjà");
      } else {
        receivedMessage.channel.guild
          .createRole({
            name: job[i],
            color: color_jobs[i]
          })
          .then(role =>
            console.log(
              `Created new role with name ${role.name} and color ${role.color}`
            )
          )
          .catch(console.error);
      }
      count+=1;
    }
  }

  /** Help command */
  if (primaryCommand == "aled") {
    if (arguments.length > 0) {
      receivedMessage.channel.send(
        "TODO -> faire des commandes d'aide personnalisées :thinking:"
      );
    } else {
      const cmd_list = new Discord.RichEmbed()
        //header
        .setColor("#800000")
        .setTitle("Liste des commandes")
        .setThumbnail(
          "https://images.emojiterra.com/google/android-pie/512px/2699.png"
        )

        //content
        .addField("aled", "Commande d'aide", false);
      receivedMessage.channel.send(cmd_list);
    }
  }
}

//when someone slide into the server
Welcome(client, {
  "539794635283890186": {
    privatemsg: "Default message, welcome anyway",
    publicmsg: "Bienvenue sur mon serveur de test :kissing_heart:",
    publicchannel: "589465460680949787"
  },
  "526207992182472704": {
    publicmsg:
      "Bonjour @MEMBER et bienvenue sur le Discord de Douze Mesures de Guerre !!",
    publicchannel: "526808996330602506"
  }
});

// when the bot is connected
client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  // activity types can be : PLAYING, STREAMING, LISTENING, WATCHING
  client.user.setActivity("Pornhub", {
    type: "WATCHING"
  });
  //client.channels.get(`526808996330602506`).send(`oui`)
});

client.on("message", receivedMessage => {
  // Prevent bot from responding to its own messages
  if (receivedMessage.author == client.user) {
    return;
  }

  // Check if the bot's user was tagged in the message
  if (receivedMessage.content.includes(client.user.toString())) {
    receivedMessage.channel.send("Plaît-il ?");
    receivedMessage.channel.send(
      "Je ne réponds qu'aux commandes que je connais. Tape `+aled` si besoin ;)"
    );
  }

  // if the message starts with $, exectute the 'processCommand' function
  if (receivedMessage.content.startsWith("+")) {
    processCommand(receivedMessage);
  }
});

client.login(bot_token);
