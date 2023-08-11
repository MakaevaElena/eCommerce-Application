import {
  ClientBuilder,

  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from '@commercetools/sdk-client-v2';

const CTP_PROJECT_KEY = 'best-games';
const CTP_CLIENT_SECRET = 'RKi7doGwQ75b4wfuLsPuahDT366uOhUY';
const CTP_CLIENT_ID = 'A8PxwfHMEiItZ24oahyDGO2A';
const CTP_AUTH_URL = 'https://auth.europe-west1.gcp.commercetools.com';
const CTP_API_URL = 'https://api.europe-west1.gcp.commercetools.com';
const CTP_SCOPES = 'manage_project:best-games manage_api_clients:best-games view_audit_log:best-games';

const projectKey = CTP_PROJECT_KEY || '';
const scopes = [CTP_SCOPES];

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: CTP_AUTH_URL || '',
  projectKey,
  credentials: {
    clientId: CTP_CLIENT_ID || '',
    clientSecret: CTP_CLIENT_SECRET || '',
  },
  scopes,
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: CTP_API_URL || '',
  fetch,
};

// Export the ClientBuilder
// eslint-disable-next-line import/prefer-default-export
export const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  // .withQueueMiddleware({ concurrency: 5 })

  .build();
