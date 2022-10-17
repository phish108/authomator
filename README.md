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

## Configuration 

An example configuration is provided in [demo/config.yaml]. 

The service can get customised via a special configuration that is located at `/etc/authomator/config.yaml`


[https://caddyserver.com/docs/caddyfile/directives/forward_auth]