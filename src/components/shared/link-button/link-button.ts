import styleCss from './link-button.module.scss';
import { ElementParams } from '../../../utils/element-creator';
import DefaultView from '../../view/default-view';
import TagName from '../../../enum/tag-name';
import { LinkName } from '../../router/pages';

export default class LinkButton extends DefaultView {
  private headerLinks: Map<string, LinkButton>;

  constructor(caption: string, callback: () => void, headerLinks: Map<string, LinkButton>) {
    const elementParams: ElementParams = {
      tag: TagName.A,
      textContent: caption,
      classNames: [styleCss['link-button']],
    };

    super(elementParams);

    this.headerLinks = headerLinks;

    this.getElement().addEventListener('click', callback);

    this.configView();
  }

  private configView() {
    this.getElement().addEventListener('click', () => {
      this.markSelected();
    });
    this.viewForLoggedUser();
  }

  private markSelected() {
    this.headerLinks.forEach((link) => {
      link.markUnSelected();
    });

    this.getElement().classList.add(styleCss.selected);
  }

  private markUnSelected() {
    this.getElement().classList.remove(styleCss.selected);
  }

  private hideButton() {
    this.getElement().classList.add(styleCss.hide);
  }

  private disableButton() {
    this.getElement().classList.add(styleCss['link-button_disabled']);
  }

  private showButton() {
    this.getElement().classList.add(styleCss.show);
  }

  private viewForLoggedUser() {
    if (localStorage.getItem(`isLogin`) === 'true') {
      this.headerLinks.get(LinkName.LOGIN)?.disableButton();
      this.headerLinks.get(LinkName.REGISTRATION)?.disableButton();
    }
  }
}
