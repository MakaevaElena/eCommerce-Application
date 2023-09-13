import {
  ClientBuilder,
  type HttpMiddlewareOptions,
  AnonymousAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import Guid from '../../utils/guid';
import LocalStorageKeys from '../../enum/local-storage-keys';
import { CTP_API_URL, CTP_AUTH_URL, CTP_CLIENT_ID, CTP_CLIENT_SECRET, CTP_PROJECT_KEY } from './const';

const createAnonim = () => {
  const anonymousId = Guid.newGuid();

  localStorage.setItem(LocalStorageKeys.ANONYMOUS_ID, anonymousId);

  const options: AnonymousAuthMiddlewareOptions = {
    host: CTP_AUTH_URL,
    projectKey: CTP_PROJECT_KEY,
    credentials: {
      clientId: CTP_CLIENT_ID,
      clientSecret: CTP_CLIENT_SECRET,
      anonymousId,
    },
    scopes: [`manage_project:${CTP_PROJECT_KEY}`],
  };

  const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: CTP_API_URL,
  };

  const anonimClient = new ClientBuilder()
    .withAnonymousSessionFlow(options)
    .withProjectKey(CTP_PROJECT_KEY)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();

  return anonimClient;
};

export default createAnonim;
