import styleCss from './image-button.module.scss';
import { ElementParams } from '../../../utils/element-creator';
import DefaultView from '../../view/default-view';
import TagName from '../../../enum/tag-name';
import TagElement from '../../../utils/create-tag-element';

export default class ImageButton extends DefaultView {
  private image: HTMLElement;

  private counter: HTMLElement;

  constructor(callback?: () => void, style?: string) {
    const elementParams: ElementParams = {
      tag: TagName.A,
      textContent: '',
      classNames: [styleCss['image-button']],
    };

    super(elementParams);

    if (callback) {
      this.getElement().addEventListener('click', callback);
    }

    this.counter = this.createCounter();

    this.image = this.createImageElement();

    if (style) {
      this.setImage(style);
    }

    this.configView();
  }

  public disableButton() {
    this.getElement().classList.add(styleCss['image-button_disabled']);
  }

  public enableButton() {
    this.getElement().classList.remove(styleCss['image-button_disabled']);
  }

  public hideButton() {
    this.getElement().classList.add(styleCss.hide);
  }

  public showButton() {
    this.getElement().classList.remove(styleCss.hide);
  }

  public setCounterValue(value?: string) {
    if (value) {
      this.counter.innerHTML = value;
      this.counter.classList.remove(styleCss.hide);
    } else {
      this.counter.innerHTML = '';
      this.counter.classList.add(styleCss.hide);
    }
  }

  public getImageElement() {
    return this.image;
  }

  public setImage(style: string) {
    this.image.classList.add(style);
  }

  private configView() {
    this.setCounterValue();

    this.getElement().append(this.image, this.counter);
  }

  private createImageElement() {
    this.image = new TagElement().createTagElement('div', [styleCss['image-button__image']]);

    return this.image;
  }

  private createCounter() {
    this.counter = new TagElement().createTagElement('div', [styleCss['image-button__counter']]);

    return this.counter;
  }
}
