const express = require("express");
const {
  sendInvitation,
  rejectInvitation,
  acceptInvitation,
} = require("../controllers/invitationController");

const Router = express.Router();

Router.route("/").post(sendInvitation);
Router.route("/:id").delete(rejectInvitation).patch(acceptInvitation);

module.exports = Router;
