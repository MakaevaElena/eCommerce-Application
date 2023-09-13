import { QueryParam } from '@commercetools/sdk-client-v2';

type LoginData = {
  email: string;
  password: string;
};

type QueryParamType = {
  [key: string]: QueryParam;
  where?: string | string[];
  limit?: number;
  filter?: string | string[];
  fuzzy?: boolean;
  country?: string;
  priceCountry?: string;
  priceCurrency?: string;
  sort?: string | string[];
  offset?: number;
  markMatchingVariants?: boolean;
};

// type AnonymousAuthMiddlewareOptions = {
//   host: string;
//   projectKey: string;
//   credentials: {
//     clientId: string;
//     clientSecret: string;
//     anonymousId?: string;
//   };
//   scopes?: Array<string>;
//   oauthUri?: string;
//   fetch?: never;
//   tokenCache?: TokenCache;
// };

export { QueryParamType, LoginData };
