import TagName from '../enum/tag-name';

export type ElementParams = {
  tag: TagName;
  classNames: Array<string>;
  textContent: string;
};

export type InsertableElement = HTMLElement | DocumentFragment | ElementCreator;

export default class ElementCreator {
  private element: HTMLElement;

  constructor(params: ElementParams) {
    this.element = this.createElement(params);
  }

  static ElementFromHTML(html: string): DocumentFragment {
    const template: HTMLTemplateElement = document.createElement('template');
    template.innerHTML = html;
    const element: DocumentFragment = template.content;

    return element;
  }

  public getElement() {
    return this.element;
  }

  public addInnerElement(element: InsertableElement) {
    if (element instanceof ElementCreator) {
      this.element.append(element.getElement());
    } else {
      this.element.append(element);
    }
  }

  public clearInnerContent() {
    this.element.replaceChildren('');
  }

  private createElement(params: ElementParams): HTMLElement {
    this.element = document.createElement(params.tag);

    this.setCssClasses(params.classNames);

    this.setTextContent(params.textContent);

    return this.element;
  }

  private setCssClasses(cssClasses: Array<string>) {
    this.element.classList.add(...cssClasses);
  }

  private setTextContent(text: string) {
    if (text) {
      this.element.textContent = text;
    }
  }
}
