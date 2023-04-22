// discord.js モジュールのインポート
const { Client, Events, GatewayIntentBits } = require('discord.js')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const { init } = require('./init')

// Discord Clientのインスタンス作成
const client = new Client({
    // serverが受け取る受け取るAPIのタイプを指定
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
    ],
})

//commands
const { commands } = require('./commands/hey')
//メッセージのテンプレートの用意
const options = require('./opt/options')

// トークンの用意
const { token } = require('./.env.json')

// 起動するとconsoleに{Bot Name}ready...と表示される
client.once(Events.ClientReady, (c) => {
    // discord.jsのversionも表示
    console.log('discord.js version: ' + require('discord.js').version)
    console.log(`${c.user.tag}ready...`)
})

function send(opt) {
    client.channels.cache.get('1097865962025402399').send(opt)
}

//スラッシュコマンドに応答するには、interactionCreateのイベントリスナーを使う必要があります
client.on(Events.InteractionCreate, async (interaction) => {
    // スラッシュ以外のコマンドの場合は対象外なので早期リターンさせて終了する
    // コマンドにスラッシュが使われているかどうかはisChatInputCommand()で判断している
    if (!interaction.isChatInputCommand()) return

    // コマンドに対する処理
    // とりあえずforで回して一致するコマンド検索
    for (const cmd of commands) {
        if (interaction.commandName === cmd.data.name) {
            try {
                console.log(interaction.options)
                // 一致するコマンドがあったら実行
                await cmd.execute(interaction)
            } catch (error) {
                // とりあえずエラーだったらメッセージを送る
                console.error(error)
                if (interaction.replied || interaction.deferred) {
                    // 一応送れていれば、そのメッセージに対してエラーを吐く
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

/**
 * 通常のメッセージの反応する
 * 全部処理しようとするのでなるべく簡略化
 */
client.on(Events.MessageCreate, async function (message) {
    // botは
    if (message.author.bot) {
        return
    }
    // 内容がなければ
    if (!message.content) {
        return
    }
    switch (message.content) {
        /**
         * 通信テスト用
         * ping全てに反応するので
         * Client側でBotが閲覧できるチャンネルを制限するべき
         */
        case 'ping':
            send(options.template())
            break
        /**
         * Client ServerにCommand接続
         * これをやらないと
         * Clientからスラッシュコマンドは送れない
         */
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

// vvvv WEB API vvvvvv
app.use(bodyParser.json())

/**
 * TODO:
 * github webhookの連携用
 * (作成中)
 * bodyの内容見てmessage作成する予定
 * v API
 * https://docs.github.com/ja/webhooks-and-events/webhooks/webhook-events-and-payloads#project_column
 */
app.post('/github-webhook', async (req, res) => {
    const payload = req.body
    console.log('post request')
    console.log(payload)
    try {
        await client.channels.cache
            .get('1097865962025402399')
            .send(options.message('', req.body))
    } catch {
        console.log('error')
    }
    return res.json({
        action: payload.action,
        issue: payload.issue,
    })
})

// 確認用
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
