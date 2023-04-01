const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("../../server.js");
const flash = require("express-flash");

// GET method to display project page
exports.project = (req, res) => {
  const token = req.cookies.token; // Read cookie
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    getUsers((error, results) => {
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

// Helper function to get all users
function getUsers(callback) {
  db.query("SELECT * FROM users", callback);
}

// POST method to add a new project
exports.addProject = async (req, res) => {
  const token = req.cookies.token; // Read cookie
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { projectName, users } = req.body;
    const project = { name: projectName };

    const projectId = await insertProject(project);

    if (users && users.length > 0) {
      const values = users.map((user) => [projectId, user.id]);
      await insertProjectUsers(values);
    }

    return res.json({ projectId });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Helper function to insert a new project
function insertProject(project) {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO project (name) VALUES (?)",
      [project.name],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.insertId);
        }
      }
    );
  });
}

// Helper function to insert project users
function insertProjectUsers(values) {
  return new Promise((resolve, reject) => {
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