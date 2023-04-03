const { db } = require("../../server.js");

function generateCode(length) {
  if (isNaN(length)) {
    throw new Error("Length must be a number");
  }
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

function addCodeToDB(code, callback) {
  const query = "INSERT INTO codes (code, expiration_time) VALUES (?, ?)";
  const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
  db.query(query, [code, expires_at], callback);
}

module.exports = {
  generateCode,
  addCodeToDB,
};

// function deleteExpiredCodes() {
//   const now = new Date();
//   const query = "DELETE FROM codes WHERE expiration_time < ?";
//   db.query(query, [now], (err, result) => {
//     if (err) {
//       console.error(err);
//     } else {
//       console.log(`Deleted ${result.affectedRows} expired codes`);
//     }
//   });
// }

// Run the function every hour
// setInterval(deleteExpiredCodes, 60 * 60 * 1000);
