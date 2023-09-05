type QueryParamType = {
  where?: string | string[];
  limit?: number;
  filter?: string | string[];
  fuzzy?: boolean;
  country?: string;
  priceCountry?: string;
  priceCurrency?: string;
  sort?: string | string[];
  offset?: number;
};

export default QueryParamType;
