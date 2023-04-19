# ローカルのテスト環境用

###### - 動作確認済み環境
```
- macOS 
  Docker version 20.10.22, build 3a2c30b
  Docker Compose version v2.15.1
```
- 起動 (要docker-composeのインストール)
```
make
```

### 仕様

docker nodeのpm2で実行  
pm2のログは../shiftapp/.pm2/logsに生成
```
.
├── Makefile
├── README.md
├── db
│   ├── conf
│   │   └── my.conf　　　設定
│   ├── data  　　　　　　data保管
│   ├── init.d
│   │   └── create.sql　初回起動時のtableとサンプルの作成
│   └── logs
│       └── general.log sqlのログ
└── docker-compose.yml
```
初回起動時にサンプルのシフトを作成  
(今週と来週のシフトをランダムで入力)  
サンプルのシフトの作り直す場合は./dataフォルダを削除し、  
make down && run
