import TagElement from '../../../utils/create-tag-element';
import ElementCreator from '../../../utils/element-creator';
import html from './spinner.html';
import './spinner.css';
import Observer from '../../../observer/observer';
import EventName from '../../../enum/event-name';

export default class Spinner {
  private element: HTMLElement;

  constructor() {
    const active = ElementCreator.ElementFromHTML(html);
    this.element = new TagElement().createTagElement('div', ['spinner']);
    this.element.append(active);

    Observer.getInstance().subscribe(EventName.SPINNER_SHOW, this.showSpinner.bind(this));
    Observer.getInstance().subscribe(EventName.SPINNER_HIDE, this.hideSpinner.bind(this));
  }

  public getElement() {
    return this.element;
  }

  private showSpinner() {
    this.getElement().classList.remove('spinner_hide');
  }

  private hideSpinner() {
    this.getElement().classList.add('spinner_hide');
  }
}
