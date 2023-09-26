import TagElement from '../../../utils/create-tag-element';
import styleCss from './number-input.module.scss';

export default class NumberInput {
  private element: HTMLElement;

  private input: HTMLInputElement;

  constructor(inputLabel: string, placeholder?: string) {
    const creator = new TagElement();
    this.element = creator.createTagElement('label', [styleCss['number-input__label']], inputLabel);
    this.input = creator.createTagElement('input', [styleCss['number-input']]);
    this.input.setAttribute('type', 'number');
    this.input.setAttribute('step', '0.01');
    this.element.setAttribute('placeholder', placeholder || '');

    this.element.append(this.input);
  }

  public getElement() {
    return this.element;
  }

  public set value(value) {
    this.input.value = value;
  }

  public get value() {
    return this.input.value;
  }

  public setPlaceholder(placeholder: string) {
    this.element.setAttribute('placeholder', placeholder);
  }
}
