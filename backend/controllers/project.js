const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../database.js");
const flash = require("express-flash");
const user = require("./user.js");

// GET method to render the "project" page
exports.project = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return handleUnauthenticatedUser(res);
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    const userData = await getUserDataById(userId);
    const projects = await getProjectsData(userData);

    renderProjectPage(req, res, userData, projects);
  } catch (err) {
    handleError(res, err);
  }
};

const handleUnauthenticatedUser = (res) => {
  res.redirect("/login");
};

const handleError = (res, error) => {
  console.log(error);
  res.redirect("/login");
};

const getUserDataById = (userId) => {
  return new Promise((resolve, reject) => {
    user.getUserById(userId, (error, userData) => {
      if (error) {
        reject(error);
      } else {
        resolve(userData);
      }
    });
  });
};

const getProjectsData = (user) => {
  return new Promise((resolve, reject) => {
    getProjects((error, projectResults) => {
      if (error) {
        reject(error);
      } else {
        resolve(projectResults);
      }
    });
  });
};

// Function to handle rendering the "project" page
const renderProjectPage = (req, res, user, projects) => {
  res.render("project", {
    user,
    projects,
    successMessage: req.flash("successMessage"),
    errorMessage: req.flash("errorMessage"),
  });
};

function getProjects(callback) {
  db.query("SELECT * FROM project", callback);
}

// POST method to add a new project
exports.createProject = async (req, res) => {
  const token = req.cookies.token;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.id;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const projectName = req.body.createProjectName;
    const projectDeadline = req.body.createProjecDeadline;
    const projectDescription = req.body.createProjectDescription;
    const projectManagerId = userId;

    await insertProjectIntoDatabase(
      db,
      projectName,
      projectDeadline,
      projectDescription,
      projectManagerId
    );

    res.redirect("/project");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function insertProjectIntoDatabase(
  db,
  projectName,
  projectDeadline,
  projectDescription,
  projectManagerId
) {
  try {
    await db.query(
      "INSERT INTO project (name, deadline, description, manager) VALUES (?, ?, ?, ?)",
      [projectName, projectDeadline, projectDescription, projectManagerId]
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
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
    await db.query("DELETE FROM project_user WHERE project_id = ?", [
      projectId,
    ]);
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
    const fieldValue = req.body.fieldValue; // Retrieve the "name" value from the request body
    console.log(fieldValue);
    // put
    await db.query("UPDATE project SET name = ? WHERE project_id = ?", [
      fieldValue,
      projectId,
    ]);

    return res.json({ message: "Project updated successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
