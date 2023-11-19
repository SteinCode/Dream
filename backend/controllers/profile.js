const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../database.js");
const flash = require("express-flash");

//GET
exports.profile = (req, res) => {
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

      res.render("profile", {
        user,
        activeProjectName,
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
exports.updateUser = async (req, res) => {
  const userId = getUserId(req);

  const {
    name,
    surname,
    email,
    phoneNumber,
    passwordChecked,
    currentPassword,
    newPassword,
    repeatPassword,
    role,
  } = req.body;

  if (passwordChecked) {
    await updatePassword(
      userId,
      currentPassword,
      newPassword,
      repeatPassword,
      req,
      res
    );
  } else {
    await updateProfile(userId, name, surname, email, phoneNumber, req, res);
  }
};

function getUserId(req) {
  const token = req.cookies.token;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken.id;
}

async function updatePassword(
  userId,
  currentPassword,
  newPassword,
  repeatPassword,
  req,
  res
) {
  if (currentPassword === "") {
    req.flash("errorMessage", "Please enter your current password.");
    res.redirect("/profile");
    return;
  }

  if (newPassword === "") {
    req.flash("errorMessage", "Please enter a new password.");
    res.redirect("/profile");
    return;
  }

  if (newPassword !== repeatPassword) {
    req.flash(
      "errorMessage",
      "New password and repeat password fields do not match."
    );
    res.redirect("/profile");
    return;
  }

  try {
    const user = await getUserById(userId);
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      req.flash("errorMessage", "Current password is incorrect.");
      res.redirect("/profile");
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(userId, hashedPassword);

    req.flash("successMessage", "Your profile was successfully updated!");
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
    req.flash(
      "errorMessage",
      "An error occurred while updating your password. Please try again later."
    );
    res.redirect("/profile");
  }
}

async function getUserById(userId) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM user WHERE id = ?", [userId], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
}

async function updateUserPassword(userId, hashedPassword) {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE user SET password = ? WHERE id = ?",
      [hashedPassword, userId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

async function updateProfile(
  userId,
  name,
  surname,
  email,
  phoneNumber,
  req,
  res
) {
  if (
    name.length > 50 ||
    surname.length > 50 ||
    phoneNumber.length > 50 ||
    email.length > 50
  ) {
    req.flash(
      "errorMessage",
      "Name, surname, email, and phone number should be under 50 characters."
    );
    res.redirect("/profile");
    return;
  }

  try {
    await updateUser(userId, name, surname, email, phoneNumber);
    req.flash("successMessage", "Your profile was successfully updated!");
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
    req.flash(
      "errorMessage",
      "There was an error while updating your profile."
    );
    res.redirect("/profile");
  }
}

async function updateUser(userId, name, surname, email, phoneNumber) {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE user SET name = ?, surname = ?, email = ?, phoneNumber = ? WHERE id = ?",
      [name, surname, email, phoneNumber, userId],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

//DELETE
exports.deleteUser = (req, res) => {
  const token = req.cookies.token; // Read cookie
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = req.params.id;
    db.query("DELETE FROM user WHERE id = ?", [userId], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete user" });
      }
      const user = results[0];
      res.clearCookie("token"); // clear the session cookie
      return res.status(200).json({ message: "User deleted successfully" });
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/login");
  }
};
