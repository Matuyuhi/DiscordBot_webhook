/**
 * EmbedBuilderの作成用
 *
 */

const { EmbedBuilder } = require('discord.js')

exports.ping = function () {
    const data = {
        // content: 'Hello, world!',
        embeds: [
            new EmbedBuilder() // メッセージに埋め込むオブジェクト
                .setTitle('This is Server <=> Client Test')
                .setDescription('Connection OK!!!')
                .setColor('#0099ff')
                .setTimestamp(),
        ],
    }
    return data
}

exports.message = function (title, discription, link = null) {
    const data = new EmbedBuilder()
    if (link != null) {
        data.setURL(link)
    }
    return {
        // content: 'Hello, world!',
        embeds: [
            data // メッセージに埋め込むオブジェクト
                .setTitle(title)
                .setDescription(discription)
                .setColor('#0099ff')
                .setTimestamp(),
        ],
    }
}

exports.template = function () {
    const embed = new EmbedBuilder()
        .setTitle('埋め込みのタイトル 256字まで')
        .setDescription('埋め込みの説明 4096字まで')
        .setAuthor({
            name: '著者名 256字',
            iconURL:
                'https://gyazo.com/520c092f191cf3c7dcd75a559b7dd536/max_size/1000',
        })
        .setURL('https://google.com')
        .setThumbnail(
            'https://gyazo.com/520c092f191cf3c7dcd75a559b7dd536/max_size/1000'
        )
        .setImage(
            'https://p.kindpng.com/picc/s/108-1084174_discord-js-discord-js-logo-png-transparent-png.png'
        )
        .addFields(
            {
                name: 'json形式で書けるフィールド、こっちは名前で最大256字',
                value: 'フィールドの値　※1024字まで',
            },
            {
                name: '`{name:"name",value:"value"}`で1セット',
                value: '足りないとエラーが出る',
            }
        )
        .addFields({
            name: 'inline: trueを加えることで',
            value: 'インラインにできる',
            inline: true,
        })
        .setColor('#00ff00')
        // .setFooter(
        //     '埋め込みのフッター 2048字まで\n埋め込み全体の文字数は6000字まで\n一つのメッセージで送れる埋め込みは10個'
        // )
        .setTimestamp()
    return {
        embeds: [embed],
    }
}

exports.help = function (subopt = null) {
    const embed = new EmbedBuilder()
        .setAuthor({
            name: '/help -sub ' + subopt,
        })
        .setTitle('Github Team Link')
        .setURL('https://github.com/A-Classe')
        .setDescription(
            '**This is A-Class**\n\nhttps://automatic.links\n> Block Quotes\n```\nCode Blocks\n```\n*Emphasis* or _emphasis_\n`Inline code` or ``inline code``\n[Links](https://example.com)\n<@U- >, <@!123>, <#123>, <@&123>, @here, @everyone mentions\n||Spoilers||\n~~Strikethrough~~\n**Strong**\n__Underline__'
        )
        .setFooter({
            text: 'v0.1.4-beta',
            iconURL: 'https://slate.dan.onl/slate.png',
        })
        .setTimestamp()
    if (subopt == 'link') {
        embed.addFields(
            {
                name: 'json形式で書けるフィールド、こっちは名前で最大256字',
                value: 'フィールドの値　※1024字まで',
            },
            {
                name: '### 足りないとエラーが出る',
                value: '[で1セット](https://github.com)',
            },
            {
                name: 'Author',
                value: 'Discord U-#1219\n[Matuyuhi](https://github.com/Matuyuhi) \n[source code](https://github.com/Matuyuhi/discord_bot_test)',
            }
        )
    } else {
        embed.addFields(
            {
                name: 'command 一覧',
                value: '/help sub[option]',
            },
            {
                name: '/help',
                value: 'botのヘルプ',
            },
            {
                name: '/help sub [options]',
                value: 'option\n L  link  -- リンクのtitleとURLを表示\n L',
            },
            {
                name: '/link to [title] for [link]',
                value: 'title \n\nex)\n /link  to [projectA]   for [https://example.com/hoge] dis [なんかリンク]\n-> \n**[projectA](https://example.com/hoge) **\n   L なんかのリンク\n\n/ link list --- 一覧表示\n-> \n**[projectA](https://example.com/hoge)**\n   L なんかのリンク\n**[projectB](https://example.com/hoge)**\n   L なんかのリンク\n**[projectC](https://example.com/hoge)**\n   L なんかのリンク',
            },
            {
                name: 'Author',
                value: 'Discord U-#1219\n[Matuyuhi](https://github.com/Matuyuhi) \n[source code](https://github.com/Matuyuhi/discord_bot_test)',
            }
        )
    }
    return {
        embeds: [embed],
    }
}
