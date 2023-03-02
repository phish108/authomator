import {Issuer, generators} from "openid-client";

export default async function OIDC(config) {
    const response_types = ["code"];
    const redirect_uris = ["https://e5bd-178-83-154-110.eu.ngrok.io/"];

    const name = config.name;
    const icon = config.icon;

    const issuer_url = config.baseurl;
    const client_id = config.clientid;
    const token_endpoint_auth_method = config.auth_method;
    const token_endpoint_auth_signing_alg = config.sign_alg;
    // const client_secret = config.client_secret;

    // the config backend already loaded the key store. 
    const jwks = config.jwks;

    const issuer = await Issuer.discover(issuer_url);
 
    const client = new issuer.Client({
        client_id,
        token_endpoint_auth_method,
        token_endpoint_auth_signing_alg,
        redirect_uris,
        response_types
    }, jwks);

    return {
        name,
        icon,
        client, 
        state: generators.nonce,
        authOptions: (nonce) => {
            return {
                scope: "openid email profile",
                nonce
            };
        }
    };
};
