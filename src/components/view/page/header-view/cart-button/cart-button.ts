import styleCss from './cart-button.module.scss';
import { ElementParams } from '../../../../../utils/element-creator';
import DefaultView from '../../../default-view';
import TagName from '../../../../../enum/tag-name';
import TagElement from '../../../../../utils/create-tag-element';
import Observer from '../../../../../observer/observer';
import EventName from '../../../../../enum/event-name';

export default class CartButton extends DefaultView {
  private counter: HTMLElement;

  constructor(callback?: () => void) {
    const elementParams: ElementParams = {
      tag: TagName.A,
      textContent: '',
      classNames: [styleCss['cart-button']],
    };

    super(elementParams);

    Observer.getInstance().subscribe(EventName.UPDATE_CART, this.updateCart.bind(this));

    if (callback) {
      this.getElement().addEventListener('click', callback);
    }

    this.counter = this.createCounter();
    this.configView();
  }

  public hideButton() {
    this.getElement().classList.add(styleCss.hide);
  }

  public showButton() {
    this.getElement().classList.remove(styleCss.hide);
  }

  public setCounterValue(quantity: number) {
    if (quantity) {
      this.counter.innerHTML = quantity > 99 ? '99+' : quantity.toString();
      this.counter.classList.remove(styleCss.hide);
    } else {
      this.counter.innerHTML = '';
      this.counter.classList.add(styleCss.hide);
    }
  }

  private updateCart() {
    // TO DO ask quantity of products in cart
    this.setCounterValue(0);
  }

  private configView() {
    this.updateCart();

    const imageElement = new TagElement().createTagElement('div', [styleCss['cart-button__image']]);

    this.getElement().append(imageElement, this.counter);
  }

  private createCounter() {
    this.counter = new TagElement().createTagElement('div', [styleCss['cart-button__counter']]);

    return this.counter;
  }

  private disableButton() {
    this.getElement().classList.add(styleCss['cart-button_disabled']);
  }
}
