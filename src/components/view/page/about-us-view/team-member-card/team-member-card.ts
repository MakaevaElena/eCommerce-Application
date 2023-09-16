import styleCard from './styles/team-member-card-style.module.scss';
import TagName from '../../../../../enum/tag-name';
import TeamMemberCardType from './types/team-member-card-type';
import MagicString from '../magic-string/magic-string';
import GitHubLink from './gitHubLink/git-hub-link';

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
    const biography = this.createParagraph('Biography:', teamMemberData.biography);
    const contribution = this.createParagraph('Contribution:', teamMemberData.contributions);

    this.element.append(
      this.createPhoto(teamMemberData.photoSrc, teamMemberData.firstName),
      this.createCardDescription(teamMemberData),
      biography,
      contribution
    );
  }

  private createPhoto(src: string, name: string): HTMLElement {
    const photo = document.createElement('figure');
    photo.classList.add(styleCard.photo);

    const img = document.createElement('img');
    img.classList.add(styleCard.photo__img);
    img.src = src;
    img.alt = name;
    img.title = name;

    const figcaption = document.createElement('figcaption');
    const figcaptionText = new MagicString(name, styleCard.photo__figcaption);
    figcaption.append(figcaptionText.getElement());

    photo.append(img, figcaption);
    return photo;
  }

  private createCardDescription(teamMemberData: TeamMemberCardType): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(styleCard.description__wrap);

    const nameTeamMember = document.createElement('h2');
    nameTeamMember.classList.add(styleCard.title);
    nameTeamMember.textContent = `${teamMemberData.firstName} ${teamMemberData.lastName}`;

    const role = this.createParagraph(`Role: ${teamMemberData.role}`);

    const linkToGitHub = new GitHubLink(teamMemberData.gitHubLink);

    element.append(nameTeamMember, role, linkToGitHub.getElement());
    return element;
  }

  private createParagraph(headLineContent: string, textContent?: string): HTMLDivElement {
    const headLine = document.createElement('h3');
    headLine.classList.add(styleCard.description__headline);
    headLine.textContent = headLineContent;

    const element = document.createElement(TagName.DIV);
    element.classList.add(styleCard.description__text);
    element.append(headLine);

    if (textContent) {
      const paragraph = document.createElement('p');
      paragraph.classList.add(styleCard.description__textContent);
      paragraph.textContent = textContent;
      element.append(paragraph);
    }

    return element;
  }
}
