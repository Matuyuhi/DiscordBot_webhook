// SlashCommandBuilder という部品を discord.js からインポートしています。
// これにより、スラッシュコマンドを簡単に構築できます。
const { SlashCommandBuilder } = require('discord.js')
const opt = require('../opt/options')

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
                .setName('list')
                .setDescription('コマンドのヘルプを表示します'),
            execute: async function (interaction) {
                await interaction.reply(opt.help())
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
