const app = require("./app");
// Set port
const PORT = process.env.PORT || 3000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Dreamwork has started, the server is running on ${PORT} port`);
});

module.exports = { server };
