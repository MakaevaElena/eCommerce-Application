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

type PasswordAuthMiddlewareOptions = {
  host: string;
  projectKey: string;
  credentials: {
    clientId: string;
    clientSecret: string;
    user: {
      username: string;
      password: string;
    };
  };
  scopes?: Array<string>;
  tokenCache?: TokenCache;
  oauthUri?: string;
  fetch?: unknown;
};

export const createUser = (name: string, password: string) => {
  const options: PasswordAuthMiddlewareOptions = {
    host: CTP_AUTH_URL,
    projectKey: CTP_PROJECT_KEY,

    credentials: {
      clientId: CTP_CLIENT_ID,
      clientSecret: CTP_CLIENT_SECRET,
      user: {
        username: name,
        password,
      },
    },
    scopes: [`manage_project:${CTP_PROJECT_KEY}`],
    fetch,
  };

  // Configure httpMiddlewareOptions
  const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: CTP_API_URL || '',
    fetch,
  };

  const loginClient = new ClientBuilder()
    .withPasswordFlow(options)
    .withProjectKey(CTP_PROJECT_KEY)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();

  return loginClient;
};
