import styles from './registration-view.module.scss';
import TagName from '../../../../enum/tag-name';
import { ElementParams } from '../../../../utils/element-creator';
import { InputParams } from '../../../../utils/input/inputParams';
import {
  InputNames,
  InputPatterns,
  InputPlaceholders,
  InputTittles,
  InputTypes,
} from '../../../../utils/input/input-values/input-values';
import InputCreator from '../../../../utils/input/inputCreator';
import DefaultView from '../../default-view';

export default class RegistrationView extends DefaultView {
  constructor() {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: Object.values(styles),
      textContent: 'RegistrationView',
    };
    super(params);
    this.configView();
  }

  private configView() {
    const mainInputs = this.inputsCreator();
    this.getElement().append(...mainInputs);
  }

  private inputsCreator() {
    const inputsParams: Array<InputParams> = [];
    const emailParams: InputParams = {
      classNames: [styles.registrationView__form],
      attributes: {
        type: InputTypes.EMAIL,
        name: InputNames.EMAIL,
        placeholder: InputPlaceholders.EMAIL,
      },
    };
    inputsParams.push(emailParams);

    const passwordParams = {
      classNames: [styles.registrationView__form],
      attributes: {
        type: InputTypes.PASSWORD,
        name: InputNames.PASSWORD,
        placeholder: InputPlaceholders.PASSWORD,
        title: InputTittles.PASSWORD,
        pattern: InputPatterns.PASSWORD,
      },
    };
    inputsParams.push(passwordParams);

    const passwordRepeatParams = {
      classNames: [styles.registrationView__form],
      callback: this.passwordCheck.bind(this),
      attributes: {
        type: InputTypes.PASSWORD,
        name: InputNames.REPEAT_PASSWORD,
        placeholder: InputPlaceholders.REPEAT_PASSWORD,
        title: InputTittles.PASSWORD,
        pattern: InputPatterns.PASSWORD,
      },
    };
    inputsParams.push(passwordRepeatParams);

    const firstNameParams = {
      classNames: [styles.registrationView__form],
      callback: this.passwordCheck.bind(this),
      attributes: {
        type: InputTypes.TEXT,
        name: InputNames.FIRST_NAME,
        placeholder: InputPlaceholders.FIRST_NAME,
        title: InputTittles.TEXT,
        pattern: InputPatterns.TEXT,
      },
    };
    inputsParams.push(firstNameParams);

    const lastNameParams = {
      classNames: [styles.registrationView__form],
      callback: this.passwordCheck.bind(this),
      attributes: {
        type: InputTypes.TEXT,
        name: InputNames.LAST_NAME,
        placeholder: InputPlaceholders.LAST_NAME,
        title: InputTittles.TEXT,
        pattern: InputPatterns.TEXT,
      },
    };
    inputsParams.push(lastNameParams);

    const birthDateParams = {
      classNames: [styles.registrationView__form],
      callback: this.passwordCheck.bind(this),
      attributes: {
        type: InputTypes.DATE,
        name: InputNames.DATE_OF_BIRTH,
        title: InputTittles.DATE_OF_BIRTH_HINT,
        max: this.maxPossibleDate(),
      },
    };
    inputsParams.push(birthDateParams);

    const inputs = this.inputsCreatorFromParams(inputsParams);
    return inputs;
  }

  private inputsCreatorFromParams(params: Array<InputParams>) {
    const inputs: Array<HTMLDivElement> = [];
    params.forEach((inputParams) => {
      const inputElement = new InputCreator(inputParams);
      inputs.push(inputElement.getElement());
    });

    return inputs;
  }

  private passwordCheck(event: Event) {
    console.log(event);
  }

  private maxPossibleDate(): string {
    const numLength = 2;
    const minYears = 13;
    const today = new Date();
    const year = today.getFullYear() - minYears;
    const month = today.getMonth().toString().padStart(numLength, '0');
    const day = today.getDate().toString().padStart(numLength, '0');
    const maxDate = `${year}-${month}-${day}`;
    return maxDate;
  }
}

export function getView(): RegistrationView {
  return new RegistrationView();
}
