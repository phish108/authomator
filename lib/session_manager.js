const Crypto = require("node:crypto");

const sessions = new Map();

async function startSession(token, targetHanlder) {
    const userInfo = await targetHanlder.getUserInfo(token);

    if (userInfo !== undefined) {
        const sessionid = Crypto.randomBytes(32).toString("base64url");

        // keep the session
        sessions.set(sessionid, {userInfo, targetHanlder, token});

        return sessionid;
    }

    return undefined;
}

function findSession(sessionid) {
    if (sessions.has(sessionid)) {
        return sessions.get(sessionid);
    }
    return undefined;
}

// TODO a function that runs every now and then and verifies the access tokens with the handler
// if the token does not confirm the user anymore, drop the session.

exports = {
    startSession,
    findSession
};
