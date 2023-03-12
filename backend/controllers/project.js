const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("../../server.js");
const flash = require("express-flash");

//GET
exports.project = (req, res) => {
  const token = req.cookies.token; // Read cookie
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    db.query("SELECT * FROM users", (error, results) => {
        if (error) {
          console.log(error);
        }
        const users = results;
        res.render("project", {
            users,
          successMessage: req.flash("successMessage"),
          errorMessage: req.flash("errorMessage"),
        });
      });
  } catch (err) {
    console.log(err);
    return res.redirect("/login");
  }
};

//POST
exports.Addproject = (req, res) => {
    const token = req.cookies.token; // Read cookie
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { projectName, users } = req.body;
    const project = { name: projectName };

    db.query("INSERT INTO project SET ?", project,  (error, results) => {
        if (error) {
          console.log(error);
        }
      });
  } catch (err) {
    console.log(err);
    return res.redirect("/login");
  }
};
