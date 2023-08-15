import styles from './registration-view.module.scss';
import TagName from '../../../../enum/tag-name';
import { ElementParams } from '../../../../utils/element-creator';
import { InputParams } from '../../../../utils/input/inputParams';
import {
  InputLabels,
  InputNames,
  InputPatterns,
  InputPlaceholders,
  InputTittles,
  InputTypes,
} from '../../../../utils/input/input-values/input-values';
import InputCreator from '../../../../utils/input/inputCreator';
import DefaultView from '../../default-view';
import InputsGroups from '../../../../utils/input/input-values/inputs-groups';

export default class RegistrationView extends DefaultView {
  inputsParams: Array<InputParams>;

  mainInputsGroup: Array<HTMLDivElement>;

  shippingInputsGroup: Array<HTMLDivElement>;

  billingInputsGroup: Array<HTMLDivElement>;

  constructor() {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: Object.values(styles),
      textContent: 'RegistrationView',
    };
    super(params);
    this.mainInputsGroup = [];
    this.billingInputsGroup = [];
    this.shippingInputsGroup = [];
    this.inputsParams = this.createParams();
    this.fillInputsGroups();
    this.configView();
  }

  private configView() {
    const form = this.createForm();
    this.getElement().append(form);
  }

  private fillInputsGroups(): void {
    this.inputsParams.forEach((inputParams: InputParams) => {
      const input = new InputCreator(inputParams);
      if (inputParams.group === InputsGroups.MAIN) {
        this.mainInputsGroup.push(input.getElement());
      } else if (inputParams.group === InputsGroups.SHIPPING) {
        this.shippingInputsGroup.push(input.getElement());
      } else {
        this.billingInputsGroup.push(input.getElement());
      }
    });
  }

  private createForm(): HTMLFormElement {
    const form = document.createElement('form');

    const shippingLabelGroup = this.creatLabelWithGroup(InputLabels.SHIPPING_ADDRESS, this.shippingInputsGroup);
    const billingLabelGroup = this.creatLabelWithGroup(InputLabels.BILLING_ADDRESS, this.billingInputsGroup);

    form.append(...this.mainInputsGroup, shippingLabelGroup, billingLabelGroup);
    return form;
  }

  private creatLabelWithGroup(name: string, group: Array<HTMLDivElement>): HTMLLabelElement {
    const labelWithGroup = document.createElement('label');
    labelWithGroup.textContent = name;
    labelWithGroup.classList.add(styles.label);
    labelWithGroup.append(...group);
    return labelWithGroup;
  }

  //
  // private inputsCreatorFromParams(params: Array<InputParams>) {
  //   const inputs: Array<HTMLDivElement> = [];
  //   params.forEach((inputParams) => {
  //     const inputElement = new InputCreator(inputParams);
  //     inputs.push(inputElement.getElement());
  //   });
  //
  //   return inputs;
  // }

  private passwordCheck(event: Event) {
    console.log(event);
  }

  private maxPossibleDate(minYears: string): string {
    const numLength = 2;
    const today = new Date();
    const year = today.getFullYear() - Number(minYears);
    const month = today.getMonth().toString().padStart(numLength, '0');
    const day = today.getDate().toString().padStart(numLength, '0');
    const maxDate = `${year}-${month}-${day}`;
    return maxDate;
  }

  private createParams(): Array<InputParams> {
    return [
      {
        classNames: [styles.registrationView__form],
        group: InputsGroups.MAIN,
        attributes: {
          type: InputTypes.EMAIL,
          name: InputNames.EMAIL,
          placeholder: InputPlaceholders.EMAIL,
        },
      },
      {
        classNames: [styles.registrationView__form],
        group: InputsGroups.MAIN,
        attributes: {
          type: InputTypes.PASSWORD,
          name: InputNames.PASSWORD,
          placeholder: InputPlaceholders.PASSWORD,
          title: InputTittles.PASSWORD,
          pattern: InputPatterns.PASSWORD,
        },
      },
      {
        classNames: [styles.registrationView__form],
        callback: this.passwordCheck.bind(this),
        group: InputsGroups.MAIN,
        attributes: {
          type: InputTypes.PASSWORD,
          name: InputNames.REPEAT_PASSWORD,
          placeholder: InputPlaceholders.REPEAT_PASSWORD,
          title: InputTittles.PASSWORD,
          pattern: InputPatterns.PASSWORD,
        },
      },
      {
        classNames: [styles.registrationView__form],
        group: InputsGroups.MAIN,
        callback: this.passwordCheck.bind(this),
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.FIRST_NAME,
          placeholder: InputPlaceholders.FIRST_NAME,
          title: InputTittles.TEXT,
          pattern: InputPatterns.TEXT,
        },
      },
      {
        classNames: [styles.registrationView__form],
        callback: this.passwordCheck.bind(this),
        group: InputsGroups.MAIN,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.LAST_NAME,
          placeholder: InputPlaceholders.LAST_NAME,
          title: InputTittles.TEXT,
          pattern: InputPatterns.TEXT,
        },
      },
      {
        classNames: [styles.registrationView__form],
        callback: this.passwordCheck.bind(this),
        group: InputsGroups.MAIN,
        attributes: {
          type: InputTypes.DATE,
          name: InputNames.DATE_OF_BIRTH,
          title: InputTittles.DATE_OF_BIRTH_HINT,
          max: this.maxPossibleDate(InputPatterns.DATE_OF_BIRTH_MAX),
        },
      },
      {
        classNames: [styles.registrationView__form],
        callback: this.passwordCheck.bind(this),
        group: InputsGroups.SHIPPING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.SHIPPING_STREET,
          title: InputTittles.EASY_TEXT,
          placeholder: InputPlaceholders.STREET,
        },
      },
      {
        classNames: [styles.registrationView__form],
        callback: this.passwordCheck.bind(this),
        group: InputsGroups.SHIPPING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.SHIPPING_CITY,
          title: InputTittles.EASY_TEXT,
          placeholder: InputPlaceholders.CITY,
        },
      },
      {
        classNames: [styles.registrationView__form],
        callback: this.passwordCheck.bind(this),
        group: InputsGroups.SHIPPING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.SHIPPING_POSTAL,
          title: InputTittles.POSTAL_HINT,
          placeholder: InputPlaceholders.POSTAL,
        },
      },
      {
        classNames: [styles.registrationView__form],
        callback: this.passwordCheck.bind(this),
        group: InputsGroups.SHIPPING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.SHIPPING_POSTAL,
          title: InputTittles.COUNTRY_HINT,
          placeholder: InputPlaceholders.COUNTRY,
        },
      },
      {
        classNames: [styles.registrationView__form],
        callback: this.passwordCheck.bind(this),
        group: InputsGroups.BILLING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.SHIPPING_STREET,
          title: InputTittles.EASY_TEXT,
          placeholder: InputPlaceholders.STREET,
        },
      },
      {
        classNames: [styles.registrationView__form],
        callback: this.passwordCheck.bind(this),
        group: InputsGroups.BILLING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.SHIPPING_CITY,
          title: InputTittles.EASY_TEXT,
          placeholder: InputPlaceholders.CITY,
        },
      },
      {
        classNames: [styles.registrationView__form],
        callback: this.passwordCheck.bind(this),
        group: InputsGroups.BILLING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.SHIPPING_POSTAL,
          title: InputTittles.POSTAL_HINT,
          placeholder: InputPlaceholders.POSTAL,
        },
      },
      {
        classNames: [styles.registrationView__form],
        callback: this.passwordCheck.bind(this),
        group: InputsGroups.BILLING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.SHIPPING_POSTAL,
          title: InputTittles.COUNTRY_HINT,
          placeholder: InputPlaceholders.COUNTRY,
        },
      },
    ];
  }
}

export function getView(): RegistrationView {
  return new RegistrationView();
}
