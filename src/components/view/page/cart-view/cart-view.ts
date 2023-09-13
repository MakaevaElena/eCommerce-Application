import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import ElementCreator, { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import Router from '../../../router/router';
import DefaultView from '../../default-view';
import styleCss from './cart-view.module.scss';
import ClientApi from '../../../../api/client-api';
import ErrorMessage from '../../../message/error-message';
// eslint-disable-next-line import/no-named-as-default
import CartItem from './cart-item';
import LocalStorageKeys from '../../../../enum/local-storage-keys';
import Observer from '../../../../observer/observer';
import EventName from '../../../../enum/event-name';

export default class CartView extends DefaultView {
  private router: Router;

  private wrapper: HTMLDivElement;

  private anonimApi: ClientApi;

  private observer: Observer;

  private cartSection = new ElementCreator({
    tag: TagName.SECTION,
    classNames: [styleCss['cart-section']],
    textContent: '',
  });

  private orderTotalCost = new ElementCreator({
    tag: TagName.DIV,
    classNames: [styleCss['cart-total-cost__value']],
    textContent: ``,
  });

  private cartItem: CartItem;

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['cart-view']],
      textContent: '',
    };
    super(params);

    this.router = router;

    this.wrapper = new TagElement().createTagElement('div', [styleCss['content-wrapper']]);

    this.anonimApi = new ClientApi();

    this.cartItem = new CartItem(router, this.cartSection, this.anonimApi);

    this.observer = Observer.getInstance();
    this.observer = Observer.getInstance();
    this.observer?.subscribe(EventName.TOTAL_COST_CHANGED, this.updateTotalSumm.bind(this));

    this.getCreator().addInnerElement(this.wrapper);
    this.configView();
  }

  private configView() {
    this.createCartHeader();
    const anonimCartID = localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID);
    if (anonimCartID)
      this.anonimApi
        .getCartByCartID(anonimCartID)
        .then((cartResponse) => {
          cartResponse.body.lineItems.forEach((item) => {
            const lineItemData = cartResponse.body.lineItems.filter(
              (lineItem) => lineItem.productKey === item.productKey
            );
            if (item.productKey) this.cartItem.createCartItem(item.productKey, lineItemData);
          });

          const totalPrice = `${(Number(cartResponse.body.totalPrice.centAmount) / 100).toFixed(2)} ${
            cartResponse.body.totalPrice.currencyCode
          }`;
          this.createTotalOrderValue(totalPrice);
        })
        .catch((error) => new ErrorMessage().showMessage(error.message));

    this.wrapper.append(this.cartSection.getElement());
  }

  private createCartHeader() {
    const header = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-header']],
      textContent: '',
    });

    const itemsImageTitle = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-header__image'], styleCss['cart-cell']],
      textContent: '',
    });

    const itemsTitle = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-header__title'], styleCss['cart-cell']],
      textContent: 'Items',
    });

    const itemQuantity = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-header__quantity'], styleCss['cart-cell']],
      textContent: 'Quantity',
    });

    const itemOrderValue = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-header__order-value'], styleCss['cart-cell']],
      textContent: 'Order Value',
    });

    header.addInnerElement(itemsImageTitle);
    header.addInnerElement(itemsTitle);
    header.addInnerElement(itemQuantity);
    header.addInnerElement(itemOrderValue);
    this.cartSection.addInnerElement(header);

    // this.wrapper.append(this.cartSection.getElement());
  }

  private createTotalOrderValue(value: string) {
    const totalCost = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-total-cost']],
      textContent: '',
    });

    const orderTotalCostTitle = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-total-cost__title']],
      textContent: 'TOTAL COST: ',
    });

    this.orderTotalCost.getElement().textContent = `${value}`;

    totalCost.addInnerElement(orderTotalCostTitle);
    totalCost.addInnerElement(this.orderTotalCost);
    this.cartSection.addInnerElement(totalCost);
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }

  // todo версия отстает на 1
  private updateTotalSumm() {
    const anonimCartID = localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID);
    if (anonimCartID)
      this.anonimApi.getCartByCartID(anonimCartID).then((cartResponse) => {
        console.log('cartResponse', cartResponse);
        const totalPrice = `${(Number(cartResponse.body.totalPrice.centAmount) / 100).toFixed(2)} ${
          cartResponse.body.totalPrice.currencyCode
        }`;
        this.orderTotalCost.getElement().textContent = `${totalPrice}`;
        // console.log('cartResponse.body.version', cartResponse.body.version);
        // console.log('totalPrice', totalPrice);
      });
  }
}
