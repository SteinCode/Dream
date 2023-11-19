const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../database.js");
const { generateCode, addCodeToDB } = require("./codeGenerator");

exports.home = (req, res) => {
  const token = req.cookies.token; // Read cookie
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const activeProjectName = req.cookies.activeProjectName;
    db.query("SELECT * FROM user WHERE id = ?", [userId], (error, results) => {
      if (error) {
        console.log(error);
      }
      const user = results[0];
      getCodes((err, codes) => {
        if (err) {
          console.log(err);
        }
        res.render("home", { user, codes, activeProjectName });
      });
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

function getCodes(callback) {
  db.query("SELECT * FROM codes", (error, results) => {
    if (error) {
      return callback(error);
    }
    const codes = results;
    return callback(null, codes);
  });
}

exports.updateExpirationDate = (req, res) => {
  const code = req.params.code; // Get code from URL parameter
  const date = req.body.expiration_time; // Get new expiration date from request body
  db.query(
    "UPDATE codes SET expiration_time=? WHERE code=?",
    [date, code],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error updating code expiration date");
      } else {
        res.status(200).send("Code expiration date was updated successfully");
      }
    }
  );
};
