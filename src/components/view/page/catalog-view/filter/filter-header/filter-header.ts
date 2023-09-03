import TagName from '../../../../../../enum/tag-name';
import TagElement from '../../../../../../utils/create-tag-element';
import { ElementParams, InsertableElement } from '../../../../../../utils/element-creator';
import LinkButton from '../../../../../shared/link-button/link-button';
import DefaultView from '../../../../default-view';
import styleCss from './filter-header.module.scss';
import Observer from '../../../../../../observer/observer';
import EventName from '../../../../../../enum/event-name';
import FilterTag from '../filter-tag/filter-tag';

export default class FilterHeaderView extends DefaultView {
  private observer: Observer;

  private tagWrapper: HTMLDivElement;

  private BUTTON_TEXT = 'Filter';

  constructor() {
    const params: ElementParams = {
      tag: TagName.DIV,
      classNames: [styleCss['filter-header']],
      textContent: '',
    };
    super(params);
    this.tagWrapper = this.createTagWrapper();
    this.observer = Observer.getInstance();

    this.configView();
  }

  private configView() {
    const filterButton = this.createFilterButton();
    this.getElement().append(filterButton.getElement(), this.tagWrapper);
  }

  private createTagWrapper() {
    this.tagWrapper = new TagElement().createTagElement('div', [styleCss['filter-header__tag-wrapper']]);
    return this.tagWrapper;
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }

  public addFilterTag(filterAttribute: string, arrtibuteValue: string, callback: () => void) {
    console.log('addFilterTag');
    const tag = new FilterTag(filterAttribute, arrtibuteValue, callback);
    this.tagWrapper.append(tag.getElement());
  }

  public clearFilterTags() {
    this.tagWrapper.replaceChildren('');
  }

  private createFilterButton() {
    const linkButton = new LinkButton(this.BUTTON_TEXT, () => {
      this.observer.notify(EventName.SHOW_FILTER);
    });

    return linkButton;
  }
}
