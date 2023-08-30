import Groups from './enum/groups';
import { InputPlaceholders, InputTypes } from '../../../../../utils/input/input-values/input-values';
import { Group, InputParams } from '../../../../../utils/input/inputParams';

type UserFieldProps = {
  value: string;
  inputParams: InputParams;
  isDefaultAddress?: boolean;
};

export default UserFieldProps;
