const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require('./config/documentation/swagger.json');

const cors = require("cors");
//var logger = require('morgan');

const indexRouter = require("./routes/index");
const versionRoutes = require("./routes/versionRoutes");
const adminRoutes = require("./routes/adminRoutes");
var usersRouter = require("./routes/userRoutes");
var adminAchivementRouter = require("./routes/adminAchivementRoutes");
const notificationRoutes= require("./routes/notificationRoutes");
const categoryRoutes= require("./routes/catergoryRoutes");
const adminAchievementLevelRoutes= require("./routes/adminAchievementLevelRoutes");
const reportedBugRoutes= require("./routes/reportedBugRoutes");
const reportedContentRoutes= require("./routes/reportedContentRoutes");
const socialRoutes= require("./routes/socialAccountRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const calenderRoutes = require("./routes/calenderRoutes");
const app = express();

//app.use(logger());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use('/public', express.static("public"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(cors());

//Sequelize connection
require("./dbConnection").connectDB();
require("./models");





//routes
app.use("/", indexRouter);
app.use("/app", versionRoutes);
app.use("/user", usersRouter);
app.use("/admin", adminRoutes);
app.use("/notification", notificationRoutes);
app.use("/admin-achievements", adminAchivementRouter);
app.use("/category", categoryRoutes);
app.use("/achivementlevel", adminAchievementLevelRoutes);
app.use("/reported-bugs", reportedBugRoutes);
app.use("/reported-content", reportedContentRoutes);
app.use("/social", socialRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/calender", calenderRoutes);
//catch 404 and forward to error handler
app.use(function (req, res, next) {
  next();
});

// error handler
app.use(function (err, req, res) {
  
// set locals, only providing error in development
res.locals.message = err.message;
res.locals.error = req.app.get("env") === "development" ? err : {};

// render the error page
res.status(err.status || 500);
res.render("error");
});

module.exports = app;
