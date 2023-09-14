import styleCard from './styles/team-member-card-style.module.scss';
import TagName from '../../../../../enum/tag-name';
import TeamMemberCardType from './types/team-member-card-type';
import MagicString from '../magic-string/magic-string';

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
      this.createPhoto(teamMemberData.photoSrc, teamMemberData.firstName),
      this.createCardDescription(teamMemberData)
    );
  }

  private createPhoto(src: string, alt: string): HTMLElement {
    const photo = document.createElement('figure');
    photo.classList.add(styleCard.photo);

    const img = document.createElement('img');
    img.classList.add(styleCard.photo);
    img.src = src;
    img.alt = alt;
    img.title = alt;

    photo.append(img);
    return photo;
  }

  private createCardDescription(teamMemberData: TeamMemberCardType): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(styleCard.description__wrap);

    const nameTeamMember = this.createNameMemberTeam(teamMemberData.firstName);

    element.append(nameTeamMember);
    return element;
  }

  private createNameMemberTeam(name: string): HTMLDivElement {
    const funnyName = new MagicString(name);
    return funnyName.getElement();
  }

  private addLetter(letter: string) {
    const letterElement = document.createElement(TagName.SPAN);
    letterElement.innerText = letter;
    return letterElement;
  }
}
