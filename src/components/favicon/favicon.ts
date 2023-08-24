import html from './favicon.html';
import ElementCreator from '../../utils/element-creator';

export default class Favicon {
  private element: DocumentFragment;

  private readonly template: string;

  constructor() {
    this.template = html;
    this.element = this.createElement();
  }

  public getElement(): DocumentFragment {
    return this.element;
  }

  private createElement(): DocumentFragment {
    return ElementCreator.ElementFromHTML(this.template);
  }
}
