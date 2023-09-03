import TagElement from '../../../../../../utils/create-tag-element';
import styleCss from './filter-checkbox.module.scss';
import { IFilterInput } from '../interface/filter-input';

export default class FilterCheckbox implements IFilterInput {
  private element: HTMLElement;

  private checkbox: HTMLInputElement;

  private label: string;

  private filters: string[];

  private callback: () => void;

  // constructor(title: string, checked: boolean, callback: () => void) {
  constructor(checkboxLabel: string, filters: string[], callback: () => void = () => {}) {
    this.label = checkboxLabel;
    this.filters = filters;
    this.callback = callback;

    const creator = new TagElement();
    const label = creator.createTagElement('label', [styleCss['filter-checkbox__label']], this.label);
    this.checkbox = creator.createTagElement('input', [styleCss['filter-checkbox']]);
    this.checkbox.setAttribute('type', 'checkbox');
    if (filters.includes(this.label)) {
      this.checkbox.setAttribute('checked', '');
    }
    label.prepend(this.checkbox);

    this.element = label;
  }

  public getElement() {
    return this.element;
  }

  public updateSource() {
    const index = this.filters.indexOf(this.label);
    if (this.checkbox.checked && index < 0) {
      console.log(`Added ${this.label}`);
      this.filters.push(this.label);
    }

    if (!this.checkbox.checked && index >= 0) {
      console.log(`Removed ${this.label}`);
      this.filters.splice(index);
    }

    // this.callback();
  }
}
