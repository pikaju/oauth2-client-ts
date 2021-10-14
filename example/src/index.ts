import * as OAuth2 from 'oauth2-client-ts';
import 'oauth2-client-ts/dist/extensions/token_introspection';

(async () => {
  const client = new OAuth2.Client({
    credentials: new OAuth2.ClientCredentials('kek'),
    tokenEndpoint: 'https://www.example.com/auth/token',
    authorizationEndpoint: 'https://www.example.com/auth/authorize',
    introspectionEndpoint: 'https://www.example.com/auth/introspect',
  });

  const flow = client.startResourceOwnerPasswordCredentialsFlow();
  const token = await flow.getToken(new OAuth2.ResourceOwnerPasswordCredentialsGrant('kek', 'pip'));

  console.log(await client.introspect(new OAuth2.TokenCredentials('pip', 'Bearer'), token.accessToken));
})().catch(console.error);
