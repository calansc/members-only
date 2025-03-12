const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.post("/log-in", (req, res) => {
  indexController.login(req, res);
});

indexRouter.get("/login-success", (req, res) => {
  indexController.redirectIndex(req, res);
});

indexRouter.get("/login-failure", (req, res) => {
  indexController.loginFailure(req, res);
});

indexRouter.get("/log-out", (req, res) => {
  indexController.logout(req, res);
});

indexRouter.post("/sign-up", (req, res) => {
  indexController.postSignUp(req, res);
});

indexRouter.get("/sign-up", (req, res) => {
  indexController.signUp(req, res);
});

indexRouter.get("/", (req, res) => {
  indexController.index(req, res);
});

module.exports = indexRouter;
