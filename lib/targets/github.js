const superagent = require('superagent');

function GitHub(config) {
    const returnValue = {};

    const icon = config.icon;
    const name = config.name;

    const client_id = config.clientid;
    const client_secret = config.clientsecret;

    const AuthUrl = config.baseurl.concat("/login/oauth/authorize?client_id=", client_id, "&state=");
    const TokenUrl = config.baseurl + "/login/oauth/access_token";
    const UserUrl = config.baseurl + "/api/v3/user";

    returnValue.getAuthUrl = (state) => AuthUrl + state;

    returnValue.getAccessToken = async (code) => {
        let accessToken = {};

        try {
            const respose = await superagent
                .post(TokenUrl)
                .send({
                    client_id,
                    client_secret,
                    code
                })
                .set("accept", "json");

            accessToken = respose.body;
        }
        catch (error) {
            console.log(`${JSON.stringify({module: __filename, message: "code did not provide access token", extra: {error}})}`);
        }

        return accessToken;
    };

    returnValue.getUserInfo = async (token) => {
        let UserInfo = {}; // if the user info is empty, then the access token has expired and the user needs to reauthenticate
        const BearerHeader = "Bearer " + token;

        try {
            const respose = await superagent
                .get(UserUrl)
                .set("Authorization", BearerHeader)
                .set("accept", "json");

            UserInfo = respose.body;
        }
        catch (error) {
            console.log(`${JSON.stringify({module: __filename, message: "invalid access token", extra: {error}})}`);
        }

        return UserInfo;
    };

    returnValue.icon = () => icon;
    returnValue.name = () => name;

    return returnValue;
}

exports.GitHub = GitHub;s