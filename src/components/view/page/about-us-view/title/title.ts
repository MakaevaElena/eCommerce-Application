import styleTitle from './title-style.module.scss';
import TagName from '../../../../../enum/tag-name';
import MagicString from '../magic-string/magic-string';

export default class Title {
  private element: HTMLDivElement;

  constructor() {
    this.element = this.createElement();
    this.configure();
  }

  getElement() {
    return this.element;
  }

  private createElement() {
    const element = document.createElement(TagName.DIV);
    element.classList.add(styleTitle.titleContainer);
    return element;
  }

  private configure() {
    const teamNameTitle = 'UP&GO';
    const funnyStringTeamName = new MagicString(teamNameTitle, styleTitle.title);
    const teamNameSubtitle = 'team';
    const funnyStringTeamSubName = new MagicString(teamNameSubtitle, styleTitle.subtitle);
    this.element.append(funnyStringTeamName.getElement(), funnyStringTeamSubName.getElement());
  }
}
