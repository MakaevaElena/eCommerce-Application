import InputCreator from '../../../../../utils/input/inputCreator';
import styles from '../../registration-view/registration-view.module.scss';
import InputsGroups from '../../../../../utils/input/input-values/inputs-groups';
import {
  InputNames,
  InputPatterns,
  InputPlaceholders,
  InputTittles,
  InputTypes,
} from '../../../../../utils/input/input-values/input-values';
import UserFieldProps from './user-field-props';
import TagName from '../../../../../enum/tag-name';

export default class UserField {
  private elementField: HTMLDivElement;

  private inputElement: InputCreator;

  constructor({ group, inputType }: UserFieldProps) {
    const inputParams = this.createInputParams(group, inputType);
    this.inputElement = new InputCreator(inputParams);
    this.elementField = document.createElement(TagName.DIV);
    this.elementField.append(this.inputElement.getElement());
  }

  getElementField() {
    return this.elementField;
  }

  private createInputParams(group: string, inputType: string) {
    return {
      group: group,
      attributes: {
        type: inputType,
        name: InputNames.EMAIL,
        title: InputTittles.EMAIL_HINT,
        placeholder: InputPlaceholders.EMAIL,
        pattern: InputPatterns.EMAIL,
      },
    };
  }
}
