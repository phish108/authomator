import Crypto from "node:crypto";

const maxttl = 600000; // 10 minutes time to live in milliseconds
const states = new Map(); // shared store

export function createState(target) {
    const randomstate = Crypto.randomBytes(25).toString("base64url");

    const ttl = Date.now() + maxttl;

    states.set(randomstate, {target, ttl});
    return randomstate;
}

export function checkState(statestring) {
    if(!states.has(statestring)) {
        return undefined;
    }

    const timeNow = Date.now();
    const stateObj = states.get(statestring);

    states.delete(statestring);

    if (stateObj.ttl < timeNow) {
        return undefined;
    }

    return stateObj.target;
}

