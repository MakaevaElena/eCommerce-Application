import styles from './registration-view.module.scss';
import TagName from '../../../../enum/tag-name';
import { ElementParams } from '../../../../utils/element-creator';
import DefaultView from '../../default-view';
import InputCreator from '../../../../utils/input/inputCreator';

export default class RegistrationView extends DefaultView {
  header: HTMLElement | null;

  constructor(header: HTMLElement | null) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: Object.values(styles),
      textContent: 'RegistrationView',
    };
    super(params);
    this.header = header;
    this.configView();
  }

  private configView() {
    const inParams = {
      classNames: [styles.registrationView__form],
      textContent: 'email',
      callback: this.changeAny,
      attributes: {
        type: 'email',
        name: 'email',
        title: 'example@email.com ',
      },
    };
    const inParams2 = {
      classNames: [styles.registrationView__form],
      textContent: 'password',
      callback: this.changeAny,
      attributes: {
        type: 'password',
        name: 'password',
        title: 'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number',
        pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$',
      },
    };
    const emailInput = new InputCreator(inParams);
    const emil2 = new InputCreator(inParams2);

    this.getElement().append(emailInput.getElement(), emil2.getElement());
  }

  private changeAny(e: Event): void {
    // alert(e);
  }
}
