import {Issuer, generators} from "openid-client";

async function OIDC(config) {
    const issuer_name = config.name;
    const issuer_icon = config.icon;

    const issuer_url = config.baseurl;
    const client_id = config.clientid;
    const token_endpoint_auth_method = config.auth_method;
    const token_endpoint_auth_signing_alg = config.sign_alg;
    const jwks_file = config.jwks;
    const client_secret = config.client_secret;

    // the config backend already loaded the key store. 
    const jwks = config.jwks;

    const issuer = await Issuer.discover(issuer_url);
 



};
