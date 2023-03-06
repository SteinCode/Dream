const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

exports.renderLogin = (req, res) => {
  console.log("issikviecia-----------------------------------------");
  const token = req.cookies.token; // Read cookie
  if (token) {
    console.log("user already logged in");
    return res.render("index");
  }
  res.render("login");
};

exports.login = (req, res) => {
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
      res.render("index", { user });
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

exports.register = (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
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
          password: hashedPassword,
          role: role, // Use the value of the role field in the INSERT query
        },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            return res.render("login", {
              message: "User registered. Please login.",
            });
          }
        }
      );
    }
  );
};
