import styleCss from './link-button.module.scss';
import { ElementParams } from '../../../utils/element-creator';
import DefaultView from '../../view/default-view';
import TagName from '../../../enum/tag-name';
import { LinkName } from '../../router/pages';

export default class LinkButton extends DefaultView {
  private linksGroup: Map<string, LinkButton> | undefined;

  constructor(caption: string, callback: () => void, linksGroup?: Map<string, LinkButton>) {
    const elementParams: ElementParams = {
      tag: TagName.A,
      textContent: caption,
      classNames: [styleCss['link-button']],
    };

    super(elementParams);

    this.linksGroup = linksGroup;

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
    if (this.linksGroup) {
      this.linksGroup.forEach((link) => {
        link.markUnSelected();
      });
      this.getElement().classList.add(styleCss.selected);
    }
  }

  private markUnSelected() {
    this.getElement().classList.remove(styleCss.selected);
  }

  public hideButton() {
    this.getElement().classList.add(styleCss.hide);
  }

  public disableButton() {
    this.getElement().classList.add(styleCss['link-button_disabled']);
  }

  public enableButton() {
    this.getElement().classList.remove(styleCss['link-button_disabled']);
  }

  public showButton() {
    this.getElement().classList.remove(styleCss.hide);
  }

  private viewForLoggedUser() {
    if (localStorage.getItem(`isLogin`) === 'true') {
      if (this.linksGroup) {
        this.linksGroup.get(LinkName.REGISTRATION)?.disableButton();
        this.linksGroup.get(LinkName.LOGIN)?.disableButton();
      }
    }
  }
}
