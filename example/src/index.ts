import * as OAuth2 from 'oauth2-client-ts';
import 'oauth2-client-ts/dist/extensions/bearer_token_usage';
import 'oauth2-client-ts/dist/extensions/token_introspection';

(async () => {
  const client = new OAuth2.Client({
    credentials: new OAuth2.ClientCredentials('myClientId', 'myClientSecret'),
    tokenEndpoint: 'https://www.example.com/auth/token',
    authorizationEndpoint: 'https://www.example.com/auth/authorize',
    introspectionEndpoint: 'https://www.example.com/auth/introspect',
  });

  {
    const flow = client.startResourceOwnerPasswordCredentialsFlow();
    const token = await flow.getToken(new OAuth2.ResourceOwnerPasswordCredentialsGrant('myUsername', 'myPassword'), 'scope.read scope.write');

    token.getBodyParameters();
    token.getQueryParameters();
    token.getRequestHeaders();

    const decodedToken = OAuth2.TokenCredentials.fromAuthorizationHeader('Bearer received.token');
  }

  {
    const flow = client.startClientCredentialsFlow();
    const token = await flow.getToken('scope.read scope.write');
  }

  {
    const flow = client.startRefreshTokenFlow();
    const token = await flow.getToken(new OAuth2.RefreshTokenGrant('ey.myRefresh.token'), 'scope.read scope.write');
  }

  console.log(await client.introspect(new OAuth2.TokenCredentials('pip', 'Bearer'), 'my.access.token'));
})().catch(console.error);
