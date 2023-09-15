import styleGitHub from './git-hub-link.module.scss';
import TagName from '../../../../../../enum/tag-name';

export default class GitHubLink {
  private element: HTMLDivElement;

  constructor(link: string) {
    this.element = this.createElement();
    this.configure(link);
  }

  getElement() {
    return this.element;
  }

  private createElement() {
    const element = document.createElement(TagName.DIV);
    element.classList.add(styleGitHub.link__container);
    return element;
  }

  private configure(link: string) {
    this.element.append(this.createLink(link));
  }

  private createLink(linkToGitHub: string) {
    const link = document.createElement(TagName.A);
    link.classList.add(styleGitHub.link);
    link.href = linkToGitHub;
    link.title = 'go to GitHub';
    link.target = 'blank';

    return link;
  }
}
