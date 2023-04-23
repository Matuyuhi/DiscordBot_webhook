// SlashCommandBuilder という部品を discord.js からインポートしています。
// これにより、スラッシュコマンドを簡単に構築できます。
const { SlashCommandBuilder } = require('discord.js')
const opt = require('../opt/options')
const { setLink, setChannel } = require('../js/botFunc')

// 以下の形式にすることで、他のファイルでインポートして使用できるようになります。
module.exports = {
    commands: [
        {
            data: new SlashCommandBuilder()
                .setName('hey')
                .setDescription('あいさつに反応してbotが返事します'),
            execute: async function (interaction) {
                await interaction.reply(opt.template())
            },
        },
        {
            data: new SlashCommandBuilder()
                .setName('help')
                .setDescription('コマンドのヘルプを表示します')
                .addStringOption((option) =>
                    option
                        .setName('language')
                        .setDescription('言語を指定します。')
                        .setRequired(false) //trueで必須、falseで任意
                        .addChoices(
                            { name: 'Japanese', value: 'ja' },
                            { name: 'English', value: 'en' }
                        )
                )
                .addStringOption((option) =>
                    option
                        .setName('sub')
                        .setDescription('sub command')
                        .setRequired(false)
                ),
            execute: async function (interaction) {
                const sub = await interaction.options.getString('sub')
                await interaction.reply(opt.help(sub))
            },
        },
        {
            data: new SlashCommandBuilder()
                .setName('link')
                .setDescription(
                    'githubのユーザー名をdiscordのuserとlinkさせます'
                )
                .addStringOption((option) =>
                    option
                        .setName('gitname')
                        .setDescription('gitの名前')
                        .setRequired(true)
                )
                .addUserOption((option) =>
                    option
                        .setName('user')
                        .setDescription('discordのユーザー')
                        .setRequired(true)
                ),
            execute: async function (interaction) {
                const gitname = await interaction.options.getString('gitname')
                const user = await interaction.options.getUser('user')
                if (await setLink(gitname, user)) {
                    await interaction.reply('OK')
                } else {
                    await interaction.reply('error')
                }
            },
        },
        {
            data: new SlashCommandBuilder()
                .setName('setserver')
                .setDescription(
                    'githubのユーザー名をdiscordのuserとlinkさせます'
                )
                .addStringOption((option) =>
                    option
                        .setName('channelid')
                        .setDescription('投稿するチャンネル')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('giturl')
                        .setDescription('GithubのURL')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('name')
                        .setDescription('Teamの名前')
                        .setRequired(true)
                ),
            execute: async function (interaction) {
                const guildId = await interaction.guildId
                const channelId = await interaction.options.getString(
                    'channelid'
                )
                const html_url = await interaction.options.getString('giturl')
                const name = await interaction.options.getString('name')
                if (await setChannel(guildId, channelId, html_url, name)) {
                    await interaction.reply('OK')
                } else {
                    await interaction.reply('error')
                }
                console.log(guildId)
                console.log(channelId)
                console.log(html_url)
                console.log(name)
            },
        },
    ],
}

// module.exportsの補足
// キー・バリューの連想配列のような形で構成されています。
//
// module.exports = {
//    キー: バリュー,
//    キー: バリュー,
// };
//
