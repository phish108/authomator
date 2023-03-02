import Issuer from "./githubIssuer.mjs";
import { generators } from "openid-client";

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

    console.log(`create with ${name} and ${icon}`);

    return {
        icon,
        name, 
        client,
        state: generators.nonce,
        authOptions: (state) => {
            return {
                state
            };
        }
    };
 }

