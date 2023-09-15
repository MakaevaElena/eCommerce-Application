import styleCss from './styles/about-us-view.module.scss';
import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import Router from '../../../router/router';
import DefaultView from '../../default-view';
import Title from './title/title';
import RSLogo from './RS_logo/RS-logo';
import TeamMemberCard from './team-member-card/team-member-card';
import ElenaData from './team-members-data/elena/elena-data';
import SiarheiData from './team-members-data/siarhei/siarhei-data';
import VladimirData from './team-members-data/vladimir/vladimir-data';

export default class AboutUsView extends DefaultView {
  private router: Router;

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['about-us-view']],
      textContent: '',
    };
    super(params);

    this.router = router;

    this.configView();
  }

  private configView() {
    this.createLinks();
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }

  private createLinks() {
    const wrapper = new TagElement().createTagElement('div', [styleCss['content-wrapper']]);

    const logo = new RSLogo();
    const title = new Title();
    const elenaData = new ElenaData();
    const elenaCard = new TeamMemberCard(elenaData.getElement());

    const siarheiData = new SiarheiData();
    const siarheiCard = new TeamMemberCard(siarheiData.getElement());

    const vladimirData = new VladimirData();
    const vladimirCard = new TeamMemberCard(vladimirData.getElement());

    wrapper.append(
      logo.getElement(),
      title.getElement(),
      this.createIntro(),
      elenaCard.getElement(),
      siarheiCard.getElement(),
      vladimirCard.getElement()
    );
    this.getCreator().addInnerElement(wrapper);
  }

  private createIntro(): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(styleCss.intro);

    const greeting = document.createElement('p');
    greeting.classList.add(styleCss.intro__item);
    greeting.textContent =
      'Hi there! We are UP&GO team glad to see you in our app. The contribution of each of the participants in this work is huge. Some did more, some did less, but everyone tried to the best of their abilities. Not only mentally, but also in terms of willpower.';

    const aboutRs = document.createElement('p');
    aboutRs.classList.add(styleCss.intro__item);
    aboutRs.textContent =
      'To all who were able to do so, this is dedicated. To finish the course "JavaScript/Front-end" is not just to finish another course by defending a term paper or a diploma. It means to learn a lot of things, not only related to programming. It means learning to search for information, learning to express your thoughts, learning not only to ask for help, but also to help. This course taught us not just how to make beautiful websites, it taught us that programming is a huge community, which we became a part of thanks to Rolling Scopes.';

    const gratitude = document.createElement('p');
    gratitude.classList.add(styleCss.intro__item);
    gratitude.textContent =
      'We would like to say a huge thank you to our mentors and tutors for that. We are also grateful to our family and friends for their support. And we are especially grateful for the long nights, if they were shorter, we might not have made it. Special thanks to our mentor ';
    const mentorLinkGitHub = document.createElement(TagName.A);
    mentorLinkGitHub.classList.add(styleCss.link);
    mentorLinkGitHub.href = 'https://github.com/mikaleinik';
    mentorLinkGitHub.title = 'go to GitHub Mikhail Aleinik';
    mentorLinkGitHub.target = 'blank';
    mentorLinkGitHub.textContent = 'Mikhail Aleinik.';
    gratitude.append(mentorLinkGitHub);

    const summary = document.createElement('p');
    summary.classList.add(styleCss.intro__item);
    summary.textContent =
      'Our team has been actively keeping in touch on Telegram. We also held online meetings among ourselves and an online meeting with our mentor 2 times a week. The kanban was maintained in github repositories. Below you can familiarize yourself with each of the team members and their contribution to this project.';

    element.append(greeting, aboutRs, gratitude, summary);
    return element;
  }
}
