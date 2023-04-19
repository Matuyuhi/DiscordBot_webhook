// discord.js v14では、下記のようにRESTとRoutesはdiscord.jsパッケージから直接インポートできます
const { REST, Routes } = require('discord.js')

// hey.jsのmodule.exportsを呼び出します。
const { commands } = require('./commands/hey')

// 環境変数としてapplicationId, guildId, tokenの3つが必要です
const { applicationId, token } = require('./.env.json')

// 登録コマンドを呼び出してリスト形式で登録
// const commands = [heyFile.data.toJSON()]

// DiscordのAPIには現在最新のversion10を指定
const rest = new REST({ version: '10' }).setToken(token)

// Discordサーバーにコマンドを登録
exports.init = async function (guildId) {
    try {
        let cmds = []
        for (const cmd of commands) {
            cmds.push(cmd.data.toJSON())
        }
        await rest.put(
            Routes.applicationGuildCommands(applicationId, guildId),
            { body: cmds }
        )
        console.log('サーバー固有のコマンドが登録されました！')
    } catch (error) {
        console.error('コマンドの登録中にエラーが発生しました:', error)
    }
}
