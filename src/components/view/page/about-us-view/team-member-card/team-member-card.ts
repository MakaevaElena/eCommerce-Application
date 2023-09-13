import styleCard from './styles/team-member-card-style.module.scss';
import TagName from '../../../../../enum/tag-name';
import TeamMemberCardType from './types/team-member-card-type';

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
    this.element.append(this.createPhoto(teamMemberData.photoSrc));
  }

  private createPhoto(src: string): HTMLImageElement {
    const img = document.createElement('img');
    img.classList.add(styleCard.photo);
    img.src = src;
    return img;
  }
}
