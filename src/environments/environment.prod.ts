export const environment = {
  production: true,
  clientId: 'novax@angular',
  clientSecret: 'WsAuth@2022',
  apiUrl: 'https://api.acquamania.com.br',

  tokenDisallowedRoutes: [new RegExp('/oauth2/token')],
  tokenAllowedDomains: [new RegExp('api.acquamania.com.br')],
  oauthCallbackUrl: 'https://nimbussystems.com.br/authorized',
};
