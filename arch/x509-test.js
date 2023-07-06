import * as jose from 'jose';
import { Certificate } from 'node:crypto';
import * as fs from 'node:fs/promises';

const pkcs  = await fs.readFile('../deployment-configs/services/authomator/zhaw-sustainability-dev-pkcs8.key');
const x509  = await fs.readFile('../deployment-configs/services/authomator/zhaw-sustainability-dev.crt');

console.log(`
    pkcs ${pkcs}
    x509 ${x509}
`)

// console.log(`pkcs type: ${typeof pkcs}`);

const jwkx509 = await jose.importX509(x509.toString(), "RS256");
const jwk = await jose.importPKCS8(pkcs.toString(), "RS256", { x5c: x509.toString() });

const jwkstr = await jose.exportJWK(jwk);
const jwkXstr = await jose.exportJWK(jwkx509);
// console.log(`jwk ${JSON.stringify(jwkstr, null, "  ")}`);
// console.log(`jwk ${JSON.stringify(jwkXstr, null, "  ")}`);

jwk.x5c = x509.toString();
const k = await jose.exportJWK(jwk);

console.log(k)

