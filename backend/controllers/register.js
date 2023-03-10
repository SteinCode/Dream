const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("../../server.js");

exports.registerUser = (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const role = req.body.role; // Retrieve the value of the role field

  if (!role) {
    // Check if the role variable is empty
    return res.render("register", {
      message: "Please select a role",
    });
  }

  db.query(
    "SELECT email FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }

      if (results.length > 0) {
        return res.render("register", {
          message: "The email is already in use",
        });
      } else if (password !== passwordConfirm) {
        return res.render("register", {
          message: "Passwords do not match",
        });
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      db.query(
        "INSERT INTO users SET ?",
        {
          name: name,
          surname: surname,
          email: email,
          phoneNumber: phoneNumber,
          password: hashedPassword,
          role: role, // Use the value of the role field in the INSERT query
        },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            // req.session.message = "User registered. Please login.";
            // res.app.locals.loginController.loginRenderAfterRegistration(
            //   req,
            //   res
            // );
            res.redirect("/login");
          }
        }
      );
    }
  );
};

exports.registerRender = (req, res) => {
  res.render("register");
};
