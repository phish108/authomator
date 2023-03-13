import Issuer from "./githubIssuer.mjs";
import { generators } from "openid-client";

import {getLogger} from "service_logger";

const log = getLogger("targets/github");

export default async function GitHub(config) {
    const icon = `square-${config.icon}`;
    const name = config.name;

    const client_id = config.clientid;
    const client_secret = config.clientsecret;

    const issuer = await Issuer.discover(config.baseurl);

    const client = new issuer.Client({
        client_id,
        client_secret
    });

    log.debug({
        info: "create target",
        name,
        icon,
        client_id,
        url: config.baseurl
    });

    return {
        icon,
        name, 
        client,
        assertionPayload: () => ({}),
        state: generators.nonce,
        authOptions: (state) => {
            return {
                state
            };
        }
    };
 }

