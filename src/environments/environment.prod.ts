export const environment = {
  production: true,
  clientId: 'novax@angular',
  apiUrl: 'https://api.acquamania.com.br',
  oauthUrl: 'https://api.acquamania.com.br/oauth2',
  authProxyUrl: '/api/auth',

  tokenDisallowedRoutes: [new RegExp('/api/auth/token'), new RegExp('/api/auth/revoke')],
  tokenAllowedDomains: [new RegExp('api.acquamania.com.br')],
  oauthCallbackUrl: 'https://novax.acquamania.com.br/authorized',
};
