const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../database.js");
const { json } = require("body-parser");

getLoggedUserId = (req, res) => {
  const token = req.cookies.token;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    res.json({ userId });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

function getUsers(callback) {
  db.query("SELECT * FROM user", (error, results) => {
    if (error) {
      console.log(error);
      return callback(error);
    }
    return callback(null, results);
  });
}

function getUserById(userId, callback) {
  db.query("SELECT * FROM user WHERE id = ?", [userId], (error, results) => {
    if (error) {
      console.log(error);
      return callback(error);
    }
    const user = results[0];
    return callback(null, user);
  });
}

module.exports = {
  getLoggedUserId,
  getUsers,
  getUserById,
};
