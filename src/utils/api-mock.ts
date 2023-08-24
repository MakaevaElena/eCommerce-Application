const ApiMock = {
  customerId: '738cacdc-89ac-42e9-9e30-df5d32a22c39',
  email: 'johndoe@example.com',
  pass: '123!@#qweQWE',
  countryCode: 'RU',
  dateOfBirth: '1970-01-01',
  httpCodeOK: 200,
  httpCodeResourceCreated: 201,
  messageUserExists: 'There is already an existing customer with the provided email.',
};

const MockCustomerData = {
  email: ApiMock.email,
  password: ApiMock.pass,
  firstName: '',
  lastName: '',
  dateOfBirth: ApiMock.dateOfBirth,
  countryShippingCode: ApiMock.countryCode,
  countryStreetShipping: ApiMock.countryCode,
  countryCityShipping: ApiMock.countryCode,
  countryPostalShipping: ApiMock.countryCode,
  countryStreetBilling: ApiMock.countryCode,
  countryCityBilling: ApiMock.countryCode,
  countryPostalBilling: ApiMock.countryCode,
  countryBillingCode: ApiMock.countryCode,
  key: ApiMock.customerId,
  defaultShippingAddressNum: undefined,
  defaultBillingAddressNum: undefined,
};
export { ApiMock, MockCustomerData };
