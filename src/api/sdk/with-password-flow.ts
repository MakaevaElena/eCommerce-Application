import { ClientBuilder, type HttpMiddlewareOptions, PasswordAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { CTP_API_URL, CTP_AUTH_URL, CTP_CLIENT_ID, CTP_CLIENT_SECRET, CTP_PROJECT_KEY } from './const';

const createUser = (name: string, password: string) => {
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
    host: CTP_API_URL,
    fetch,
  };

  const loginClient = new ClientBuilder()
    .withPasswordFlow(options)
    .withProjectKey(CTP_PROJECT_KEY)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();

  console.log('createUser: ', createUser);

  return loginClient;
};

export default createUser;
