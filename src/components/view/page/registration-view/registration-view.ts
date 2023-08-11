import '../../../../style/global.scss';
import TagName from '../../../../enum/tag-name';
import { ElementParams } from '../../../../utils/element-creator';
import DefaultView from '../../default-view';
import styleCss from './registration-view.module.scss';

export default class RegistrationView extends DefaultView {
  constructor() {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: Object.values(styleCss),
      textContent: 'RegistrationView',
    };
    super(params);

    this.configView();
  }

  private configView() {
    const button = document.createElement('button');
    button.textContent = 'button';

    this.getElement().append(button);

    // throw new Error(`configView() for ${this.getElement()} not implemented`);
  }
}
