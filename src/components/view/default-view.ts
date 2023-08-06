import ElementCreator, { ElementParams } from '../../utils/element-creator';

export default class DefaultView {
  private element: HTMLElement;

  private elementCreator: ElementCreator;

  constructor(params: ElementParams) {
    this.elementCreator = this.createView(params);
    this.element = this.elementCreator.getElement();
  }

  public getElement() {
    return this.element;
  }

  public getCreator() {
    return this.elementCreator;
  }

  public createView(params: ElementParams): ElementCreator {
    this.elementCreator = new ElementCreator(params);

    return this.elementCreator;
  }
}
