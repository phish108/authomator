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

    let { signal } = new AbortController();
    const cache = "no-store";

    returnValue.getAuthUrl = (state) => AuthUrl + state;

    returnValue.getAccessToken = async (code) => {
        let access_token = {};

        const method = "POST";

        // eslint-disable-next-line no-undef
        const headers = new Headers();
        // eslint-disable-next-line no-undef
        const body = new FormData();

        headers.set("Accept", "application/json");

        body.append("client_id", client_id);
        body.append("client_secret", client_secret);
        body.append("code", code);

        try {
            const response = await fetch(TokenUrl, {
                signal,
                method,
                headers,
                cache,
                body
            });

            const access_token = await response.json();

            console.log(`${JSON.stringify({
                module: __filename,
                message: "received accesstoken",
                extra: {
                    access_token
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

        return access_token;
    };

    returnValue.getUserInfo = async (token) => {
        let UserInfo = {}; // if the user info is empty, then the access token has expired and the user needs to reauthenticate

        // eslint-disable-next-line no-undef
        const headers = new Headers();

        headers.set("Accept", "application/json");
        headers.set("Authorization", `Bearer ${token}`);

        try {
            const response = await fetch(UserUrl, {
                signal,
                headers,
                cache
            });

            UserInfo = await response.json();
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
            const method = "DELETE";

            // eslint-disable-next-line no-undef
            const headers = new Headers();

            headers.set("Accept", "application/vnd.github+json");
            headers.set("Authorization", `Basic ${btoa(client_id + ":" + client_secret)}`);
            headers.set("Content-Type", "application/json");

            const body = JSON.stringify({
                access_token
            });

            const response = await fetch(RevokeUrl, {
                signal,
                cache,
                method,
                headers,
                body
            });

            const result = await response.json();

            console.log(`${JSON.stringify({
                module: __filename,
                message: "response from revocation request",
                extra: {
                    result
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
