import TeamMemberCardType from '../../team-member-card/types/team-member-card-type';

export default class SiarheiData {
  private element: TeamMemberCardType;

  constructor() {
    this.element = this.createElement();
  }

  getElement() {
    return this.element;
  }

  private createElement(): TeamMemberCardType {
    return {
      photoSrc: 'https://avatars.githubusercontent.com/u/52540855?v=4',
      firstName: 'Siarhei',
      lastName: 'Muliarenka',
      role: 'member',
      biography:
        '31 years old, married, have a beautiful little daughter. I got interested in programming because of GIT and CSS technologies. The first is what I lacked at my previous job, which was related to documentation in construction. Who faced with this will be able to understand me. And CSS is just magic, how many amazing and delightful things it brings not only on your monitors, but also in my life.',
      contributions:
        'Siarhei is the member of the team to whom you could always turn to for any complicated technical question and not only. At the beginning of the project, he was given perhaps one of the most difficult and responsible tasks: to build Webpack. After all, it depended on how easy and high quality work would be done in the future. He coped with it perfectly. In the future he kept up with the set bar and took on the most difficult tasks. Need to do routing? Ask Sergey. Can\'t figure out where you have a mistake? Ask Siarhei. How to make it work? Ask Siarhei. Made: "Repository Setup", "Development Environment Configuration", "Development Scripts", "Main Page", "Routing Implementation", "Catalog Page", "Header", "Basket Page".',
      gitHubLink: 'https://github.com/surface74',
    };
  }
}
