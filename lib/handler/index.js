const {forwardAuth} = require("./forwardauth.js");
const {redirectToEntrypoint} = require("./redirectentrypoint.js");
const {checkSession} = require("./checksession.js");
const {displayEntrypoint} = require("./displayentrypoint");
const {handleCallback} = require("./handlecallback.js");
const {terminateSession} = require("./terminatesession.js");

module.exports = {
    forwardAuth,
    redirectToEntrypoint,
    checkSession,
    displayEntrypoint,
    handleCallback,
    terminateSession
};
