const {authorizeSession} = require("./authorizesession.js");
const {checkSession} = require("./checksession.js");
const {displayEntrypoint} = require("./displayentrypoint");
const {errorHandler} = require("./errors");
const {forwardAuth} = require("./forwardauth.js");
const {handleCallback} = require("./handlecallback.js");
const {logHeader} = require("./logheader.js");
const {redirectToEntrypoint} = require("./redirectentrypoint.js");
const {terminateSession} = require("./terminatesession.js");

module.exports = {
    authorizeSession,
    checkSession,
    displayEntrypoint,
    errorHandler,
    forwardAuth,
    handleCallback,
    logHeader,
    redirectToEntrypoint,
    terminateSession,
};
