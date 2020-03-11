// Import constructors, configuration and login the client
const { Client, RichEmbed, Emoji, MessageReaction } = require("discord.js");
const CONFIG = require("./config");
const Welcome = require("discord-welcome");

const client = new Client({ disableEveryone: true });
if (CONFIG.botToken === "")
  throw new Error(
    "The 'botToken' property is not set in the config.js file. Please do this!"
  );

client.login(CONFIG.botToken);

// If there isn't a reaction for every role, alert the user
if (CONFIG.roles.length !== CONFIG.reactions.length)
  throw "Roles list and reactions list are not the same length! Please double check this in the config.js file";

// Function to generate the role messages, based on your settings
function generateMessages() {
  return CONFIG.roles.map((r, e) => {
    return {
      role: r,
      message: `React below to get the **"${r}"** role!`, //DONT CHANGE THIS,
      emoji: CONFIG.reactions[e]
    };
  });
}

// Function to generate the embed fields, based on your settings and if you set "const embed = true;"
function generateEmbedFields() {
  return CONFIG.roles.map((r, e) => {
    return {
      emoji: CONFIG.reactions[e],
      role: r
    };
  });
}

function processCommand(message) {
  let fullCommand = message.content.substr(1); // Remove the +
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
      "Joaillomage"
    ];
    let color_jobs = [
      "GREEN",
      "GREEN",
      "GREEN",
      "GREEN",
      "GREEN",
      "GREEN",
      "WHITE",
      "BLUE",
      "BLUE",
      "BLUE",
      "BLUE",
      "BLUE",
      "BLUE",
      "PURPLE",
      "PURPLE",
      "PURPLE",
      "PURPLE",
      "PURPLE",
      "PURPLE"
    ];

    for (i = 0; i < list_jobs.length; i++) {
      if (
        message.guild.roles.find(role => role.name === list_jobs[i])
      ) {
        console.log("le rôle existe déjà");
      } else {
        message.channel.guild
          .createRole({
            name: list_jobs[i],
            color: color_jobs[i]
          })
          .then(role =>
            console.log(
              `Created new role with name ${role.name} and color ${role.color}`
            )
          )
          .catch(console.error);
      }
    }
    message.channel.send("Les rôles ont été créés !");
  }

  /** Help command */
  if (primaryCommand == "aled") {
    if (arguments.length > 0) {
      message.channel.send(
        "TODO -> faire des commandes d'aide personnalisées :thinking:"
      );
    } else {
      const cmd_list = new RichEmbed()
        //header
        .setColor("#800000")
        .setTitle("Liste des commandes")
        .setThumbnail(
          "https://images.emojiterra.com/google/android-pie/512px/2699.png"
        )

        //content
        .addField("aled", "Commande d'aide", false);
      message.channel.send(cmd_list);
    }
  }

  if (primaryCommand == "createrolesmessage"){
    author = message.author.id
    id = CONFIG.yourID
    messagecontent = message.content.toLowerCase()
    setup = CONFIG.setupCMD
    if (author !== id || messagecontent !== setup){
      return;
    }
      
    if (CONFIG.deleteSetupCMD) {
      const missing = message.channel
        .permissionsFor(message.guild.me)
        .missing("MANAGE_MESSAGES");
      // Here we check if the bot can actually delete messages in the channel the command is being ran in
      if (missing.includes("MANAGE_MESSAGES"))
        throw new Error(
          "I need permission to delete your command message! Please assign the 'Manage Messages' permission to me in this channel!"
        );
      message.delete().catch(O_o => {});
    }
  
    const missing = message.channel
      .permissionsFor(message.guild.me)
      .missing("MANAGE_MESSAGES");
    // Here we check if the bot can actually add recations in the channel the command is being ran in
    if (missing.includes("ADD_REACTIONS"))
      throw new Error(
        "I need permission to add reactions to these messages! Please assign the 'Add Reactions' permission to me in this channel!"
      );
  
    if (!CONFIG.embed) {
      if (!CONFIG.initialMessage || CONFIG.initialMessage === "")
        throw "The 'initialMessage' property is not set in the config.js file. Please do this!";
  
      message.channel.send(CONFIG.initialMessage);
  
      const messages = generateMessages();
      for (const { role, message: msg, emoji } of messages) {
        if (!message.guild.roles.find(r => r.name === role))
          throw `The role '${role}' does not exist!`;
  
        message.channel
          .send(msg)
          .then(async m => {
            const customCheck = message.guild.emojis.find(e => e.name === emoji);
            if (!customCheck) await m.react(emoji);
            else await m.react(customCheck.id);
          })
          .catch(console.error);
      }
    } else {
      if (!CONFIG.embedMessage || CONFIG.embedMessage === "")
        throw "The 'embedMessage' property is not set in the config.js file. Please do this!";
      if (!CONFIG.embedFooter || CONFIG.embedMessage === "")
        throw "The 'embedFooter' property is not set in the config.js file. Please do this!";
  
      const roleEmbed = new RichEmbed()
        .setDescription(CONFIG.embedMessage)
        .setFooter(CONFIG.embedFooter);
  
      if (CONFIG.embedColor) roleEmbed.setColor(CONFIG.embedColor);
  
      if (CONFIG.embedThumbnail && CONFIG.embedThumbnailLink !== "")
        roleEmbed.setThumbnail(CONFIG.embedThumbnailLink);
      else if (CONFIG.embedThumbnail && message.guild.icon)
        roleEmbed.setThumbnail(message.guild.iconURL);
  
      const fields = generateEmbedFields();
      if (fields.length > 25)
        throw "That maximum roles that can be set for an embed is 25!";
  
      for (const { emoji, role } of fields) {
        if (!message.guild.roles.find(r => r.name === role))
          throw `The role '${role}' does not exist!`;
  
        const customEmote = client.emojis.find(e => e.name === emoji);
  
        if (!customEmote) roleEmbed.addField(emoji, role, true);
        else roleEmbed.addField(customEmote, role, true);
      }
  
      message.channel.send(roleEmbed).then(async m => {
        for (const r of CONFIG.reactions) {
          const emoji = r;
          const customCheck = client.emojis.find(e => e.name === emoji);
  
          if (!customCheck) await m.react(emoji);
          else await m.react(customCheck.id);
        }
      });
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
      "Bonjour @MEMBER et bienvenue sur le Discord de Douze Mesures de Guerre !! contacte un admin afin qu'il t'attribue tes droits.",
    publicchannel: "518810571785764864"
  }
});

