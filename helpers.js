const util = require("util");

let methods = {};

// log entire request
methods.logRequest = function (req) {
  console.log(
    `>>> request headers <<<\n`,
    util.inspect(req.headers, {
      showHidden: false,
      depth: null,
      colors: true,
      compact: false,
    })
  );
  console.log(
    `>>> request query string <<<\n`,
    util.inspect(req.query, {
      showHidden: false,
      depth: null,
      colors: true,
      compact: false,
    })
  );
  console.log(
    `>>> request body <<<\n`,
    util.inspect(req.body, {
      showHidden: false,
      depth: null,
      colors: true,
      compact: false,
    })
  );
};

// log just the request body
methods.logBody = function (req) {
  console.log(
    `>>> request body <<<\n`,
    util.inspect(req.body, {
      showHidden: false,
      depth: null,
      colors: true,
      compact: false,
    })
  );

  return req.body;
};

// parse event hook request payload
methods.logEventHookRequest = function (req) {
  req.body["events"].forEach(function (event) {
    console.log(
      `displayMessage:\n`,
      util.inspect(event.displayMessage, {
        showHidden: false,
        depth: null,
        colors: true,
        compact: false,
      })
    );
    console.log(
      `actor:\n`,
      util.inspect(event.actor, {
        showHidden: false,
        depth: null,
        colors: true,
        compact: false,
      })
    );
    console.log(
      `target:\n`,
      util.inspect(event.target, {
        showHidden: false,
        depth: null,
        colors: true,
        compact: false,
      })
    );
    console.log(
      `outcome:\n`,
      util.inspect(event.outcome, {
        showHidden: false,
        depth: null,
        colors: true,
        compact: false,
      })
    );
  });
};

/**
 * Parses the domain from an email address
 * @param {string} emailAddress - An RFC5322 email address (i.e. "user.name@example.com")
 * @return {string} - A domain (i.e. "example.com")
 */
methods.parseEmailDomain = function (emailAddress) {
  return emailAddress.slice(emailAddress.indexOf("@") + 1);
};

// For the demo, we're expecting email domains like allow.actualdomain.com. We're going to
//   grap the first part of the domain, 'allow', and check that against our test cases. If
//   there's a match, we'll perform that demo use case. If the demo use case allows registration
//   to continue, we'll keep the prefix.actualdomain as the login name, but update the email
//   attribute of the user's profile to be emailname@actualdomain so that they will receive emails
//   from Okta correctly.

methods.parseEmail = function (
  emailAddress,
  emailDomain,
  emailPrefix,
  emailName
) {
  let parsedEmail;
  let periods = (emailDomain.match(/\./g) || []).length;
  console.log(`domain: ${emailDomain} periods: ${periods}`);

  if (periods > 1) {
    parsedEmail =
      emailName +
      "@" +
      emailDomain.substring(emailPrefix.length + 1, emailDomain.length);
  } else {
    parsedEmail = emailAddress;
  }

  console.log(`emailPrefix: ${emailPrefix}`);
  console.log(`parsedEmail: ${parsedEmail}`);
  return parsedEmail;
};

/**
 *
 * Expose methods
 *
 **/
module.exports = methods;
