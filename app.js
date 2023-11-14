const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const hbs = require("hbs");
const hbsHelperFunctions = require("./hbsHelperFunctions");
// Defining routes
const loginRoute = require("./backend/routes/login");
const registerRoute = require("./backend/routes/register");
const dashboardRoute = require("./backend/routes/dashboard");
const profileRoute = require("./backend/routes/profile");
const projectRoute = require("./backend/routes/project");
const taskRoute = require("./backend/routes/task");
const userRoute = require("./backend/routes/user");

const app = express();

app.use(flash());
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "frontend", "static", "hbs"));

app.use(express.urlencoded({ extend: true }));
app.use(express.json());

app.use(cookieParser());

app.use(
  session({
    secret: "your secret",
    resave: false,
    saveUninitialized: true,
  })
);
hbs.registerHelper("formatDateAndTime", hbsHelperFunctions.formatDateAndTime);
hbs.registerHelper("eq", hbsHelperFunctions.eq);

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/", dashboardRoute);
app.use("/profile", profileRoute);
app.use("/project", projectRoute);
app.use("/task", taskRoute);
app.use("/user", userRoute);
app.use(
  "/media",
  express.static(path.join(__dirname, "frontend", "static", "media"))
);
app.use("/static", express.static(path.join(__dirname, "frontend", "static")));

module.exports = app;
