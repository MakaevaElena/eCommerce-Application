import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import Router from '../../../router/router';
import DefaultView from '../../default-view';
import styleCss from './styles/about-us-view.module.scss';
import Title from './title/title';
import RSLogo from './RS_logo/RS-logo';
import TeamMemberCard from './team-member-card/team-member-card';
import TeamMemberCardType from './team-member-card/types/team-member-card-type';

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
    const elenaCard = new TeamMemberCard(this.createElenaData());
    const siarheiCard = new TeamMemberCard(this.createSiarheiData());
    const vladimirCard = new TeamMemberCard(this.createVladimirData());

    wrapper.append(
      logo.getElement(),
      title.getElement(),
      elenaCard.getElement(),
      siarheiCard.getElement(),
      vladimirCard.getElement()
    );
    this.getCreator().addInnerElement(wrapper);
  }

  private createSiarheiData(): TeamMemberCardType {
    return {
      photoSrc: 'https://avatars.githubusercontent.com/u/52540855?v=4',
      firstName: 'Siarhei',
      lastName: 'Muliarenka',
      role: 'Member',
      biography:
        '31 years old, married, have a beautiful little daughter. I got interested in programming because of GIT and CSS technologies. The first is what I lacked at my previous job, which was related to documentation in construction. Who faced with this will be able to understand me. And CSS is just magic, how many amazing and delightful things it brings not only on your monitors, but also in my life.',
      contributions:
        "Siarhei is the member of the team to whom you could always turn to for any complicated technical question and not only. At the beginning of the project, he was given perhaps one of the most difficult and responsible tasks: to build Webpack. After all, it depended on how easy and high quality work would be done in the future. He coped with it perfectly. In the future he kept up with the set bar and took on the most difficult tasks. Need to do routing? Ask Sergey. Can't figure out where you have a mistake? Ask Siarhei. How to make it work? Ask Siarhei.",
      gitHubLink: 'https://github.com/surface74',
    };
  }

  private createElenaData(): TeamMemberCardType {
    return {
      photoSrc: 'https://avatars.githubusercontent.com/u/87429007?v=4',
      firstName: 'Elena',
      lastName: 'Makaeva',
      role: 'Leader',
      biography:
        '31 years old, married, have a beautiful little daughter. I got interested in programming because of GIT and CSS technologies. The first is what I lacked at my previous job, which was related to documentation in construction. Who faced with this will be able to understand me. And CSS is just magic, how many amazing and delightful things it brings not only on your monitors, but also in my life.',
      contributions:
        'The hardest part of any business is getting started. The way Elena approached the "Task Board Setup" encouraged the whole team. She as a real leader supported the team, was one of the first to complete all tasks and did it as well as not every professional developer can. She steadfastly took all the blows from the cross-checkers. She energized us for success and did not let us give up. She was also able to find a design for our work, which satisfied everyone, and which you now see on the screens. I could go on and on about her contribution, but then it wouldn\'t fit on your monitors',
      gitHubLink: 'https://github.com/MakaevaElena',
    };
  }

  private createVladimirData(): TeamMemberCardType {
    return {
      photoSrc: 'https://avatars.githubusercontent.com/u/90175914?v=4',
      firstName: 'Vladimir',
      lastName: 'Sobolev',
      role: 'Member',
      biography:
        '31 years old, married, have a beautiful little daughter. I got interested in programming because of GIT and CSS technologies. The first is what I lacked at my previous job, which was related to documentation in construction. Who faced with this will be able to understand me. And CSS is just magic, how many amazing and delightful things it brings not only on your monitors, but also in my life.',
      contributions:
        'All of the most difficult tasks were taken on by the rest of the team. Therefore, Vladimir tried to keep up and perform the tasks assigned to him as efficiently as possible. So if you have a question in validating inputs, you can safely ask him. When he started the task of implementing the registration page, he could not imagine how difficult it was.',
      gitHubLink: 'https://github.com/VladimirSobbolev',
    };
  }
}
