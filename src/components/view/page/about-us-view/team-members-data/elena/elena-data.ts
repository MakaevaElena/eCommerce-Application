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
        "Hello! I'm Elena Makaeva.I graduated from the Technical University of Communications and Informatics in Novosibirsk.I worked as a network engineer, later I became interested in building sites on WordPress, video editing, and then I met Javascript, and its capabilities surprised me.Programming fascinated me, combining both creative and logical activity, the opportunity to endlessly develop and apply new technologies.",
      contributions:
        'The hardest part of any business is getting started. The way Elena approached the "Task Board Setup" encouraged the whole team. She as a real leader supported the team, was one of the first to complete all tasks and did it as well as not every professional developer can. She steadfastly took all the blows from the cross-checkers. She energized us for success and did not let us give up. She was also able to find a design for our work, which satisfied everyone, and which you now see on the screens. I could go on and on about her contribution, but then it wouldn\'t fit on your monitors. Made: "Board Setup", "Login Page", "Detailed Product Page", "Basket Page".',
      gitHubLink: 'https://github.com/MakaevaElena',
    };
  }
}
