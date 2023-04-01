const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("../../server.js");

exports.home = (req, res) => {
  const token = req.cookies.token; // Read cookie
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    db.query("SELECT * FROM users WHERE id = ?", [userId], (error, results) => {
      if (error) {
        console.log(error);
      }
      const user = results[0];
      res.render("home", { user });
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/login");
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
};

// CODE GENERATION FUNCTIONS

exports.invitationCode = async (req, res) => {
  const code = generateCode(20);
  addCodeToDB(code, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error generating code");
    } else {
      // Generate a JWT with the code as payload
      const token = jwt.sign({ code }, process.env.JWT_SECRET);
      res.json({ token, code });
    }
  });
};

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
  db.query(query, [code, expires_at], callback);
}

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

// Run the function every hour
setInterval(deleteExpiredCodes, 60 * 60 * 1000);
