import {
  ClientBuilder,
  TokenCache,
  // Import middlewares
  // type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/sdk-client-v2';

export const CTP_PROJECT_KEY = 'best-games';
export const CTP_CLIENT_SECRET = 'RKi7doGwQ75b4wfuLsPuahDT366uOhUY';
export const CTP_CLIENT_ID = 'A8PxwfHMEiItZ24oahyDGO2A';
export const CTP_AUTH_URL = 'https://auth.europe-west1.gcp.commercetools.com';
export const CTP_API_URL = 'https://api.europe-west1.gcp.commercetools.com';
export const CTP_SCOPES = 'manage_project:best-games manage_api_clients:best-games view_audit_log:best-games';

type AnonymousAuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    anonymousId?: string;
  };
  scopes?: Array<string>;
  oauthUri?: string;
  fetch?: never;
  tokenCache?: TokenCache;
};

const options: AnonymousAuthMiddlewareOptions = {
  host: CTP_AUTH_URL,
  projectKey: CTP_PROJECT_KEY,
  credentials: {
    clientId: CTP_CLIENT_ID,
    clientSecret: CTP_CLIENT_SECRET,
    anonymousId: `best-games-${Math.random()}`, // a unique id
  },
  scopes: [`manage_project:${CTP_PROJECT_KEY}`],
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: CTP_API_URL || '',
  fetch,
};

export const anonimClient = () => {
  return new ClientBuilder()
    .withAnonymousSessionFlow(options)
    .withProjectKey(CTP_PROJECT_KEY)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
};
