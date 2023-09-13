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

export { QueryParamType, LoginData };
