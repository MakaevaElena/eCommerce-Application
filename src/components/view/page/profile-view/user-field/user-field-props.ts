import Groups from './enum/groups';
import { InputPlaceholders, InputTypes } from '../../../../../utils/input/input-values/input-values';
import { Group } from '../../../../../utils/input/inputParams';

type UserFieldProps = {
  group: Group;
  inputType: string;
  labelValue: string;
  inputValue?: string;
  isDefaultAddress?: boolean;
};

export default UserFieldProps;
