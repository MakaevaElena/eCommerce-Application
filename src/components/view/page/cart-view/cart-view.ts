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
import { LinkName, PagePath } from '../../../router/pages';
import LinkButton from '../../../shared/link-button/link-button';

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

  private totalCost = new ElementCreator({
    tag: TagName.DIV,
    classNames: [styleCss['cart-total-cost']],
    textContent: '',
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

    this.observer?.subscribe(EventName.TOTAL_COST_CHANGED, this.updateTotalSumm.bind(this));

    this.getCreator().addInnerElement(this.wrapper);
    this.configView();
  }

  private configView() {
    const anonimCartID = localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID);
    if (anonimCartID)
      this.anonimApi
        .getCartByCartID(anonimCartID)
        .then(async (cartResponse) => {
          if (cartResponse.body.lineItems.length > 0) {
            this.createCartHeader();
            cartResponse.body.lineItems.forEach((item) => {
              const lineItemData = cartResponse.body.lineItems.filter(
                (lineItem) => lineItem.productKey === item.productKey
              );
              if (item.productKey) this.cartItem.createCartItem(item.productKey, lineItemData);
            });
          }
          const totalPrice = `${(Number(cartResponse.body.totalPrice.centAmount) / 100).toFixed(2)} ${
            cartResponse.body.totalPrice.currencyCode
          }`;
          return totalPrice;
        })
        // .then((totalPrice) => this.createTotalOrderValue(totalPrice))
        .then(async () => this.updateTotalSumm())
        .catch((error) => new ErrorMessage().showMessage(error.message));

    this.wrapper.append(this.cartSection.getElement());
  }

  private showEmptyCart() {
    this.cartSection.getElement().innerHTML = '';

    const emptyCart = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-empty']],
      textContent: '',
    });

    const emptyCartTytle = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-empty__tytle']],
      textContent: 'Your cart is still empty!',
    });

    const emptyCartImage = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-empty__image']],
      textContent: '',
    });

    const emptyCartFirstText = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-empty__first-text']],
      textContent: 'Exciting games here',
    });

    const emptyCartRowImage = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-empty__row-image']],
      textContent: '',
    });

    const linkToCatalog = new LinkButton(LinkName.CATALOG, () => {
      this.router.navigate(PagePath.CATALOG);
    });

    const emptyCartSecondText = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-empty__second-text']],
      textContent: `What are you waiting for? 
                  ...Christmas?`,
    });

    emptyCart.addInnerElement(emptyCartTytle);
    emptyCart.addInnerElement(emptyCartImage);
    emptyCart.addInnerElement(emptyCartFirstText);
    emptyCart.addInnerElement(emptyCartRowImage);
    emptyCart.addInnerElement(linkToCatalog.getElement());
    emptyCart.addInnerElement(emptyCartSecondText);
    this.cartSection.addInnerElement(emptyCart);
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
  }

  private createTotalOrderValue(totalPrice: string) {
    this.totalCost.getElement().innerHTML = '';
    this.totalCost.getElement().remove();

    const orderTotalCostTitle = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-total-cost__title']],
      textContent: 'TOTAL COST: ',
    });

    this.orderTotalCost.getElement().textContent = `${totalPrice}`;

    this.totalCost.addInnerElement(orderTotalCostTitle);
    this.totalCost.addInnerElement(this.orderTotalCost);
    this.cartSection.addInnerElement(this.totalCost);

    if (totalPrice === '0.00 USD') {
      this.showEmptyCart();
    }
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }

  private async updateTotalSumm() {
    const anonimCartID = localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID);
    if (anonimCartID)
      await this.anonimApi.getCartByCartID(anonimCartID).then((cartResponse) => {
        const totalPrice = `${(Number(cartResponse.body.totalPrice.centAmount) / 100).toFixed(2)} ${
          cartResponse.body.totalPrice.currencyCode
        }`;
        this.createTotalOrderValue(totalPrice);
      });
  }
}
