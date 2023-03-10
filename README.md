# authomator
 
Little authentication helper for the caddy server

Authomator consists of two core components: 

1. The authentication service.
2. The authorization checker. 

The entire system is designed to be located behind a caddy proxy server. The authentication service needs to be setup to listen to a location. 

```
someserver.foo.bar:443 {
    # ...

    reverse_proxy /auth/* authserver:80

    forward_auth /protected/* {
        uri authserver:8081
        copy_headers Remote-User Remote-Name Remote-Authorizations
    }

    forward_auth /api/* {
        uri authserver:8081
        copy_headers Remote-User Remote-Name Remote-Authorizations
    }

    handle_path /api/* {
        # ...
    }

    handle_path /protected/* {
        # ...
    }

    
``` 

## Endpoints 

### auth_server

The auth server has currently 4 endpoints: 

- `/` - displays the login screen with the configured authorization options. If a user is already authenticated, it will forward the user to the designated target URL.
- `/preauth` - sets up the actual authentication request with the remote party
- `/logout` - deletes the current user session 
- `/cb` - redirection endpoint for the service

## check_server 

The check server consists of a single endpoint that is used 

## Authomator Configuration

Authomator has three main sections: 

- `frontend` - configuration of the front facing Interfaces
- `checker` - configuration of the session checker endpoint
- `targets` - base line configuration for the issuer endpoints
- `user` - base line configuration for admin users

### Frontend options 

- `baseurl` - The base url of the client to be registered with issuers.
- `url` -  The path of the front end functions as used by the reverse proxy.
- `port` - The internal port of the front end. MUST match with the configuration of the reverse proxy. (**Default**: 8080) 
- `success-target` - pointer to automatically forward a user to the appropriate location after successfull authentication.

**Deprecation note:** 

- `port` will be fixed to 80 for the sake of easier configuration. 
- `success-target` will be resolved based on the user scope.

### Checker options

- `url` - The path to the frontend. This is used, if the requested resource is not available to the user.
- `port` - port the reverse proxy needs to use for header checks. (**Default** 8081)

**Deprecation note:** 

The entire section will be integrated with the frontend. `port` will be fixed to `8081`.

### Targets Configuration

The targets configuration defines the issuer endpoints and their specialities.

Each issuer is uniquely identified by its internal name. 

The following options are available per issuer.

- `name` - Display Name of the Issuer on the login page.
- `icon` - Icon to use on the login page.
- `type` - The type of the issuer, currently supported: `github` and `oidc`. 
- `baseurl` - Baseurl of the issuer. This MUST be the URL used for client identification.
- `clientid` - the client id of *authomator* as registered with the issuer. 
- `clientsecret` - the mutual client secret as registered with the issuer. 
- `auth_method` - the authentication method used by the client. Supported values are `client_secret_basic`, `client_secret_post`, `private_key_jwt`, `client_secret_jwt`. Github supports only `client_secret_basic`. For OpenID Connect `private_key_jwt` is recommended. 
- `sign_alg` - the signing algorithm for JWT.
- `jwks` - jwks or jwks reference to the private keys used by JWT auth-methods. It is recommended use a file reference for the private keys. 
- `aud_method` - option to workaround issuer specific implementatons for jwt authentication. Supported options are `single_issuer`, `single_token`, and `endpoint`. `single_issuer` uses the issuer url as the single jwt audience, which is required by Microsoft Active Directory. `single_token` uses the token endpoint as the single jwt audience. `endpoint` uses the endpoint of the current request instead of the token_endpoint url as audience. 

### user Configuration 

The user configuration consists of a list of users and their access scope.

The reverse proxy sets the scope header. The scope is a simple string. The checker component uses the scope, to decide on allowing access to the path. 

Each user is defined by 
- `login` - a username or email address. 
- `scope` - the scope or list of scopes of a user. 

##  Configuration of a reverse proxy 

An example configuration is provided in [demo/config.yaml]. 

The service can get customised via a special configuration that is located at `/etc/authomator/config.yaml`

[https://caddyserver.com/docs/caddyfile/directives/forward_auth]

## Development

For external services I use [ngrok](https://ngrok.io) to expose the development tool chain to real domains.

The development toolchain consists of the reverse proxy and a protected ressource container as well as the autho service. In order to keep everybody happy, the reverse proxy is running all the time during development. 

```
> docker compose -f demo/proxy.yaml up -d --remove-orphans # send to background
> docker compose -f demo/compose.yaml up --build           # adding --remove orphans here kills the reverse proxy
```

In a second Terminal start `ngrok`

```
> ngrok http 8080
```

The first stack runs in the background as we are hardly concerned with its logs. 

The second component is interactively running, so we can see the logs from authomator.

When the development session is complete, run the following steps:

1. Terminate `ngrok` with `^C`.
2. Terminate `authomator` with `^C`
3. Terminate the reverse proxy with `docker compose -f demo/proxy.yaml down`

