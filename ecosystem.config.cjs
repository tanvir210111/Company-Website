module.exports = {
  apps: [
    {
      name: 'mediascope-backend',
      script: 'index.js',
      cwd: '/var/www/mediascopeit/backend',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    }
  ]
};
