module.exports = {
  apps: [{
    name: "portfolio-backend",
    script: "./server/index.js",
    env: {
      NODE_ENV: "production",
      PORT: 3001
    },
    // Watch disabled in production to avoid restart loops
    watch: false,
    // Restart on memory leak (optional safety net)
    max_memory_restart: "500M"
  }]
};
