// discord.js モジュールのインポート
const {
    Client,
    Events,
    GatewayIntentBits,
    EmbedBuilder,
} = require('discord.js')
const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')
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
//
const { getLink, getChannel } = require('./js/botFunc')

// トークンの用意
const { token } = require('./.env.json')

// 起動するとconsoleに{Bot Name}ready...と表示される
client.once(Events.ClientReady, (c) => {
    // discord.jsのversionも表示
    console.log('discord.js version: ' + require('discord.js').version)
    console.log(`${c.user.tag}ready...`)
})

/**
 * 送信
 * @param {{embed : EmbedBuilder}} opt 送信するOption
 * @param {*} guildId serverId
 */
async function send(opt, guildId) {
    if (!opt || !guildId) return
    try {
        const info = await getChannel(String(guildId))
        if (!info || !info.channelId) return
        client.channels.cache.get(info.channelId).send(opt)
    } catch (err) {
        console.log(err)
    }
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
                // console.log(interaction.options)
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
    try {
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
            case '!ping':
                await send(options.ping())
                break
            /**
             * Client ServerにCommand接続
             * これをやらないと
             * Clientからスラッシュコマンドは送れない
             */
            case '!BotSetupInit':
                if (message.guildId) {
                    try {
                        await init(message.guildId)
                    } catch {
                        console.log('error')
                    }
                }
                break
            default:
                break
        }
    } catch (err) {
        console.log(err)
    }
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
app.post('/github-webhook/:guildId', async (req, res) => {
    const payload = req.body
    console.log('post request')
    const guildId = String(req.params.guildId)
    if (!guildId) {
        return res.json({
            body: 'guildIdがありません!!',
        })
    }
    //console.log(payload)
    //console.log(req.headers)
    try {
        const opt = await convertIssue(payload)
        console.log('send >>>' + opt)
        if (opt) {
            await send({ embeds: [opt] }, guildId)
            // client.channels.cache
            //     .get('1097865962025402399')
            //     .send({ embeds: [opt] })
        }
    } catch (err) {
        console.log(err)
    }

    return res.json({
        action: payload.action,
        // issue: payload.issue,
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

/**
 * User: {login: String, avatar_url: String, html_url: String}
 * @param {{
 * action:String,
 * issue: {html_url: String,},
 * sender: User,
 * comment: {user: User, body: String}?
 * }} _data
 * @returns EmbedBuilder
 */
async function convertIssue(_data) {
    if (!_data.action || !_data.issue || !_data.issue.user) return
    const issue = _data.issue
    const action = _data.action
    const repository = _data.repository

    const editor = convertUser(_data.sender)
    const htmlUrl = issue.html_url
    const title =
        '[' +
        String(repository.full_name) +
        ']#' +
        String(issue.number) +
        ':  ' +
        String(issue.title)
    const org = convertUser(_data.organization)

    let actionName
    switch (action) {
        case 'opened':
            actionName = '__issueが作成されました !__\n'
            break
        case 'created':
            actionName = '__issueにコメントが追加されました__\n'
            break
        case 'assigned':
            actionName = '__Assignが変更されました__\n'
            break
        case 'labeled':
            actionName = '__Labelが変更されました__\n'
            break
        default:
            actionName = '__不明なactionでした__\n'
            break
    }

    let description =
        //issue説明欄
        (issue.body ? issue.body + '\n' : '') +
        //commentの数
        '__comments : ' +
        issue.comments +
        '__\n' +
        // status
        actionName

    const links = await getLink()
    description = description.replaceUsersLink(links)

    const embed = new EmbedBuilder()
    embed.setAuthor({
        name: editor.login,
        url: editor.url,
        iconURL: editor.avatar,
    })
    embed.setTitle(title)
    embed.setURL(htmlUrl)
    embed.setDescription(description)

    if (_data.comment) {
        const comment = String(_data.comment.body).replaceUsersLink(links)
        const user = convertUser(comment.user)
        const title = String(
            '**@' + user.login + "'s New Comment**\n"
        ).replaceUsersLink(links)
        embed.addFields({
            name: '',
            value: title + comment,
        })
    }

    const assignes = convertAssignes(issue.assignees)
    if (assignes) {
        embed.addFields({
            name: 'Assignes',
            value: assignes.replaceUsersLink(links),
            inline: true,
        })
    }

    const labels = convertLabels(issue.labels)
    if (labels) {
        embed.addFields({
            name: 'Labels',
            value: labels,
            inline: true,
        })
    }

    embed.setFooter({
        text: org.login,
        iconURL: org.avater,
    })
    embed.setTimestamp(moment(issue.updated_at))
    return embed
}

/**
 * @param {{login: String, avatar_url: String, html_url: String}} _data UserObject
 * @returns {login: String, avater: String, url: String}
 */
function convertUser(_data) {
    return {
        login: String(_data.login),
        avatar: String(_data.avatar_url),
        url: String(_data.html_url),
        md: function () {
            return ' [' + this.login + '](' + this.url + ') '
        },
    }
}

/**
 * Userのlogin(名前)を取り出して文字列に
 * @param {[{login: String}]} _data
 * @returns String
 */
function convertAssignes(_data) {
    let namesText = ''
    for (const as of _data) {
        namesText += String(as.login ? '' + as.login + '.  ' : '')
    }
    return namesText
}

/**
 * nameだけ取り出して文字列に結合
 * @param {[{name: String}]} _labels
 * @returns String
 */
function convertLabels(_labels) {
    let namesText = ''
    for (const label of _labels) {
        namesText += String(label.name ? label.name + '.  ' : '')
    }
    return namesText
}

/**
 * Githubのユーザー名をdiscordのメンションに置き換える
 * @param {[{name: String, id: String, gitname: String}]} replaces
 * @returns String
 */
String.prototype.replaceUsersLink = function (replaces) {
    let out = this
    for (const data of replaces) {
        const base = String(data.gitname)
        const place = '<!@' + String(data.id) + '>'
        if (out.match(base)) {
            out = out.replace(new RegExp(base, 'g'), place)
        }
    }
    return out
}
