module.exports = {
  apps: [
    {
      name: "portfolio-server",
      cwd: "c:/Users/shash/Downloads/MY/portfolio_2/CloudArchitectfolio",
      script: "server/index.ts",
      interpreter: "node_modules/.bin/tsx",
      instances: 1,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      env_file: ".env",
      env: {
        NODE_ENV: "production"
      },
      out_file: "logs/out.log",
      error_file: "logs/err.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    }
  ]
};
