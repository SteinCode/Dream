const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../database.js");

exports.registerUser = (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const role = req.body.role; // Retrieve the value of the role field
  const code = req.body.code; // Retrieve the value of the code field
  if (
    !name ||
    !surname ||
    !email ||
    !phoneNumber ||
    !password ||
    !passwordConfirm ||
    !code
  ) {
    req.flash("errorMessage", "Please fill all the fields!");
    return res.redirect("/register");
  } else if (!role) {
    // Check if the role variable is empty
    req.flash("errorMessage", "Please select a role!");
    return res.redirect("/register");
  } else {
    db.query(
      "SELECT email FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          req.flash(
            "errorMessage",
            "There was unknown error, sorry and try again later!"
          );
          return res.redirect("/register");
        }

        if (results.length > 0) {
          req.flash("errorMessage", "The email is already in use!");
          return res.redirect("/register");
        } else if (password !== passwordConfirm) {
          req.flash("errorMessage", "Passwords do not match!");
          return res.redirect("/register");
        }

        db.query(
          "SELECT * FROM codes WHERE code = ?",
          [code],
          async (error, results) => {
            if (error) {
              req.flash(
                "errorMessage",
                "There was unknown error, sorry and try again later!"
              );
              return res.redirect("/register");
            }

            if (results.length === 0) {
              req.flash("errorMessage", "The code is invalid!");
              return res.redirect("/register");
            }

            let hashedPassword = await bcrypt.hash(password, 8);

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
                  req.flash(
                    "errorMessage",
                    "There was some unknow error, we are sorry, please try again later"
                  );
                  console.log(error);
                  return res.redirect("/register");
                } else {
                  console.log(results);
                  db.query(
                    "DELETE FROM codes WHERE code = ?",
                    [code],
                    (error, results) => {
                      if (error) {
                        req.flash(
                          "errorMessage",
                          "There was some unknow error, we are sorry, please try again later"
                        );
                        console.log(error);
                        return res.redirect("/register");
                      } else {
                        req.flash(
                          "successMessage",
                          "The account was successfully created, now you can login."
                        );
                        return res.redirect("/login");
                      }
                    }
                  );
                }
              }
            );
          }
        );
      }
    );
  }
};

exports.registerRender = (req, res) => {
  res.render("register", {
    successMessage: req.flash("successMessage"),
    errorMessage: req.flash("errorMessage"),
  });
};
