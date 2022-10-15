const superagent = require("superagent");

const keepUserFields = [
    "login",
    "id",
    "html_url",
    "type",
    "name",
    "email"
];

function GitHub(config) {
    const returnValue = {};

    const icon = config.icon;
    const name = config.name;

    const client_id = config.clientid;
    const client_secret = config.clientsecret;

    const AuthUrl = config.baseurl + `/login/oauth/authorize?client_id=${ client_id }&state=`;
    const TokenUrl = config.baseurl + "/login/oauth/access_token";
    const UserUrl = config.baseurl + "/api/v3/user";
    const RevokeUrl = config.baseurl + `/api/v3/applications/${client_id}/token`;

    returnValue.getAuthUrl = (state) => AuthUrl + state;

    returnValue.getAccessToken = async (code) => {
        let accessToken = {};

        try {
            const respose = await superagent
                .post(TokenUrl)
                .type("form")
                .send({
                    client_id,
                    client_secret,
                    code,
                });

            accessToken = respose.body;
            console.log(`${JSON.stringify({
                module: __filename,
                message: "received accesstoken",
                extra: {
                    accessToken
                }
            }, null, "  ")}`);
        }
        catch (error) {
            console.log(`${JSON.stringify({
                module: __filename, 
                message: "code did not provide access token",
                extra: {
                    error
                }
            }, null, "  ")}`);
        }

        return accessToken;
    };

    returnValue.getUserInfo = async (token) => {
        let UserInfo = {}; // if the user info is empty, then the access token has expired and the user needs to reauthenticate

        // const BearerHeader = "Bearer " + token;

        try {
            const respose = await superagent
                .get(UserUrl)
                .auth(token, {type: "bearer"})
                .set("accept", "json");

            UserInfo = respose.body;
        }
        catch (error) {
            console.log(`${JSON.stringify({module: __filename, message: "invalid access token", extra: {error}})}`);
        }

        // if  the user info has been received, we strip down some values
        Object.keys(UserInfo).forEach((field) => {
            if (!keepUserFields.includes(field)) { delete UserInfo[field]; }
        });

        return UserInfo;
    };

    returnValue.revokeToken = async (access_token) => {
        //const BearerHeader = `Bearer ${ access_token }`;

        console.log(`${JSON.stringify({
            module: __filename,
            message: "try to revoke token",
            extra: {
                access_token,
                RevokeUrl,
                client_id,
            }
        })}`);

        try {
            const response = await superagent
                .delete(RevokeUrl)
                .type("json")
                .auth(client_id, client_secret, {type: "basic" })
                .accept("application/vnd.github+json")
                .send({
                    access_token
                });

            console.log(`${JSON.stringify({
                module: __filename,
                message: "response from revocation request",
                extra: {
                    response
                }
            })}`);

            if (response.status === 204) {
                console.log(`${JSON.stringify({module: __filename, message: "token has been revoked"})}`);
            }
        }
        catch (error) {
            console.log(`${JSON.stringify({module: __filename, message: "token has not been revoked", extra: {error}})}`);
            return false;
        }

        return true;
    };

    returnValue.icon = () => icon;
    returnValue.name = () => name;

    return returnValue;
}

module.exports = {
    GitHub
};
