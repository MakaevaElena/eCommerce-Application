import styleCard from './styles/team-member-card-style.module.scss';
import TagName from '../../../../../enum/tag-name';
import TeamMemberCardType from './types/team-member-card-type';
import styleTitle from '../title/title-style.module.scss';

export default class TeamMemberCard {
  private element: HTMLDivElement;

  constructor(teamMemberData: TeamMemberCardType) {
    this.element = this.createElement();
    this.configure(teamMemberData);
  }

  getElement() {
    return this.element;
  }

  private createElement() {
    const element = document.createElement(TagName.DIV);
    element.classList.add(styleCard.card);
    return element;
  }

  private configure(teamMemberData: TeamMemberCardType) {
    this.element.append(
      this.createPhoto(teamMemberData.photoSrc, teamMemberData.name),
      this.createCardDescription(teamMemberData)
    );
  }

  private createPhoto(src: string, alt: string): HTMLImageElement {
    const img = document.createElement('img');
    img.classList.add(styleCard.photo);
    img.src = src;
    img.alt = alt;
    img.title = alt;
    return img;
  }

  private createCardDescription(teamMemberData: TeamMemberCardType): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(styleCard.description__wrap);

    const nameTeamMember = this.createNameMemberTeam(teamMemberData.name);

    element.append(nameTeamMember);
    return element;
  }

  private createNameMemberTeam(name: string): HTMLDivElement {
    return this.createFunnyString(name, styleCard.description__name);
  }

  private createFunnyString(string: string, className?: string) {
    const stringElement = document.createElement(TagName.DIV);
    stringElement.classList.add(styleTitle.waving);
    if (className) {
      stringElement.classList.add(className);
    }

    stringElement.append(...string.split('').map((letter) => this.addLetter(letter)));

    return stringElement;
  }

  private addLetter(letter: string) {
    const letterElement = document.createElement(TagName.SPAN);
    letterElement.innerText = letter;
    return letterElement;
  }
}
