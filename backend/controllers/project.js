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
    const projects = await getProjects();

    let activeProjectId = req.cookies.activeProjectId;
    let activeProjectData;
    let activeProjectManagerName = req.cookies.activeProjectManagerName;
    let activeProjectManagerSurname = req.cookies.activeProjectManagerSurname;
    let activeProjectAttendantsIds = await getAttendantsFromDatabase(
      db,
      activeProjectId
    );
    console.log(activeProjectAttendantsIds);
    let activeProjectAttendants = [];

    for (let i = 0; i < activeProjectAttendantsIds.length; i++) {
      let attendantData = await getUserDataById(
        activeProjectAttendantsIds[i].user_id
      );
      activeProjectAttendants.push(attendantData);
    }
    if (activeProjectId) {
      activeProjectData = await getProjectById(activeProjectId);
    } else {
      activeProject = await getFirstProjectId();
      activeProjectData = await getProjectById(activeProjectId);
    }
    renderProjectPage(
      req,
      res,
      userData,
      projects,
      activeProjectData,
      activeProjectManagerName,
      activeProjectManagerSurname,
      activeProjectAttendants
    );
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

const getProjectById = (projectId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM project WHERE project_id = ?",
      [projectId],
      (error, results) => {
        if (error) {
          reject(error);
        } else if (results.length === 0) {
          resolve(null);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
};

const getFirstProjectId = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT project_id FROM project LIMIT 1", (error, results) => {
      if (error) {
        reject(error);
      } else if (results.length === 0) {
        resolve(-1);
      } else {
        resolve(results[0].id);
      }
    });
  });
};

const renderProjectPage = (
  req,
  res,
  user,
  projects,
  activeProject,
  activeProjectManagerName,
  activeProjectManagerSurname,
  activeProjectAttendants
) => {
  res.render("project", {
    user,
    projects,
    activeProject,
    activeProjectManagerName,
    activeProjectManagerSurname,
    activeProjectAttendants,
    successMessage: req.flash("successMessage"),
    errorMessage: req.flash("errorMessage"),
  });
};

function getProjects() {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM project", (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
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

    await deleteProjectUsers(db, projectId);

    await deleteProjectTasks(db, projectId);

    await deleteProject(db, projectId);

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

async function deleteProject(db, projectId) {
  try {
    await db.query("DELETE FROM project WHERE project_id = ?", [projectId]);
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function deleteProjectTasks(db, projectId) {
  try {
    await db.query("DELETE FROM task WHERE project_id = ?", "project_id");
  } catch (error) {
    console.log(error);
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
    const fieldValue = req.body.fieldValue;
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

exports.setActiveProject = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const projectId = req.params.projectID;
    const projectData = await getProjectById(projectId);
    const projectName = projectData.name;

    managerData = await getUserDataById(projectData.manager);
    res.cookie("activeProjectId", projectId, {
      maxAge: 900000,
      httpOnly: true,
    });
    res.cookie("activeProjectName", projectName, {
      maxAge: 900000,
      httpOnly: true,
    });
    res.cookie("activeProjectManagerName", managerData["name"], {
      maxAge: 900000,
      httpOnly: true,
    });
    res.cookie("activeProjectManagerSurname", managerData["surname"], {
      maxAge: 900000,
      httpOnly: true,
    });
    return res.json({ message: "Active project set successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.addAttendant = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const projectId = req.params.projectID;
    const attendantId = req.params.attendantID;

    await insertAttendantIntoDatabase(db, projectId, attendantId);

    return res.json({ message: "Attendant added successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function insertAttendantIntoDatabase(db, projectId, attendantId) {
  try {
    await db.query(
      "INSERT INTO project_user (project_id, user_id) VALUES (?, ?)",
      [projectId, attendantId]
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}

exports.deleteAttendant = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const projectId = req.params.projectID;
    const attendantId = req.params.attendantID;

    await deleteAttendantFromDatabase(db, projectId, attendantId);

    return res.json({ message: "Attendant deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function deleteAttendantFromDatabase(db, projectId, attendantId) {
  try {
    await db.query(
      "DELETE FROM project_user WHERE project_id = ? AND user_id = ?",
      [projectId, attendantId]
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}

exports.getAttendants = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const projectId = req.params.projectID;

    const attendants = await getAttendantsFromDatabase(db, projectId);

    return res.json({ attendants });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function getAttendantsFromDatabase(db, projectId) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT user_id FROM project_user WHERE project_id = ?",
      [projectId],
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
