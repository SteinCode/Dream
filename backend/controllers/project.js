const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../database.js");
const flash = require("express-flash");

//GET
exports.project = (req, res) => {
  const token = req.cookies.token; // Read cookie
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    getUser(userId, (error, user) => {
      if (error) {
        console.log(error);
        return res.redirect("/login");
      }
      db.query("SELECT * FROM users", (error, results) => {
        if (error) {
          console.log(error);
        }
        const users = results;
        res.render("project", {
          user,
          users,
          successMessage: req.flash("successMessage"),
          errorMessage: req.flash("errorMessage"),
        });
      });
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/login");
  }
};

// POST
exports.addProject = async (req, res) => {
  const token = req.cookies.token; // Read cookie
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { projectName, users } = req.body;
    const project = { name: projectName };

    const projectId = await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO project (name) VALUES (?)",
        [project.name], // add square brackets to pass the name as an array
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results.insertId);
          }
        }
      );
    });

    if (users && users.length > 0) {
      const values = users.map((user) => [projectId, user.id]);
      await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO project_user (project_id, user_id) VALUES ?",
          [values],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
    }

    return res.json({ projectId });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
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
