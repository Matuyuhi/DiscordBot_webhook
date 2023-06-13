# discord_bot_test
github webhook からdiscordに通知を送るbot
discord.js + expressjs


## 動作確認済み環境
- macOS 13.4
- nodejs v20.2.0
- npm 9.6.6
---
## テスト方法
※ 権限を付与したdiscord botを用意必須  
- bot01/.enj.jsonに作成したbotのtokenとapplicationIdを入力
```
cd docker
# 起動
make
# 終了
make down
```
