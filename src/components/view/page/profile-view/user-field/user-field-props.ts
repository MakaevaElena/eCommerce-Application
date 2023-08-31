import Groups from './enum/groups';
import { InputPlaceholders, InputTypes } from '../../../../../utils/input/input-values/input-values';
import { Group, InputParams } from '../../../../../utils/input/inputParams';

type UserFieldProps = {
  id: string;

  // version: number;

  action: string;

  actionName: string;
  value: string;
  inputParams: InputParams;
  isDefaultAddress?: boolean;
};

type FirstNameAction = {
  action: string;
  firstName: string;
};

type EmailAddressAction = {
  action: string;
  firstName: string;
};

export default UserFieldProps;
