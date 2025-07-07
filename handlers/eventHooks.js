const express = require("express");
const router = express.Router();
const app = express();
const request = require("request");
const http = require("http").Server(app);
const svr = require("../server.js");
const io = svr.io;
const helpers = require("../helpers.js");
const hookViewer = require("../hookViewer.js");

let title;
let description;
let body;
let responsePayload = {}; // currently not used by Okta in beta implementation

/**
 *
 *  For demo purposes, we're always registering handlers from this Glitch project, so that they show
 *   up in the live Hook viewer on index.html.
 *
 **/

// Use to listen to user profile update events
router.post("/user-profile/update", function (req, res) {
  let eventType;

  if (req.body.data.events) {
    eventType = req.body.data.events[0].eventType;
  }

  title = req.originalUrl;
  description = `<div class="logDescriptionText">Okta Event Hook handler called with event type: <b>${eventType}</b>.</div><div class="logHint">Here's the body of the <b>request</b> from Okta:</div>`;
  body = req.body;

  hookViewer.emitViewerEvent(title, description, body, true);

  res.status(204).send(responsePayload);
});

// GET verification endpoint
router.get("/user-profile/update", function (req, res) {
  helpers.logRequest(req);

  let verifyHeader = {};

  verifyHeader["verification"] = req.headers["x-okta-verification-challenge"];

  res.send(verifyHeader);
});

/**
 * Expose the API routes
 */
module.exports = router;
