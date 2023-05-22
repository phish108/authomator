import Crypto from "node:crypto";
import {getLogger} from "service_logger";

const log = getLogger("managers/sessions");
const sessions = new Map();
const maxTtl = 3600000; // 1h

export async function startSession(token, targetHandler) {
    const userInfo = await targetHandler.client.userinfo(token);

    if (userInfo) {
        const sessionid = Crypto.randomBytes(32).toString("base64url");

        // keep the session
        const ttl = Date.now() + maxTtl;

        sessions.set(sessionid, {userInfo, targetHandler, token, ttl});

        log.performance({
            info: "initiate internal session",
            user: userInfo.sub || userInfo.login
        });

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
        log.debug({info: "session expired, check if token is still valid", sessionid});

        try{
            const userInfo = await session.targetHandler.client.userinfo(session.token);

            if (!userInfo) {
                endSession(sessionid);
                return undefined;
            }
        }
        catch (err) {
            log.error({
                info: "failed to verify session", 
                sessionid, 
                token: session.token,
                error: err.message,                
            });
            return undefined;
        }

        session.ttl = now + maxTtl;
    }

    return session;
}

export async function endSession(sessionid) {
    const session = findSession(sessionid);

    if (!session) {
        log.debug("found no session to terminate");
        return;
    }

    try {
        log.debug({info: "access revocation endpoint", payload: session.targetHandler.assertionPayload("revocation_endpoint")});

        await session.targetHandler.client.revoke(
            session.token,
            "access_token",
            session.targetHandler.assertionPayload("revocation_endpoint")
        );
    }
    catch (err) {
        // This happens if aud_method is not or wrongly configured
        log.error({
            info: "revocation endpoint access rejected",
            error: err.message,
            extra: "try setting aud_method for the issuer",
            issuer: session.targetHandler.client.issuer.issuer,
            body: err.error,
            desc: err.error_description,
            status: err.status
        });

        log.error(err);
    }

    log.performance({
        info: "terminate internal session",
        user: session.userInfo.sub || session.userInfo.login
    });

    sessions.delete(sessionid);
}

// TODO a function that runs every now and then and verifies the access tokens with the handler
// if the token does not confirm the user anymore, drop the session.
