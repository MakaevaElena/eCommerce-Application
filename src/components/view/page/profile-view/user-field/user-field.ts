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
import { InputParams } from '../../../../../utils/input/inputParams';

export default class UserField {
  private elementField!: HTMLDivElement;

  private inputElement: InputCreator;

  constructor({ group, inputType, inputValue, labelValue }: UserFieldProps) {
    const inputParams = this.createInputParams(group, inputType, labelValue);
    this.inputElement = this.createInputElement(inputParams);
    if (typeof inputValue !== 'undefined') {
      this.elementField = this.createFieldElement(inputValue, labelValue);
    }
  }

  getElementField() {
    return this.elementField;
  }

  private createInputParams(group: string, inputType: string, labelValue: string) {
    return {
      group: group,
      attributes: {
        type: inputType,
        name: InputNames.EMAIL,
        title: InputTittles.EMAIL_HINT,
        placeholder: labelValue,
        pattern: InputPatterns.TEXT,
      },
    };
  }

  private createFieldElement(inputValue: string, labelValue: string) {
    const fieldElement = document.createElement(TagName.DIV);
    fieldElement.classList.add();

    if (typeof inputValue !== 'undefined') {
      this.inputElement.setInputValue(inputValue);
    }

    if (typeof labelValue !== 'undefined') {
      this.inputElement.setLabel(labelValue);
    }

    this.inputElement.removeMessageElement();

    fieldElement.append(this.inputElement.getElement());
    return fieldElement;
  }

  private createInputElement(inputParams: InputParams) {
    const inputElement = new InputCreator(inputParams);

    return inputElement;
  }
}
