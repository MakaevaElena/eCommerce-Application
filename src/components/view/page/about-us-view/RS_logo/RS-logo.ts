import styleLogo from './rs-logo-style.module.scss';
import TagName from '../../../../../enum/tag-name';

export default class RSLogo {
  private element: HTMLDivElement;

  constructor() {
    this.element = this.createLogo();
  }

  getElement() {
    return this.element;
  }

  private createLogo(): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(styleLogo.RSLogo);
    element.append(this.createLink());
    return element;
  }

  private createLink() {
    const linkContainer = document.createElement(TagName.DIV);
    linkContainer.classList.add(styleLogo.link__container);

    const link = document.createElement(TagName.A);
    link.classList.add(styleLogo.link);
    link.href = 'https://rollingscopes.com/';
    link.title = 'go to the main site of The Rolling Scopes community';
    link.target = 'blank';

    linkContainer.append(link);
    return linkContainer;
  }
}
