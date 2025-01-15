const { Router } = require("express");
const indexController = require("../controllers/indexController");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
  indexController.index(req, res);
});

module.exports = indexRouter;
