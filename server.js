// init project
const express = require("express");
const app = express();
const http = require("http").Server(app);
http.listen(process.env.PORT);
const io = require("socket.io")(http);
const util = require("util");
const bodyParser = require("body-parser");

// define our hook command identifiers, as things may change during the beta
const hookCommandTypes = {
  idTokenPatch: "com.okta.identity.patch",
  accessTokenPatch: "com.okta.access.patch",
  samlAssertionPatch: "com.okta.tokens.assertion.patch",
};

module.exports = {
  io: io,
  hookCommandTypes: hookCommandTypes,
};

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(bodyParser.json());

// Define our API routes
const registrationHooks = require("./handlers/registrationHooks");
const eventHooks = require("./handlers/eventHooks");
const oktaUtils = require("./oktaUtils");

app.use("/okta/hooks/registration", registrationHooks);
app.use("/okta/hooks/event", eventHooks);
app.use("/demo/utils", oktaUtils);

// Set up socket.io for real-time logging
io.on("connection", function (socket) {
  console.log("Client connection received");

  const connectionMessage = {
    "Logger Status": "connected!",
  };

  // emit a startup message when the socket connects
  //socket.emit('logMessage', { 'logMessage': 'Logger connected!' });

  // Not used
  socket.on("receivedFromClient", function (data) {
    console.log(data);
  });
});

// Bind prefix to log levels to make it easier to read the logs
console.log = console.log.bind(null, "[LOG]");
console.info = console.info.bind(null, "[INFO]");
console.warn = console.warn.bind(null, "[WARN]");
console.error = console.error.bind(null, "[ERROR]");

// Routes --------------------------------------------
// http://expressjs.com/en/starter/basic-routing.html

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/readme", function (request, response) {
  response.sendFile(__dirname + "/README.md");
});

// Listen for requests ------------------------------------- :)
/*
http.listen(process.env.PORT, function(){
    console.log('HTTP server started on port ' + process.env.PORT);
});
*/
/*
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
*/
