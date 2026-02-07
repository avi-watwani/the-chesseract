module.exports = {
  apps: [{
    name: 'chesseract-websocket',
    script: './index.ts',
    interpreter: 'node',
    interpreter_args: '-r ts-node/register',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
