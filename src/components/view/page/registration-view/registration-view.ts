import styles from './registration-view.module.scss';
import TagName from '../../../../enum/tag-name';
import { ElementParams } from '../../../../utils/element-creator';
import DefaultView from '../../default-view';
import InputCreator from '../../../../utils/input/inputCreator';

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
    const emailInput = new InputCreator({
      classNames: [styles.registrationView__form],
      textContent: 'email',
      callback: this.changeAny,
      attributes: {
        type: 'email',
        name: 'email',
        placeholder: 'print email',
        Required: true,
      },
    });

    this.getElement().append(emailInput.getElement());
  }

  private changeAny(e: Event): void {
    alert(e);
  }
}
