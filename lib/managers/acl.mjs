// import {getLogger} from "service-logger";

// const log = getLogger("managers/acl");
const acls = new Map();

export function setup(config) {
    config.forEach((user) => acls.set(user.login, user.scope));
}

export function findUserScope(login) {
    if (acls.has(login)) {
        return acls.get(login);
    }

    return undefined;
}

export function addUser(login) {
    if (!acls.has(login)) {
        acls.set(login, ""); // give a new user an empty scope
    }
}

export function addUserScope(login, scope) {
    if (acls.has(login)) {
        acls.set(login, scope);
    }
}

export function getUsers() {
    const returnValue = [];

    acls.forEach((scope, login) => returnValue.push({login, scope}));

    return returnValue;
}
