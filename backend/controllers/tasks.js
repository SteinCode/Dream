const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../database.js");
const { json } = require("body-parser");

//GET
exports.tasks = (req, res) => {
  const token = req.cookies.token; // Read cookie
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const userRole = decodedToken.role;

    getUser(userId, (error, user) => {
      if (error) {
        console.log(error);
        return res.redirect("/login");
      }

      getTasksForUser(userId, userRole, (error, tasks) => {
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

function getTasksForUser(userId, userRole, callback) {
  if (userRole === "Project manager") {
    db.query(
      "SELECT tasks.*, users.name AS user_name, users.surname AS user_surname FROM tasks INNER JOIN users ON tasks.asignee_id = users.id WHERE tasks.manager_id = ?",
      [userId],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        const tasks = results;
        console.log(JSON.stringify(tasks));
        return callback(null, tasks);
      }
    );
  } else if (userRole === "Developer") {
    db.query(
      "SELECT tasks.*, users.name AS user_name, users.surname AS user_surname FROM tasks INNER JOIN users ON tasks.manager_id = users.id WHERE tasks.asignee_id = ?",
      [userId],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        const tasks = results;
        return callback(null, tasks);
      }
    );
  } else {
    console.log(
      "Error: probably bad naming in database, should be Project manager or Developer"
    );
  }
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

//POST
exports.createTask = (req, res) => {
  const token = req.cookies.token; // Read cookie
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decodedToken.id;

  const {
    taskName,
    taskDescription,
    taskDifficulty,
    taskDeadline,
    assignedUserId,
  } = req.body;
  console.log(assignedUserId);
  db.query(
    "INSERT INTO tasks SET ?",
    {
      name: taskName,
      description: taskDescription,
      status: "to do",
      difficulty: taskDifficulty,
      deadline: taskDeadline,
      manager_id: userId,
      asignee_id: assignedUserId,
      project_id: 1, //TEMPORARY!
    },
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error creating task");
      } else {
        return res.redirect("/tasks");
        // res.status(200).json({ newTask: results }); // Return the newly created task
      }
    }
  );
};