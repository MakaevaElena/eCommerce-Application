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
        'All of the most difficult tasks were taken on by the rest of the team. Therefore, Vladimir tried to keep up and perform the tasks assigned to him as efficiently as possible. So if you have a question in validating inputs, you can safely ask him. When he started the task of implementing the registration page, he could not imagine how difficult it was. Made: "Comprehensive README", "Registration Page", "User Profile Page", "About Us Page".',
      gitHubLink: 'https://github.com/VladimirSobbolev',
    };
  }
}
