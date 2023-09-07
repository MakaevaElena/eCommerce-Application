import TagElement from '../../../utils/create-tag-element';
import styleCss from './search-input.module.scss';

export default class SearchInput {
  private readonly PLACEHOLDER = 'Ask me...';

  private element: HTMLInputElement;

  private callback: () => void;

  constructor(callback: () => void) {
    this.callback = callback;

    const creator = new TagElement();

    this.element = creator.createTagElement('input', [styleCss['search-input']]);
    this.element.setAttribute('type', 'search');
    this.element.setAttribute('placeholder', this.PLACEHOLDER);
    this.element.addEventListener('search', () => callback());
  }

  public getElement() {
    return this.element;
  }

  public clear() {
    this.element.value = '';
  }

  public getSearchString() {
    return this.element.value.trim();
  }
}
