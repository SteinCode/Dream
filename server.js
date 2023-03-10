const PORT = 3000;
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const cookieParser = require("cookie-parser");
const hbs = require("hbs");
const app = express();
const flash = require("connect-flash");
const session = require("express-session");
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});
const root = __dirname; //__dirname visada yra ta direktorija kur yra jis pats iskviestas siuo atveju __dirname yra ten kur server.js failas
const backendDir = path.join(root, "backend");
const frontendDir = path.join(root, "frontend");
const staticDir = path.join(frontendDir, "static");
const routesDir = path.join(backendDir, "routes");

//Define routes
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.set("view engine", "hbs");
app.set("views", path.join(staticDir, "hbs"));

//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extend: true }));

//Parse JSON bodies (as sent by API clients)
app.use(express.json());

//naudojam cookie
app.use(cookieParser());

app.use(
  session({
    secret: "your secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());

// prijungiam duomenu baze
db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Connected...");
  }
});
module.exports = {
  db: db,
};

app.use("/login", require(path.join(routesDir, "login")));
app.use("/register", require(path.join(routesDir, "register")));
app.use("/", require(path.join(routesDir, "dashboard")));
app.use("/profile", require(path.join(routesDir, "profile")));

app.use("/media", express.static(path.join(staticDir, "media")));
app.use("/static", express.static(staticDir));

//nusistatom porta
app.listen(process.env.PORT || PORT, () =>
  console.log("Dreamwork has started, the server is running on 3000 port")
);
