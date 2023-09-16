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
        My name is Siarhei Muliarenka. I graduated from Polotsk State University as an engineer-designer of electronic equipment. I have started my carеera as a programmer for SCADA-systems. I developed the software to control the chemical proсesses. Then I have some courses of programming PLC-controllers manufactured by Allan Bredlly and Siemens. At the same time I got some skills in C# - ASP.Net - SQL Server stack to develop software for integration SCADA-systems with the ERP-system.  At the current time I'm an engineener of IT department of a chemical plant. I develope and maintaince a set of projects with C# and ASP.NET.
Some times ago I've become passionate the Web Development. It provides you enless possibilities for develope anything you can imagine. Well, I'm not sure in my artistic ability, but I like ' to make the car move'.
      contributions:
        'Siarhei is the member of the team to whom you could always turn to for any complicated technical question and not only. At the beginning of the project, he was given perhaps one of the most difficult and responsible tasks: to build Webpack. After all, it depended on how easy and high quality work would be done in the future. He coped with it perfectly. In the future he kept up with the set bar and took on the most difficult tasks. Need to do routing? Ask Sergey. Can\'t figure out where you have a mistake? Ask Siarhei. How to make it work? Ask Siarhei. Made: "Repository Setup", "Development Environment Configuration", "Development Scripts", "Main Page", "Routing Implementation", "Catalog Page", "Header", "Basket Page".',
      gitHubLink: 'https://github.com/surface74',
    };
  }
}
