import Address from './addresses/address';

type UserData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  shippingAddresses: Array<Address>;
  billingAddresses: Array<Address>;
};

export default UserData;
