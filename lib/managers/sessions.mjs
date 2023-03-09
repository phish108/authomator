import Crypto from "node:crypto";

const sessions = new Map();
const maxTtl = 3600000; // 1h

export async function startSession(token, targetHanlder) {
    const userInfo = await targetHanlder.client.userinfo(token);

    if (userInfo) {
        const sessionid = Crypto.randomBytes(32).toString("base64url");

        // keep the session
        const ttl = Date.now() + maxTtl; 
        sessions.set(sessionid, {userInfo, targetHanlder, token, ttl});

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
    const now = Date.now();

    if (session && session.ttl < now) {
        const userInfo = await session.targetHanlder.client.userinfo(session.token);

        if (!userInfo) {
            endSession(sessionid);
            return undefined;
        }

        session.ttl = now + maxTtl; 
    }

    return session;
}

export async function endSession(sessionid) {
    const session = findSession(sessionid);

    if (session) {
        try {
            await session.targetHanlder.client.revoke(
                session.token, 
                "access_token",
                {
                    clientAssertionPayload: {
                        aud: session.targetHanlder.client.issuer.issuer
                    } 
                }
            );
        }
        catch (err) {
            // due to eduids misimplemented revoke endpoint
            console.log(err.message);
        }

        console.log(`terminate session for ${session.userInfo.sub}`);
        sessions.delete(sessionid);
    }
}

// TODO a function that runs every now and then and verifies the access tokens with the handler
// if the token does not confirm the user anymore, drop the session.
