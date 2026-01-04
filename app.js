const dotenv = require("dotenv");
const createError = require("http-errors");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

/* =======================
   ROUTE IMPORTS
   ======================= */
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const listRouter = require("./routes/list");
const filesRouter = require("./routes/files");        // GridFS API
const apiIssuesRouter = require("./routes/apiIssues"); // ✅ JSON API for React

dotenv.config();

const app = express();

/* =======================
   CORS CONFIG
   ======================= */
app.use(
  cors({
    origin: "http://localhost:3001", // React frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

/* =======================
   MIDDLEWARE
   ======================= */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger("dev"));

/* =======================
   VIEW ENGINE (PUG)
   ======================= */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

/* =======================
   STATIC FILES
   ======================= */
app.use(express.static(path.join(__dirname, "public")));

/* =======================
   ROUTES
   ======================= */

// HTML (Backend UI)
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/list", listRouter);

// JSON APIs (for React)
app.use("/api/files", filesRouter);   // PDF streaming
app.use("/api", apiIssuesRouter);     // ✅ /api/issues

/* =======================
   TEST API
   ======================= */
app.get("/api/test", (req, res) => {
  res.json({ status: "backend working" });
});

/* =======================
   404 HANDLER (LAST)
   ======================= */
app.use(function (req, res, next) {
  next(createError(404));
});

/* =======================
   ERROR HANDLER
   ======================= */
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;


