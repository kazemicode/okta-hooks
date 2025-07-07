const express = require("express");
const app = express();
const http = require("http").Server(app);
const router = express.Router();
const request = require("request");
const util = require("util");
const helpers = require("../helpers.js");
const hookViewer = require("../hookViewer.js");

let payload;
let statusCode;
let commands;
let responseBody = {};
let error = null;
let contextMessage;
let debugContext;
let title;
let description;
let body;

/**
 *
 * Inline hook handler for registration with demoble scenarios determined by email domain
 *
 **/
router.post("/domain", function (req, res) {
  const payload = req.body;

  // Make sure we have a valid request payload
  if (!payload.data || !payload.data.userProfile) {
    // If the request payload is missing the user profile element, deny registration with a specific error
    commands = [
      {
        type: "com.okta.action.update",
        value: {
          registration: "DENY",
        },
      },
    ];
    error = {
      errorSummary: "Invalid request payload",
      errorCauses: [
        {
          errorSummary: "The request payload was not in the expected format",
          reason: "INVALID_PAYLOAD",
        },
      ],
    };
    contextMessage = {
      status: "Payload was missing event.body or event.body.data object",
    };
    // Format the debugContext element as a stringified JSON object so it could potentially be parsed by a SEIM tool later.
    debugContext = {
      contextMessage: JSON.stringify(contextMessage),
    };
    // compose the response to Okta, including any commands we want Okta to perform
    const responseBody = {
      commands,
      error,
      debugContext,
    };

    // Send this event to the Hook Viewer
    title = req.originalUrl;
    description = `Below is the <b>response</b> that our Hook handler will return to Okta:`;
    body = responseBody;

    hookViewer.emitViewerEvent(title, description, body, true);

    res.status(200).send(responseBody);
    return;
  }

  // Parse user email from request payload
  const userProfile = payload.data.userProfile;
  const emailAddress = userProfile.email;
  const emailName = emailAddress.substring(0, emailAddress.indexOf("@")); // email username
  const emailDomain = helpers.parseEmailDomain(emailAddress); // email domain
  const emailPrefix = emailDomain.substring(0, emailDomain.indexOf(".")); // email prefix (e.g., allow, deny, error)
  const parsedEmail = helpers.parseEmail(
    emailAddress,
    emailDomain,
    emailPrefix,
    emailName
  );

  title = req.originalUrl;
  description = `Below is the <b>request</b> that Okta sent to our Registration Hook`;
  body = payload;

  hookViewer.emitViewerEvent(title, description, body, false);

  // *** DEMO *** depending on the email domain provided in the registration form,
  // this API will perform different actions
  switch (emailPrefix) {
    case "allow":
      commands = [
        {
          type: "com.okta.user.profile.update",
          value: {
            email: parsedEmail,
          },
        },
      ];
      error = null;
      contextMessage = {
        statusMessage: "Registration succeeded.",
      };
      debugContext = {
        contextMessage: JSON.stringify(contextMessage),
      };
      statusCode = 200;
      break;

    default:
      commands = [
        {
          type: "com.okta.action.update",
          value: {
            registration: "DENY",
          },
        },
      ];
      error = {
        errorSummary: "Registration Denied",
        errorCauses: [
          {
            errorSummary:
              "Invalid email domain: " +
              emailDomain +
              " (message from inline hook)",
            reason: "INVALID_EMAIL_DOMAIN",
            locationType: "body",
            location: "email",
            domain: emailDomain,
          },
        ],
      };
      contextMessage = {
        status: "Registration Failed",
        reason: "Registration denied for invalid email domain: " + emailDomain,
      };
      debugContext = {
        contextMessage: JSON.stringify(contextMessage),
      };
      statusCode = 200;
  }

  // compose the response body
  let responseBody = {};

  // only include optional elements if they have values
  if (commands) responseBody.commands = commands;
  if (error) responseBody.error = error;
  if (debugContext) responseBody.debugContext = debugContext;

  title = req.originalUrl;
  description = `Below is the <b>response</b> that our Hook handler will return to Okta:`;
  body = responseBody;

  hookViewer.emitViewerEvent(title, description, body, true);

  res.status(statusCode).send(responseBody);
});

/**
 * Expose the API routes
 */
module.exports = router;
