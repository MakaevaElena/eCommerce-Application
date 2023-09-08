import classCss from './filter-tag.module.scss';
import TagElement from '../../../../../../utils/create-tag-element';

export default class FilterTag {
  private element: HTMLAnchorElement;

  private callback: () => void;

  constructor(filterAttribute: string, filterValue: string, callback: () => void) {
    this.callback = callback;

    this.element = new TagElement().createTagElement(
      'a',
      [classCss['filter-tag']],
      `${filterAttribute}: ${filterValue}`
    );

    this.element.addEventListener('click', this.clickHandler.bind(this));
  }

  public getElement() {
    return this.element;
  }

  private clickHandler() {
    this.callback();
  }
}
