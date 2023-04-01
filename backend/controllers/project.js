// POST
exports.addProject = async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    const { projectName, users } = req.body;
    const project = { name: projectName };

    const projectId = await insertProject(project);

    if (users && users.length > 0) {
      await addUsersToProject(projectId, users);
    }

    return res.json({ projectId });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// GET
exports.project = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    getUsers((error, users) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
      }
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

// Pagalbines
async function insertProject(project) {
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

async function addUsersToProject(projectId, users) {
  const values = users.map((user) => [projectId, user.id]);
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

function getUsers(callback) {
  db.query("SELECT * FROM users", (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, results);
    }
  });
}