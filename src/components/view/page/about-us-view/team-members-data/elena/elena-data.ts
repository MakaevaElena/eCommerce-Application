import TeamMemberCardType from '../../team-member-card/types/team-member-card-type';

export default class ElenaData {
  private element: TeamMemberCardType;

  constructor() {
    this.element = this.createElement();
  }

  getElement() {
    return this.element;
  }

  private createElement(): TeamMemberCardType {
    return {
      photoSrc: 'https://avatars.githubusercontent.com/u/87429007?v=4',
      firstName: 'Elena',
      lastName: 'Makaeva',
      role: 'leader',
      biography:
        '31 years old, married, have a beautiful little daughter. I got interested in programming because of GIT and CSS technologies. The first is what I lacked at my previous job, which was related to documentation in construction. Who faced with this will be able to understand me. And CSS is just magic, how many amazing and delightful things it brings not only on your monitors, but also in my life.',
      contributions:
        'The hardest part of any business is getting started. The way Elena approached the "Task Board Setup" encouraged the whole team. She as a real leader supported the team, was one of the first to complete all tasks and did it as well as not every professional developer can. She steadfastly took all the blows from the cross-checkers. She energized us for success and did not let us give up. She was also able to find a design for our work, which satisfied everyone, and which you now see on the screens. I could go on and on about her contribution, but then it wouldn\'t fit on your monitors. Made: "Board Setup", "Login Page", "Detailed Product Page", "Basket Page".',
      gitHubLink: 'https://github.com/MakaevaElena',
    };
  }
}
