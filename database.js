const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Connected...");
  }
});

// module.exports = db;

const getUser = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE id = 2", (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
};

module.exports = { db, getUser };