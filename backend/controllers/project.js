const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../database.js");
const flash = require("express-flash");

// GET method to display project page
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
      getProjects((error, projectResults) => {
        if (error) {
          console.log(error);
          return res.redirect("/login");
        }
        const projects = projectResults;
        getUsers((error, usersResults) => {
          if (error) {
            console.log(error);
            return res.redirect("/login");
          }
          const users = usersResults;
          res.render("project", {
            user,
            users,
            projects,
            successMessage: req.flash("successMessage"),
            errorMessage: req.flash("errorMessage"),
          });
        }); // <-- add this closing brace
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

// Helper function to get all projects
function getProjects(callback) {
  db.query("SELECT * FROM project", callback);
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

function getUser(userId, callback) {
  db.query("SELECT * FROM users WHERE id = ?", [userId], (error, results) => {
    if (error) {
      return callback(error);
    }
    const user = results[0];
    return callback(null, user);
  });
}
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

// delete project
exports.deleteProject = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const projectId = req.params.projectID;
    // Delete project users
    await deleteProjectUsers(db, projectId);

    // Delete project
    await deleteProjectFromDatabase(db, projectId);

    return res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error TEST" });
  }
};

async function deleteProjectUsers(db, projectId) {
  try {
    await db.query("DELETE FROM project_user WHERE project_id = ?", [projectId]);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function deleteProjectFromDatabase(db, projectId) {
  try {
    await db.query("DELETE FROM project WHERE project_id = ?", [projectId]);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// put project
exports.updateProject = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const projectId = req.params.projectID;
    const fieldValue  = req.body.fieldValue; // Retrieve the "name" value from the request body
      console.log(fieldValue);
    // put
    await db.query("UPDATE project SET name = ? WHERE project_id = ?", [fieldValue, projectId]);

    return res.json({ message: "Project updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
