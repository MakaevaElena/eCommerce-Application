import TeamMemberCardType from '../../team-member-card/types/team-member-card-type';

export default class VladimirData {
  private element: TeamMemberCardType;

  constructor() {
    this.element = this.createElement();
  }

  getElement() {
    return this.element;
  }

  private createElement(): TeamMemberCardType {
    return {
      photoSrc: 'https://avatars.githubusercontent.com/u/90175914?v=4',
      firstName: 'Vladimir',
      lastName: 'Sobolev',
      role: 'member',
      biography:
        '31 years old, married, have a beautiful little daughter. I got interested in programming because of GIT and CSS technologies. The first is what I lacked at my previous job, which was related to documentation in construction. Who faced with this will be able to understand me. And CSS is just magic, how many amazing and delightful things it brings not only on your monitors, but also in my life.',
      contributions:
        'Vladimir - the one who applies CSS tricks best and can come up with a adaptive design without media queries, who taught the team how to style correctly, and created all the global variables. So if you have a question in validating inputs, you can safely ask him. Made: "Comprehensive README", "Registration Page", "User Profile Page", "About Us Page".',
      gitHubLink: 'https://github.com/VladimirSobbolev',
    };
  }
}
