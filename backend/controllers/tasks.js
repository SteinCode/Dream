const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../database.js");

exports.tasks = (req, res) => {
  const token = req.cookies.token; // Read cookie
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    getUser(userId, (error, user) => {
      if (error) {
        console.log(error);
        return res.redirect("/login");
      }

      getTasksForUser(userId, (error, tasks) => {
        if (error) {
          console.log(error);
          return res.redirect("/login");
        }

        getDevelopers((error, developers) => {
          if (error) {
            console.log(error);
            return res.redirect("/login");
          }

          res.render("tasks", { user, tasks, developers });
        });
      });
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/login");
  }
};

function getUser(userId, callback) {
  db.query("SELECT * FROM users WHERE id = ?", [userId], (error, results) => {
    if (error) {
      return callback(error);
    }
    const user = results[0];
    return callback(null, user);
  });
}

function getTasksForUser(userId, callback) {
  db.query(
    "SELECT * FROM tasks WHERE asignee_id = ?",
    [userId],
    (error, results) => {
      if (error) {
        return callback(error);
      }
      const tasks = results;
      return callback(null, tasks);
    }
  );
}

function getDevelopers(callback) {
  db.query("SELECT * FROM users WHERE role = 'developer'", (error, results) => {
    if (error) {
      return callback(error);
    }
    const developers = results;
    return callback(null, developers);
  });
}
