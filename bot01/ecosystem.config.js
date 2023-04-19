module.exports = {
  apps: [
    {
      name: 'bot01',
      script: 'bot01.sh',
      watch: ['bot01.js'],
      ignore_watch: ['node_modules'],
      '--log-date-format': 'YYYY-MM-DD HH:mm Z',
      error_file: './.pm2/logs/bot01-error.log',
      log_file: './.pm2/logs/bot01-log.log',
      out_file: './.pm2/logs/bot01-out.log',
    },
  ],
}

