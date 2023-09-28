# TypeScript OAuth 2.0 Client

An extensible [OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749), standard compliant client library for Node.js and the Web.
Also supports the [Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750) and [Token Introspection](https://datatracker.ietf.org/doc/html/rfc7662) standards.

## Basic usage

Start by creating and configuring your OAuth 2.0 client.
```typescript
import * as OAuth2 from 'oauth2-client-ts';

const client = new OAuth2.Client({
    credentials: new OAuth2.ClientCredentials('myClientId', 'myClientSecret'),
    tokenEndpoint: 'https://www.example.com/auth/token',
    authorizationEndpoint: 'https://www.example.com/auth/authorize',
});
```

You can then use one of the flows described in the [OAuth 2.0 standard](https://datatracker.ietf.org/doc/html/rfc6749).

### Resource Owner Password Credentials
```typescript
const flow = client.startResourceOwnerPasswordCredentialsFlow();
const token = await flow.getToken(new OAuth2.ResourceOwnerPasswordCredentialsGrant('myUsername', 'myPassword'), 'scope.read scope.write'); // Scope is optional.
```

### Client Credentials
```typescript
const flow = client.startClientCredentialsFlow();
const token = await flow.getToken('scope.read scope.write'); // Scope is optional.
```

### Refresh Token
```typescript
// Perform the "Refresh Token" OAuth 2.0 flow.
const flow = client.startRefreshTokenFlow();
const token = await flow.getToken(new OAuth2.RefreshTokenGrant('ey.myRefresh.token'), 'scope.read scope.write'); // Scope is optional.
```

## Bearer Token Usage

Import the [Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750) extension.

```typescript
import 'oauth2-client-ts/dist/extensions/bearer_token_usage';
```

You can then use the convenience functions on the `TokenCredentials` type.

```typescript
// Returns key-value pairs for an authorized JSON HTTP request body.
token.getBodyParameters();
// Returns key-value pairs for an HTTP request's query parameters.
token.getQueryParameters();
// Returns key-value pairs for an HTTP Authorization header.
token.getRequestHeaders();

...

const token = OAuth2.TokenCredentials.fromAuthorizationHeader('Bearer ey.received.token');
```

## Token Introspection

Import the [Token Introspection](https://datatracker.ietf.org/doc/html/rfc7662) extension.

```typescript
import 'oauth2-client-ts/dist/extensions/token_introspection';
```

When creating your OAuth 2.0 client, you can now specify the token introspection endpoint of the OAuth server.
```typescript
const client = new OAuth2.Client({
    ...
    introspectionEndpoint: 'https://www.example.com/auth/introspect',
});
```

Finally, introspect access or refresh tokens using your client directly.
```typescript
const result = await client.introspect(
    // The credentials used to authorize the introspection request:
    new OAuth2.TokenCredentials('my.authorization.token', 'Bearer'),
    'token.to.introspect'
);
```
