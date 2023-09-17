import { Cart, ClientResponse, LineItem } from '@commercetools/platform-sdk';
import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import ElementCreator, { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import Router from '../../../router/router';
import DefaultView from '../../default-view';
import styleCss from './cart-view.module.scss';
import ErrorMessage from '../../../message/error-message';
// eslint-disable-next-line import/no-named-as-default
import CartItem from './cart-item';
import LocalStorageKeys from '../../../../enum/local-storage-keys';
import Observer from '../../../../observer/observer';
import EventName from '../../../../enum/event-name';

import TotalApi from '../../../../api/total-api';
import ApiType from '../../../app/type';

import { LinkName, PagePath } from '../../../router/pages';
import LinkButton from '../../../shared/link-button/link-button';

export default class CartView extends DefaultView {
  private router: Router;

  private wrapper: HTMLDivElement;

  private api: TotalApi;

  private observer = Observer.getInstance();

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

  private itemsWrapper = new ElementCreator({
    tag: TagName.DIV,
    classNames: [styleCss['cart-items-wrapper']],
    textContent: '',
  });

  private cartItem: CartItem;

  private anonimCartID = localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID);

  constructor(router: Router, paramApi: ApiType) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['cart-view']],
      textContent: '',
    };
    super(params);

    this.api = paramApi.api;

    this.router = router;

    this.wrapper = new TagElement().createTagElement('div', [styleCss['content-wrapper']]);

    this.cartItem = new CartItem(router, this.itemsWrapper, this.api);

    this.observer.subscribe(EventName.TOTAL_COST_CHANGED, this.updateTotalSumm.bind(this));

    this.getCreator().addInnerElement(this.wrapper);

    if (!this.anonimCartID) {
      this.createAnonimCart();
    }

    this.configView();
  }

  private configView() {
    const anonimCartID = localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID);

    if (anonimCartID)
      this.api
        .getClientApi()
        .getCartByCartID(anonimCartID)
        .then(async (cartResponse) => {
          if (cartResponse.body.lineItems.length > 0) {
            this.createCartHeader();
            cartResponse.body.lineItems.forEach(async (item) => {
              const lineItemData = cartResponse.body.lineItems.filter(
                (lineItem) => lineItem.productKey === item.productKey
              );
              if (item.productKey) await this.cartItem.createCartItem(item.productKey, lineItemData);
            });
          }

          // const totalPrice = `${(Number(cartResponse.body.totalPrice.centAmount) / 100).toFixed(2)} ${
          //   cartResponse.body.totalPrice.currencyCode
          // }`;

          // return totalPrice;
          return cartResponse;
        })
        .then((cartResponse) => {
          this.cartSection.addInnerElement(this.itemsWrapper);
          this.wrapper.append(this.cartSection.getElement());
          return cartResponse;
        })
        .then((cartResponse) => {
          this.updateTotalSumm();
          return cartResponse;
        })
        .then((cartResponse) => {
          this.createPromo(cartResponse);
          return cartResponse;
        })
        // .then((cartResponse) => this.createClearCartButton(cartResponse))
        .catch((error) => new ErrorMessage().showMessage(error.message));
  }

  private createClearCartButton(cartResponse: ClientResponse<Cart>) {
    const anonimCartID = localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID);

    if (anonimCartID && cartResponse.body.lineItems.length > 0) {
      const button = new LinkButton('CLEAR CART', () => {
        cartResponse.body.lineItems.forEach((item) => this.removeItem(item));
      });

      this.cartSection.addInnerElement(button.getElement());
    }
  }

  private removeItem(item: LineItem) {
    if (item.productKey) this.removeProductHandler(item.id);
    this.itemsWrapper.getElement().innerHTML = '';
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
      textContent: 'Exciting games are here',
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

    if (!totalPrice || totalPrice === '0.00 USD') {
      this.showEmptyCart();
    }
  }

  private createPromo(cartResponse: ClientResponse<Cart>) {
    this.totalCost.getElement().innerHTML = '';
    this.totalCost.getElement().remove();

    const promo = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-promo']],
      textContent: '',
    });

    const promoTitle = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-promo__title']],
      textContent: 'PROMO CODE: ',
    });

    const promoInputBox = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-promo__input-box']],
      textContent: '',
    });

    const promoInput = new TagElement().createTagElement('input', [styleCss['cart-promo__input']]);

    const promoApplyButtonBox = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['cart-promo__apply-button-box'], styleCss.button],
      textContent: '',
    });

    const applyButton = new LinkButton('Apply PROMO', () => {
      if (promoInput instanceof HTMLInputElement) {
        this.applyPromo(promoInput.value);
        applyButton.disableButton();
        applyButton.getElement().textContent = 'PROMO applied';
      }
    });

    if (cartResponse.body.discountCodes.length > 0) {
      applyButton.disableButton();
      applyButton.getElement().textContent = 'PROMO applied';
    }

    promo.addInnerElement(promoTitle);
    promoInputBox.addInnerElement(promoInput);
    promo.addInnerElement(promoInputBox);
    promoApplyButtonBox.addInnerElement(applyButton.getElement());
    promo.addInnerElement(promoApplyButtonBox);
    this.cartSection.addInnerElement(promo);
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }

  private applyPromo(promoCode: string) {
    const anonimCartID = localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID);
    if (anonimCartID)
      this.api
        .getClientApi()
        .getCartByCartID(anonimCartID)
        .then((cartResponse) => {
          this.api
            .getClientApi()
            .updateCartWithDiscount(anonimCartID, cartResponse.body.version, promoCode)
            .then(() => {
              this.updateTotalSumm();
              this.observer.notify(EventName.UPDATE_CART);
            })
            .catch((error) => {
              if (error instanceof Error) {
                new ErrorMessage().showMessage(error.message);
              }
            });
        });
  }

  private updateTotalSumm() {
    const anonimCartID = localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID);
    if (anonimCartID)
      this.api
        .getClientApi()
        .getCartByCartID(anonimCartID)
        .then((cartResponse) => {
          // console.log('cartResponse', cartResponse);
          const totalPrice = `${(Number(cartResponse.body.totalPrice.centAmount) / 100).toFixed(2)} ${
            cartResponse.body.totalPrice.currencyCode
          }`;
          this.createTotalOrderValue(totalPrice);
          this.createClearCartButton(cartResponse);
        })
        .catch((error) => {
          if (error instanceof Error) {
            new ErrorMessage().showMessage(error.message);
          }
        });
  }

  private createAnonimCart() {
    if (!localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID)) {
      this.api
        .getClientApi()
        .createCart()
        .then((cartResponse) => {
          localStorage.setItem(LocalStorageKeys.ANONIM_CART_ID, `${cartResponse.body.id}`);
          this.configView();
        })
        .catch((error) => {
          if (error instanceof Error) {
            new ErrorMessage().showMessage(error.message);
          }
        });
    }
  }

  private removeProductHandler(id: string) {
    this.api
      .getClientApi()
      .getActiveCart()
      .then((cart) => {
        const cartId = cart.body.id;
        this.removeProductFromCart(cartId, id);
        localStorage.setItem(LocalStorageKeys.ANONIM_CART_ID, cartId);
      })
      .catch((error) => {
        if (error instanceof Error) {
          new ErrorMessage().showMessage(error.message);
        }
      });
  }

  private removeProductFromCart(cartID: string, lineItemId: string) {
    this.api
      .getClientApi()
      .getCartByCartID(cartID)
      .then((responce) => {
        // const lineItems = responce.body.lineItems.filter((lineItem) => lineItem.productKey === key);
        // const lineItemId = lineItems[0].id;
        this.api
          .getClientApi()
          .removeLineItem(cartID, responce.body.version, lineItemId)
          .then(() => {
            this.updateTotalSumm();
            this.observer.notify(EventName.REMOVE_FROM_CART);
            this.observer.notify(EventName.UPDATE_CART);
          });
      })
      .catch((error) => {
        if (error instanceof Error) {
          new ErrorMessage().showMessage(error.message);
        }
      });
  }
}
