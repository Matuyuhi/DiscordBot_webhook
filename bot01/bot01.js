
// discord.js モジュールのインポート
const { Client, Events, GatewayIntentBits } = require('discord.js')

// Discord Clientのインスタンス作成
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

//commands
const hey = require('./commands/hey')

// トークンの用意
const { token } = require("./.env.json")
// 起動するとconsoleにready...と表示される
client.once(Events.ClientReady, c => {
    console.log(`${c.user.tag}ready...`)
})

//スラッシュコマンドに応答するには、interactionCreateのイベントリスナーを使う必要があります
client.on(Events.InteractionCreate, async interaction => {

    // スラッシュ以外のコマンドの場合は対象外なので早期リターンさせて終了します
    // コマンドにスラッシュが使われているかどうかはisChatInputCommand()で判断しています
    if (!interaction.isChatInputCommand()) return

    // heyコマンドに対する処理
    if (interaction.commandName === hey.data.name) {
        try {
            await hey.execute(interaction)
        } catch (error) {
            console.error(error)
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true })
            } else {
                await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true })
            }
        }
    } else {
        console.error(`${interaction.commandName}というコマンドには対応していません。`)
    }
})


app.use(bodyParser.json());

app.post('/github-webhook', (req, res) => {
  const payload = req.body;
  console.log("post request")
  console.log(payload)
});

app.listen(port, () => {
  console.log(`Webhook receiver app listening at http://localhost:${port}`);
});



// Discordへの接続
client.login(token)
