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
      elenaCard.getElement(),
      siarheiCard.getElement(),
      vladimirCard.getElement()
    );
    this.getCreator().addInnerElement(wrapper);
  }
}
