const cache = "no-store";

export default class Issuer {
    #AuthUrl =  "/login/oauth/authorize";
    #TokenUrl = "/login/oauth/access_token";
    #UserUrl = "/api/v3/user";
    #AppUrl = "/api/v3/application";

    #url = "https://github.com";

    constructor(url) {
        this.#url = url;
        this.Client = getClient(this);
    }

    static async discover(url) {
        if (!(url && url.length)) {
            throw new URIError("empty URI provided");
        }

        // check whether the URL is a GH instance
        const gh = url instanceof URL ? url : new URL(url)
        const api = (gh.host === "github.com" || gh.host === "www.github.com") ? `api.${gh.host.replace("www.", "")}/meta` : `${gh.origin}/api/v3/meta`;
     
        const response = await fetch(api);

        if (response.status === 404) {
            throw new Error("URL is no github instance");
        }

        return new this(url);
    }

    get authUrl() {
        return new URL(this.#url + this.#AuthUrl);
    }

    get tokenUrl() {
        return new URL(this.#url + this.#TokenUrl);
    }

    get userUrl() {
        return new URL(this.#url+this.#UserUrl);
    }

    get applicationUrl() {
        return new URL(this.#url+this.#AppUrl);
    }
}

function getClient(issuer) {
    return class Client extends GHOAuthClient {
        constructor(...args) {
            super(issuer, ...args);
        }
    }
}

class GHOAuthClient {
    client_id;
    #client_secret; 
    issuer; 

    constructor(issuer, config) {
        this.issuer = issuer;
        this.client_id = config.clientid;
        this.#client_secret = config.clientsecret;
    }

    authorizationUrl(options) {
        const url = this.issuer.authUrl;

        url.searchParams.append("client_id", this.client_id);
        url.searchParams.append("state", options.state);

        return url.href;
    }

    callbackParams(req) {
        if (!("code" in req.query)) {
            throw Error("no code provided");
        }

        if (!("state" in req.query)) {
            throw Error("no state provided");
        }

        return {
            code: req.query.code,
            state: req.query.state
        };
    }

    /**
     * Fetches the access_token from GitHub
     * 
     * @param {*} unused_url - unused, present to comply with the openid_client-API 
     * @param {*} params - the request parameters from the incoming request
     * @returns a tokenset object
     */
    async callback(unused_url, params) {
        let tokenset = {};

        const method = "POST";
        const { signal } = new AbortController();

        const headers = new Headers();
        const body = new FormData();

        headers.set("Accept", "application/json");

        body.append("client_id", this.client_id);
        body.append("client_secret", this.#client_secret);
        body.append("code", params.code);

        const response = await fetch(this.issuer.tokenUrl, {
            signal,
            method,
            headers,
            cache,
            body
        });

        if (response.status !== 200) {
            throw new Error(`server responded with error code ${response.status}`);
        }

        tokenset = await response.json();

        return tokenset;
    }

    async userinfo(access_token) {
        let UserInfo = {};

        const { signal } = new AbortController();
        const headers = new Headers();

        headers.set("Accept", "application/json");
        headers.set("Authorization", `Bearer ${access_token}`);

        const response = await fetch(UserUrl, {
            signal,
            headers,
            cache
        });

        if (response.status !== 200) {
            return { expired: () => true };
        }

        const userInfo = await response.json();

        return {
            expired: () => false,
            claims: () => userInfo
        };
    }

    async refresh(refresh_token) {
        throw new Error("refresh is not implemented on GitHub");
    }

    async revoke(access_token) {
        const method = "DELETE";

        const { signal } = new AbortController();
        const headers = new Headers();

        headers.set("Accept", "application/vnd.github+json");
        headers.set("Authorization", `Basic ${Buffer.from(client_id + ":" + client_secret).toString("base64")}`);
        headers.set("Content-Type", "application/json");

        const body = JSON.stringify({
            access_token
        });

        const RevokeUrl = [
            this.issuer.applicationUrl.href, 
            this.client_id, 
            "token"
        ].join("/");

        const response = await fetch(RevokeUrl, {
            signal,
            cache,
            method,
            headers,
            body
        });

        const result = await response.json();
    }
}
