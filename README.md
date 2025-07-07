# Okta Hooks Demo
[![Netlify Status](https://api.netlify.com/api/v1/badges/59c601fe-7220-4af6-8fa8-e82832f1c0db/deploy-status)](https://app.netlify.com/projects/es-okta-hooks/deploys)
[https://es-okta-hooks.netlify.app/](https://es-okta-hooks.netlify.app/)

## About

This application serves sample endpoints for [Okta Hooks](https://developer.okta.com/docs/reference/hooks/). It is designed to handle the currently supported Okta Hooks,
and includes some use cases for the Registration Inline Hook, API Access Management Token Inline Hook, and SAML Token Inline Hook. For the purposes of our Customer Identity for Devs lab, we only use the Registration Inline Hook.

The `index.html` page of this project includes a real-time Hook Viewer feature that will capture the requests coming from Okta to the Hook handlers in this project, as well as the Hook handlers' responses back to Okta.
The Hook Viwer will display the JSON payload in a nice formatted fashion with some explanatory text and a timestamp. Click on the `Show Live` button at the top left of this page to view the `index.html` page served up by Glitch.
As Hooks are triggered in Okta, the Hook Viewer (which uses `socket.io` and `JQuery`) will automatically update to display the request and response. This is a great way to observe what's happening external to Okta.

## Registration Inline Hook

The script located in `handlers/registrationHooks.js` acts as an external service that Okta calls to during the self-service registration process. It's meant to demonstrate how you can use an external service to validate emails based on allowed domains.
This script contains logic that uses the email domain to determine which response payload it will return to Okta. This response payload tells Okta which action to perform (ALLOW or DENY a registration).

To use this inline hook, you must have configured and activated an inline hook in your Okta org's Workflows section, with the following details:

- URL: `<netlify-baseurl>/okta/hooks/registration/domain`
- Authentication key: `x-api-key`
- Authentication secret: `NOTUSED` (this is just a placeholder value for demo purposes)

Once configured, you can attempt to register as a new user for one of the applications the Profile Enrollment Policy applies to. You can use the following email suffix formats (where `example.com` is the domain of your email provider) to observe how Okta responds:

- **allow.example.com** - Registration will be allowed, and the response to Okta will include a debugContext message.

- **any other domain** - The response to Okta will include a command to deny the registration, an error object that will be displayed in the Sign-In widget, and a debugContext message.

## Event Hooks (handlers/eventHooks.js)

The handler located in `handlers/eventHooks.js` covers events related to `user.account.update`

To use this inline hook, you must have configured and activated an event hook in your Okta org's Workflows section, with the following details:

- URL: `<netlify-baseurl>/okta/hooks/event/user-account/update`


## Your Project

On the front-end,

- edit `public/client.js`, `public/style.css` and `views/index.html`
- drag in `assets`, like images or music, to add them to your project

On the back-end,

- your app starts at `server.js`
- add frameworks and packages in `package.json`
- safely store app secrets in `.env` (nobody can see this but you and people you invite)