// Client events to let you know if the bot is online and to handle any Discord.js errors
client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  // activity types can be : PLAYING, STREAMING, LISTENING, WATCHING
  client.user.setActivity("Pornhub", {
    type: "WATCHING"
  });
  //client.channels.get(`526808996330602506`).send(`oui`)
});
client.on("error", console.error);

// Handles the creation of the role reactions. Will either send the role messages separately or in an embed
client.on("message", message => {
  // Make sure bots can't run this command
  if (message.author.bot) return;

  // Make sure the command can only be ran in a server
  if (!message.guild) return;

  // if the message starts with $, exectute the 'processCommand' function
  if (message.content.startsWith("+")) {
    processCommand(message);
  }

  // We don't want the bot to do anything further if it can't send messages in the channel
  if (
    message.guild &&
    !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")
  )
    return;
});

// This makes the events used a bit more readable
const events = {
  MESSAGE_REACTION_ADD: "messageReactionAdd",
  MESSAGE_REACTION_REMOVE: "messageReactionRemove"
};

// This event handles adding/removing users from the role(s) they chose based on message reactions
client.on("raw", async event => {
  if (!events.hasOwnProperty(event.t)) return;

  const { d: data } = event;
  const user = client.users.get(data.user_id);
  const channel = client.channels.get(data.channel_id);

  const message = await channel.fetchMessage(data.message_id);
  const member = message.guild.members.get(user.id);

  const emojiKey = data.emoji.id
    ? `${data.emoji.name}:${data.emoji.id}`
    : data.emoji.name;
  let reaction = message.reactions.get(emojiKey);

  if (!reaction) {
    // Create an object that can be passed through the event like normal
    const emoji = new Emoji(client.guilds.get(data.guild_id), data.emoji);
    reaction = new MessageReaction(
      message,
      emoji,
      1,
      data.user_id === client.user.id
    );
  }

  let embedFooterText;
  if (message.embeds[0]) embedFooterText = message.embeds[0].footer.text;

  if (
    message.author.id === client.user.id &&
    (message.content !== CONFIG.initialMessage ||
      (message.embeds[0] && embedFooterText !== CONFIG.embedFooter))
  ) {
    if (!CONFIG.embed && message.embeds.length < 1) {
      const re = `\\*\\*"(.+)?(?="\\*\\*)`;
      const role = message.content.match(re)[1];

      if (member.id !== client.user.id) {
        const guildRole = message.guild.roles.find(r => r.name === role);
        if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
        else if (event.t === "MESSAGE_REACTION_REMOVE")
          member.removeRole(guildRole.id);
      }
    } else if (CONFIG.embed && message.embeds.length >= 1) {
      const fields = message.embeds[0].fields;

      for (const { name, value } of fields) {
        if (member.id !== client.user.id) {
          const guildRole = message.guild.roles.find(r => r.name === value);
          if (
            name === reaction.emoji.name ||
            name === reaction.emoji.toString()
          ) {
            if (event.t === "MESSAGE_REACTION_ADD")
              member.addRole(guildRole.id);
            else if (event.t === "MESSAGE_REACTION_REMOVE")
              member.removeRole(guildRole.id);
          }
        }
      }
    }
  }
});

process.on("unhandledRejection", err => {
  const msg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Unhandled Rejection", msg);
});
