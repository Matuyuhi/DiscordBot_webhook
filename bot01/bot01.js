
// discord.js モジュールのインポート
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Discord Clientのインスタンス作成
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// トークンの用意
const { token } = require("./.env.json");
// 起動するとconsoleにready...と表示される
client.once(Events.ClientReady, c => {
    console.log(`${c.user.tag}ready...`);
});


// Discordへの接続
client.login(token);
