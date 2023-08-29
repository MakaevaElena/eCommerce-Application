import InputCreator from '../../../../../utils/input/inputCreator';
import styleButton from './styles/button-style.module.scss';
import stylesField from './styles/field-view.module.scss';
import stylesRedactionButton from './styles/redaction-button-style.module.scss';
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
import { CallbackListener, InputParams } from '../../../../../utils/input/inputParams';
import TextContent from '../enum/text-content';
import Events from '../../../../../enum/events';

export default class UserField {
  private elementField!: HTMLDivElement;

  private inputElement: InputCreator;

  private confirmButton: HTMLButtonElement;

  private cancelButton: HTMLButtonElement;

  private redactionModeButton: HTMLButtonElement;

  constructor({ group, inputType, inputValue, labelValue }: UserFieldProps) {
    this.cancelButton = this.createButton(TextContent.CANCEL_BUTTON, Object.values(stylesRedactionButton));
    this.confirmButton = this.createButton(TextContent.CONFIRM_BUTTON, Object.values(stylesRedactionButton));
    this.redactionModeButton = this.createButton(
      TextContent.REDACTION_MODE_BUTTON,
      Object.values(stylesRedactionButton),
      this.redactionModeHandler.bind(this),
      Events.CLICK
    );

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
        placeholder: labelValue,
      },
    };
  }

  private createFieldElement(inputValue: string, labelValue: string) {
    const fieldElement = document.createElement(TagName.DIV);
    fieldElement.classList.add(...Object.values(stylesField));

    if (typeof inputValue !== 'undefined') {
      this.inputElement.setInputValue(inputValue);
    }

    if (typeof labelValue !== 'undefined') {
      this.inputElement.setLabel(labelValue);
    }

    this.inputElement.removeMessageElement();
    this.inputElement.setDisabled();

    fieldElement.append(this.inputElement.getElement(), this.redactionModeButton);
    return fieldElement;
  }

  private createInputElement(inputParams: InputParams) {
    const inputElement = new InputCreator(inputParams);
    return inputElement;
  }

  private createButton(
    textContent: string,
    classList?: Array<string>,
    eventListener?: CallbackListener,
    event?: string
  ): HTMLButtonElement {
    const button = document.createElement(TagName.BUTTON);
    button.textContent = textContent;
    button.classList.add(...Object.values(styleButton));
    if (classList) {
      button.classList.add(...classList);
    }

    if (eventListener && event) {
      button.addEventListener(event, eventListener);
    }

    return button;
  }

  private redactionModeHandler() {
    this.elementField.removeChild(this.redactionModeButton);
    this.inputElement.removeDisabled();
    this.elementField.append(this.confirmButton, this.cancelButton);
  }
}
