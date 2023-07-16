const Discord = require('discord.js');
const Tesseract = require("tesseract.js")
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.Guilds,
    ]
});
const config = require("./config")
  client.on('messageCreate', async (message) => {
    if(message.channel.id != config.kanal) return
    let a = "```"
    if(message.member.permissions.has(Discord.PermissionsBitField.Flags.ManageGuild)) return
    if(message.author.id == client.user.id) return
    if (message.member.roles.cache.some((rol) => rol.id === config.rol)) {
        return message.delete()
      }
    if (message.attachments.size > 0) {
      const attachment = message.attachments.first();
        const embed = new Discord.EmbedBuilder()
        .setAuthor({name:message.author.username, iconURL: message.author.avatarURL() || client.user.avatarURL()})
        .setFooter({text: message.guild.name, iconURL: message.guild.iconURL()})
        .setTitle("Ekran Görüntüsü okunuyor")
        .setColor("#2B2D31")
        .setDescription("⚡ **|** Ekran görüntüsü okunuyor bu işlem 1 dakika sürebilir.")
        .setTimestamp()
        const log = new Discord.EmbedBuilder()
        .setColor("#2B2D31")
        .setTimestamp()
        .setAuthor({name:message.author.username, iconURL: message.author.avatarURL() || client.user.avatarURL()})
      const response = await message.reply({embeds:[embed], allowedMentions: {repliedUser:false}})
      Tesseract.recognize(attachment.url, 'tur').then(({ data: { text } }) => { //<--
        if (text.includes(config.kanalad) && text.includes("Abone olundu") || text.includes("Aboneolundu")) {
            embed.setTitle("Okuma işlemi sonlandırıldı.")
            embed.setDescription("✅ **|** İşlem başarılı geçti, abone rolü verildi.")
            message.member.roles.add(config.rol)
            response.edit({embeds:[embed]}).then(msg=>setTimeout(() => {message.delete(); msg.delete();}, 10000))
            if(config.log) {
                log.addFields(
                    {name: "Kullanıcı", value: a+String(message.author.tag)+a},
                    {name: "Durum", value: a+"Başarılı"+a}
                ) 
                 client.channels.cache.get(config.log).send({embeds:[log]})
            }
        } else {
            embed.setTitle("Okuma işlemi sonlandırıldı.")
            embed.setDescription("❎ **|** İşlem başarısız geçti, abone rolü verilmedi.")
            response.edit({embeds:[embed]}).then(msg=>setTimeout(() => {message.delete(); msg.delete();}, 10000))
            if(config.log) {
                log.addFields(
                    {name: "Kullanıcı", value: a+String(message.author.tag)+a},
                    {name: "Durum", value: a+"Başarısız"+a}
                ) 
                 client.channels.cache.get(config.log).send({embeds:[log]})
            }

          }
          })      
    } else {
        message.delete()
    }
    });
  
  

client.login(config.token);

