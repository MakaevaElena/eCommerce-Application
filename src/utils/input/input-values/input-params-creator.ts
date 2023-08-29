import { CallbackListener, InputParams } from '../inputParams';
import InputsGroups from './inputs-groups';
import { InputNames, InputPatterns, InputPlaceholders, InputTittles, InputTypes } from './input-values';
import InputsList from '../../../components/view/page/registration-view/inputs-params/inputs-list';

export default class InputParamsCreator {
  getMailParams(styles: Array<string>): InputParams {
    return {
      classNames: styles,
      attributes: {
        type: InputTypes.EMAIL,
        name: InputNames.EMAIL,
        title: InputTittles.EMAIL_HINT,
        placeholder: InputPlaceholders.EMAIL,
        pattern: InputPatterns.EMAIL,
      },
    };
  }

  getPasswordParams(styles: Array<string>, callback: Array<[CallbackListener, string]>): InputParams {
    return {
      classNames: styles,
      callback,
      attributes: {
        type: InputTypes.PASSWORD,
        name: InputNames.PASSWORD,
        placeholder: InputPlaceholders.PASSWORD,
        title: InputTittles.PASSWORD,
        pattern: InputPatterns.PASSWORD,
      },
    };
  }

  getPasswordRepeatParams(styles: Array<string>, callback: Array<[CallbackListener, string]>): InputParams {
    return {
      classNames: styles,
      callback,
      attributes: {
        type: InputTypes.PASSWORD,
        name: InputNames.REPEAT_PASSWORD,
        placeholder: InputPlaceholders.REPEAT_PASSWORD,
        title: InputTittles.PASSWORD_REPEAT,
      },
    };
  }

  getFirstNameParams(styles: Array<string>): InputParams {
    return {
      classNames: styles,
      attributes: {
        type: InputTypes.TEXT,
        name: InputNames.FIRST_NAME,
        placeholder: InputPlaceholders.FIRST_NAME,
        title: InputTittles.TEXT,
        pattern: InputPatterns.TEXT,
      },
    };
  }

  getLastNameParams(styles: Array<string>): InputParams {
    return {
      classNames: styles,
      attributes: {
        type: InputTypes.TEXT,
        name: InputNames.LAST_NAME,
        placeholder: InputPlaceholders.LAST_NAME,
        title: InputTittles.TEXT,
        pattern: InputPatterns.TEXT,
      },
    };
  }

  getDateParams(styles: Array<string>, callback: Array<[CallbackListener, string]>): InputParams {
    return {
      classNames: styles,
      callback,
      group: InputsGroups.MAIN,
      attributes: {
        type: InputTypes.DATE,
        placeholder: InputTittles.DATE_OF_BIRTH_HINT,
        name: InputNames.DATE_OF_BIRTH,
        title: InputTittles.DATE_OF_BIRTH_HINT,
        max: this.maxPossibleDate(InputPatterns.DATE_OF_BIRTH_MAX),
      },
    };
  }

  getStreetParams(styles: Array<string>): InputParams {
    return {
      classNames: styles,
      attributes: {
        type: InputTypes.TEXT,
        title: InputTittles.EASY_TEXT,
        placeholder: InputPlaceholders.STREET,
      },
    };
  }

  getCityParams(styles: Array<string>): InputParams {
    return {
      classNames: styles,
      attributes: {
        type: InputTypes.TEXT,
        title: InputTittles.TEXT,
        placeholder: InputPlaceholders.CITY,
        pattern: InputPatterns.TEXT,
      },
    };
  }

  getSPostalParams(styles: Array<string>): InputParams {
    return {
      classNames: styles,
      attributes: {
        type: InputTypes.TEXT,
        name: InputNames.SHIPPING_POSTAL,
        title: InputTittles.POSTAL_HINT,
        placeholder: InputPlaceholders.POSTAL,
      },
    };
  }

  getCountryParams(styles: Array<string>, callback: Array<[CallbackListener, string]>): InputParams {
    return {
      classNames: styles,
      callback,
      attributes: {
        type: InputTypes.TEXT,
        name: InputNames.SHIPPING_COUNTRY,
        title: InputTittles.COUNTRY_HINT,
        placeholder: InputPlaceholders.COUNTRY,
        list: InputsList.COUNTRY,
      },
    };
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
}
