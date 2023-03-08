const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("../../server.js");
//GET
exports.loginRender = (req, res) => {
  const token = req.cookies.token; // Read cookie
  if (token) {
    console.log("user already logged in");
    res.redirect("/");
  }
  res.render("login");
};

//POST
exports.loginValidate = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      }

      let isAuthenticated = false;
      let authenticatedUser = null;

      for (const user of results) {
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          isAuthenticated = true;
          authenticatedUser = user;
          break;
        }
      }

      if (isAuthenticated) {
        const token = jwt.sign(
          { userId: authenticatedUser.id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("token", token, { httpOnly: true, maxAge: 3600000 }); // Set cookie with token
        return res.redirect("/");
      } else {
        return res.render("login", {
          message: "incorrect credentials",
        });
      }
    }
  );
};
