import styleCss from './button.module.scss';
import { ElementParams } from '../../../utils/element-creator';
import DefaultView from '../../view/default-view';
import TagName from '../../../enum/tag-name';

export default class Button extends DefaultView {
  constructor(caption: string, callback: () => void) {
    const elementParams: ElementParams = {
      tag: TagName.A,
      textContent: caption,
      classNames: [styleCss.button],
    };

    super(elementParams);

    this.getElement().addEventListener('click', callback);
  }
}
