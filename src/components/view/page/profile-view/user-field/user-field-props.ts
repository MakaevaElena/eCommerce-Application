import { InputParams } from '../../../../../utils/input/inputParams';

type UserFieldProps = {
  id: string;

  action: string;

  actionName: string;
  value: string;
  inputParams: InputParams;
  isDefaultAddress?: boolean;
};

export default UserFieldProps;
