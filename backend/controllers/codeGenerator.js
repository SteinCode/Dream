const db = require("../../database.js");

function generateCode(length) {
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
  db.query(query, [code, expires_at], function (error, results, fields) {
    if (error) {
      callback(error);
    } else {
      callback(null, results);
    }
  });
}

module.exports = {
  generateCode,
  addCodeToDB,
};

function deleteExpiredCodes() {
  const now = new Date();
  const query = "DELETE FROM codes WHERE expiration_time < ?";
  db.query(query, [now], (err, result) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Deleted ${result.affectedRows} expired codes`);
    }
  });
}

setInterval(deleteExpiredCodes, 60 * 60 * 1000);
