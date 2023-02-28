import Crypto from "node:crypto";

const sessions = new Map();

export async function startSession(token, targetHanlder) {
    const userInfo = await targetHanlder.getUserInfo(token);

    if (userInfo !== undefined) {
        const sessionid = Crypto.randomBytes(32).toString("base64url");

        // keep the session
        sessions.set(sessionid, {userInfo, targetHanlder, token});

        return sessionid;
    }

    return undefined;
}

export function findSession(sessionid) {
    if (sessions.has(sessionid)) {
        return sessions.get(sessionid);
    }
    return undefined;
}

// this will check if the session has not been terminated
export async function verifySession(sessionid) {
    const session = findSession(sessionid);

    if (session) {
        const userInfo = await session.targetHanlder.getUserInfo(session.token);

        if (!userInfo) {
            endSession(sessionid);
            return undefined;
        }
    }

    return session;
}

export async function endSession(sessionid) {
    const session = findSession(sessionid);

    if (session) {
        await session.targetHanlder.revokeToken(session.token);
        sessions.delete(sessionid);
    }
}

// TODO a function that runs every now and then and verifies the access tokens with the handler
// if the token does not confirm the user anymore, drop the session.
