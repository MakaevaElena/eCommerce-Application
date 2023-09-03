import Address from './addresses/address';

type UserData = {
  id: string;

  version: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  shippingAddresses: Array<Address>;
  billingAddresses: Array<Address>;
  addresses: Array<Address>;
};

export default UserData;
