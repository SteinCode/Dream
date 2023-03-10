const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("../../server.js");
const flash = require("express-flash");

//GET
exports.profile = (req, res) => {
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
      res.render("profile", {
        user,
        successMessage: req.flash("successMessage"),
        errorMessage: req.flash("errorMessage"),
      });
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/login");
  }
};

//PUT
exports.updateUser = (req, res) => {
  const token = req.cookies.token;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.userId;

  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  const repeatPassword = req.body.repeatPassword;
  const role = req.body.role;
  const passwordChecked = req.body.passwordChecked === "true";

  if (passwordChecked) {
    // Password change is enabled
    if (currentPassword === "") {
      // Current password field is empty
      req.flash("errorMessage", "Please enter your current password..");
      res.redirect("/profile");
    } else if (newPassword === "") {
      // New password field is empty
      req.flash("errorMessage", "Please enter a new password.");
      res.redirect("/profile");
    } else if (newPassword !== repeatPassword) {
      // New password and repeat password fields do not match
      req.flash(
        "errorMessage",
        "New password and repeat password fields do not match."
      );
      return res.redirect("/profile");
    } else {
      // Verify current password before updating
      db.query(
        "SELECT password FROM users WHERE id = ?",
        [userId],
        (error, results) => {
          if (error) {
            console.log(error);
            req.flash(
              "errorMessage",
              "An error occurred while updating your password. Please try again later.."
            );
            return res.redirect("/profile");
          }

          const passwordMatch = bcrypt.compareSync(
            currentPassword,
            results[0].password
          );
          if (!passwordMatch) {
            // Current password is incorrect
            req.flash("errorMessage", "Current password is incorrect.");
            return res.redirect("/profile");
          }

          // Hash and update the new password
          const hashedPassword = bcrypt.hashSync(newPassword, 10);
          db.query(
            "UPDATE users SET name = ?, surname = ?, email = ?, phoneNumber = ?, password = ? WHERE id = ?",
            [name, surname, email, phoneNumber, hashedPassword, userId],
            (error, results) => {
              if (error) {
                console.log(error);
                req.flash(
                  "errorMessage",
                  "Your profile was successfully updated!"
                );
                return res.redirect("/profile");
              }

              req.flash(
                "successMessage",
                "Your profile was successfully updated!"
              );
              return res.redirect("/profile");
            }
          );
        }
      );
    }
  } else {
    // Password change is disabled
    db.query(
      "UPDATE users SET name = ?, surname = ?, email = ?, phoneNumber = ? WHERE id = ?",
      [name, surname, email, phoneNumber, userId],
      (error, results) => {
        if (error) {
          console.log(error);
          req.flash(
            "errorMessage",
            "There was an error while updating your profile..."
          );
          return res.redirect("/profile");
        } else {
          req.flash("successMessage", "Your profile was successfully updated!");
          return res.redirect("/profile");
        }
      }
    );
  }
};
