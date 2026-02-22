module.exports = {
  apps: [
    {
      name: "server",
      script: "./src/server.js",   // correct path
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 5000,
        EMAIL_USER: "pg261610@gmail.com",
        EMAIL_PASS: "zwzh qnhy vgvg muzn",
        FRONTEND_URL: "https://sellaids.com",
        BASE_URL: "https://sellaids.com",
      }
    }
  ]
};
