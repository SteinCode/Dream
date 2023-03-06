const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authController = require("./controllers/auth");
dotenv.config({ path: "./.env" });

const app = express();

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

//const publicDirectory = path.join(__dirname, "./frontend/static");

app.set("view engine", "hbs");

app.set("views", __dirname + "/views");

// pasiemam stilius ir views
app.use(
  "/static",
  express.static(path.resolve(__dirname, "frontend", "static"))
);
app.use("/media", express.static(path.resolve(__dirname, "frontend", "media")));

//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extend: true }));

//Parse JSON bodies (as sent by API clients)
app.use(express.json());

//naudojam cookie
app.use(cookieParser());

// prijungiam duomenu baze
db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Connected...");
  }
});

app.get("/", authController.home);
app.get("/logout", authController.logout);
app.get("/login", authController.renderLogin);

//Define routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));

//nusistatom porta
app.listen(process.env.PORT || 3000, () =>
  console.log("Dreamwork has started, the server is running on 3000 port")
);
