import {Issuer, generators} from "openid-client";
import {getLogger} from "service-logger";

const log = getLogger("targets/oidc");

function getAudMethods(issuer) {
    return {
        single_issuer: () => ({clientAssertionPayload: {aud: issuer.issuer}}),
        single_token: () => ({clientAssertionPayload: {aud: issuer.token_endpoint}}),
        endpoint: (endpoint) => ({clientAssertionPayload: {aud: issuer[endpoint]}}),
        default: () => ({}) 
    };
}

export default async function OIDC(config, frontend) {
    const response_types = ["code"];
    const redirect_uris = [`${frontend.baseurl}${frontend.url}cb`];

    const name = config.name;
    const icon = config.icon;

    const issuer_url = config.baseurl;
    const client_id = config.clientid;
    const token_endpoint_auth_method = config.auth_method;
    const token_endpoint_auth_signing_alg = config.sign_alg;
    const revocation_endpoint_auth_method = config.auth_method;
    const revocation_endpoint_auth_signing_alg = config.sign_alg;
    const introspection_endpoint_auth_signing_alg = config.sign_alg;
    const request_object_signing_alg = config.sign_alg;

    // const client_secret = config.client_secret;

    // the config backend already loaded the key store. 
    const jwks = config.jwks;

    log.info({info: "discover issuer", issuer_url});
    const issuer = await Issuer.discover(issuer_url);
 
    if (!issuer) {
        log.critical({info: "no issuer discovered", issuer_url});
    }

    const client = new issuer.Client({
        client_id,
        token_endpoint_auth_method,
        token_endpoint_auth_signing_alg,
        revocation_endpoint_auth_method,
        revocation_endpoint_auth_signing_alg,
        introspection_endpoint_auth_signing_alg,
        request_object_signing_alg,
        redirect_uris,
        response_types
    }, jwks);

    const aud_methods = getAudMethods(issuer);

    let assertionPayload = aud_methods.default; 
    
    if ("aud_method" in config && config.auth_method.length) {
        log.debug({info: "aud_method is configured", aud_method: config.aud_method});
        assertionPayload =  aud_methods[config.auth_method] || aud_methods.default;
    }

    return {
        name,
        icon,
        client, 
        assertionPayload,
        state: generators.nonce,
        authOptions: (state) => {
            return {
                scope: "openid email profile",
                state
            };
        }
    };
};
