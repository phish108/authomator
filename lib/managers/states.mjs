// import Crypto from "node:crypto";
import {getLogger} from "service-logger";

const log = getLogger("managers/states");
const maxttl = 600000; // 10 minutes time to live in milliseconds
const states = new Map(); // shared store

export function createState(target) {
    const randomstate = target.state();

    const ttl = Date.now() + maxttl;

    states.set(randomstate, {target, ttl});
    return randomstate;
}

export function checkState(statestring) {
    if(!states.has(statestring)) {
        log.critical("unknown session provided");
        return undefined;
    }

    const timeNow = Date.now();
    const stateObj = states.get(statestring);

    states.delete(statestring);

    if (stateObj.ttl < timeNow) {
        log.info("state has expired");
        return undefined;
    }

    return stateObj.target;
}

