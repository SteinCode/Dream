const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("../../server.js");

//GET
exports.loginRender = (req, res) => {
  const token = req.cookies.token; // Read cookie
  if (token) {
    console.log("user already logged in");
    return res.redirect("/");
  }
  res.render("login", {
    successMessage: req.flash("successMessage"),
    errorMessage: req.flash("errorMessage"),
  });
};

//POST
exports.loginValidate = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const users = await getUserByEmail(email);
    const { isAuthenticated, authenticatedUser } = await authenticateUser(
      password,
      users
    );

    if (isAuthenticated) {
      const token = createToken(authenticatedUser.id);
      res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });
      return res.redirect("/");
    } else {
      req.flash("errorMessage", "Incorrect credentials.");
      return res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    req.flash("errorMessage", "Something went wrong.");
    return res.redirect("/login");
  }
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

const authenticateUser = async (password, users) => {
  let isAuthenticated = false;
  let authenticatedUser = null;

  for (const user of users) {
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      isAuthenticated = true;
      authenticatedUser = user;
      break;
    }
  }

  return { isAuthenticated, authenticatedUser };
};

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
