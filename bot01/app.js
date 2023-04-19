// discord.js モジュールのインポート
const { Client, Events, GatewayIntentBits } = require('discord.js')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const { init } = require('./init')

// Discord Clientのインスタンス作成
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ],
})
//commands
const { commands } = require('./commands/hey')
const options = require('./opt/options')

// トークンの用意
const { token } = require('./.env.json')

// 起動するとconsoleにready...と表示される
client.once(Events.ClientReady, (c) => {
    console.log('discord.js version: ' + require('discord.js').version)
    console.log(`${c.user.tag}ready...`)
})

function send(opt) {
    client.channels.cache.get('1097865962025402399').send(opt)
}

//スラッシュコマンドに応答するには、interactionCreateのイベントリスナーを使う必要があります
client.on(Events.InteractionCreate, async (interaction) => {
    // スラッシュ以外のコマンドの場合は対象外なので早期リターンさせて終了します
    // コマンドにスラッシュが使われているかどうかはisChatInputCommand()で判断しています
    if (!interaction.isChatInputCommand()) return

    // heyコマンドに対する処理
    for (const cmd of commands) {
        if (interaction.commandName === cmd.data.name) {
            try {
                console.log(interaction.options)
                await cmd.execute(interaction)
            } catch (error) {
                console.error(error)
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({
                        content: 'コマンド実行時にエラーになりました。',
                        ephemeral: true,
                    })
                } else {
                    await interaction.reply({
                        content: 'コマンド実行時にエラーになりました。',
                        ephemeral: true,
                    })
                }
            }

            break
        }
    }
})

//返答
client.on(Events.MessageCreate, async function (message) {
    if (message.author.bot) {
        return
    }
    if (!message.content) {
        return
    }
    switch (message.content) {
        case 'template':
            send(options.template())
            break
        case 'Bot setup init':
            if (message.guildId) {
                try {
                    await init(message.guildId)
                } catch {
                    console.log('error')
                }
            }
            break
        default:
            send(options.ping())
            break
    }
    console.log(message)

    message.channel.send('hi!')
})

app.use(bodyParser.json())

app.post('/github-webhook', async (req, res) => {
    const payload = req.body
    console.log('post request')
    console.log(payload)
    try {
        await client.channels.cache
            .get('1097865962025402399')
            .send(options.ping())
    } catch {
        console.log('error')
    }
    return res.json({
        action: payload.action,
        issue: payload.issue,
    })
})

app.get('/github-webhook', (req, res) => {
    return res.json({
        info: 'gitから受信するAPIです',
    })
})

app.listen(port, () => {
    console.log(`Webhook receiver app listening at http://localhost:${port}`)
})

// Discordへの接続
client.login(token)
