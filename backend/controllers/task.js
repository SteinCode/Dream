const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../../database.js");
const { json } = require("body-parser");

//GET
exports.task = (req, res) => {
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

          res.render("task", { user, tasks, developers });
        });
      });
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/login");
  }
};

function getUser(userId, callback) {
  db.query("SELECT * FROM user WHERE id = ?", [userId], (error, results) => {
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
      "SELECT task.*, user.name AS user_name, user.surname AS user_surname FROM task INNER JOIN user ON task.asignee_id = user.id WHERE task.manager_id = ?",
      [userId],
      (error, results) => {
        if (error) {
          return callback(error);
        }
        const tasks = results;
        return callback(null, tasks);
      }
    );
  } else if (userRole === "Developer") {
    db.query(
      "SELECT task.*, user.name AS user_name, user.surname AS user_surname FROM task INNER JOIN user ON task.manager_id = user.id WHERE task.asignee_id = ?",
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
  db.query("SELECT * FROM user WHERE role = 'developer'", (error, results) => {
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
  db.query(
    "INSERT INTO task SET ?",
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
        return res.redirect("/task");
      }
    }
  );
};

//PUT
exports.updateTaskStatus = (req, res) => {
  const taskId = req.params.id;
  const status = req.body.status;
  console.log(status);
  db.query(
    "UPDATE task SET status=? WHERE id=?",
    [status, taskId],
    (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).send("Error updating task");
      } else {
        return res.status(200).send("Task status was changed successfully");
      }
    }
  );
};

//DELETE
exports.deleteTask = (req, res) => {
  try {
    const taskId = req.params.id;
    db.query("DELETE FROM task WHERE id = ?", [taskId], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete task" });
      }
      const task = results[0];
      return res.status(200).json({ message: "Task deleted successfully" });
    });
  } catch (err) {
    console.log(err);
    return res.redirect("/task");
  }
};