const acls = new Map();

function setup(config) {
    config.forEach((user) => acls.set(user.login, user.scope));
}

function findUserScope(login) {

    if (acls.has(login)) {
        return acls.get(login);
    }

    return undefined;
}

function addUser(login) {
    if (!acls.has(login)) {
        acls.set(login, ""); // give a new user an empty scope
    }
}

function addUserScope(login, scope) {
    if (acls.has(login)) {
        acls.set(login, scope);
    }
}

function getUsers() {
    const returnValue = [];

    acls.forEach((scope, login) => returnValue.push({login, scope}));

    return returnValue;
}

module.exports = {
    setup,
    findUserScope,
    addUser,
    addUserScope,
    getUsers
};
