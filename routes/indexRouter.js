const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.post("/delete/:messageId", (req, res) => {
  console.log("delete message route");
  indexController.deleteMessage(req, res);
});

indexRouter.post("/new-message", (req, res) => {
  console.log("post new message route");
  indexController.postNewMessage(req, res);
});

indexRouter.get("/admin-register", (req, res) => {
  indexController.getAdminRegister(req, res);
});

indexRouter.post("/admin-register", (req, res) => {
  console.log("post admin register");
  indexController.postAdminRegister(req, res);
});

indexRouter.get("/member-register", (req, res) => {
  indexController.getMemberRegister(req, res);
});

indexRouter.post("/member-register", (req, res) => {
  indexController.postMemberRegister(req, res);
});

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
