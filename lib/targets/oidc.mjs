import {Issuer, generators} from "openid-client";

async function loadJWKS(filename) {

}

async function OIDC(config) {
    const issuer_name = config.name;
    const issuer_icon = config.icon;

    const issuer_url = config.baseurl;
    const client_id = config.clientid;
    const token_endpoint_auth_method = config.auth_method;
    const jwks_file = config.jwks;
    const client_secret = config.client_secret;


    const jwks = await loadJWKS(jwks_file);
    const issuer = await Issuer.discover(issuer_url);
 


};

module.exports = {
    OIDC
};