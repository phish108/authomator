import Issuer from "./githubIssuer.mjs";

const keepUserFields = [
    "login",
    "id",
    "html_url",
    "type",
    "name",
    "email"
];

export default async function GitHub(config) {
    const icon = `square-${config.icon}`;
    const name = config.name;

    const client_id = config.clientid;
    const client_secret = config.clientsecret;

    const issuer = await Issuer.discover(config.baseurl);

    const client = new issuer.Client(config);

    return {
        icon,
        name, 
        client
    };
 }
