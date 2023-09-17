import { ProductProjection, ProductVariant } from '@commercetools/platform-sdk';
import styleCss from './product-card.module.scss';
import Router from '../../router/router';
import { ElementParams } from '../../../utils/element-creator';
import TagName from '../../../enum/tag-name';
import TagElement from '../../../utils/create-tag-element';
import { PagePath } from '../../router/pages';
import Strings from './strings';
import DefaultView from '../../view/default-view';
import SliderPopup from './slider-popup/slider-popup';
import TotalApi from '../../../api/total-api';
import LocalStorageKeys from '../../../enum/local-storage-keys';
import ErrorMessage from '../../message/error-message';
import InfoMessage from '../../message/info-message';
import Observer from '../../../observer/observer';
import EventName from '../../../enum/event-name';

type LocalPrices = {
  value: string;
  discount: string;
};

export default class ProductCard extends DefaultView {
  private readonly URL_NO_IMAGE = '';

  private readonly LANG = 'en-US';

  private readonly COUNTRY = 'US';

  private router: Router;

  private product: ProductProjection;

  private api: TotalApi;

  private creator = new TagElement();

  private buttonAddToCart: HTMLElement;

  private buttonRemoveFromCart: HTMLElement;

  private observer = Observer.getInstance();

  constructor(product: ProductProjection, router: Router, api: TotalApi) {
    const params: ElementParams = {
      tag: TagName.DIV,
      classNames: [styleCss['product-card'], styleCss['product-card__link']],
      textContent: '',
    };
    super(params);

    this.product = product;
    this.router = router;
    this.api = api;

    this.buttonAddToCart = this.createButtonAddToCart();
    this.buttonRemoveFromCart = this.createButtonRemoveFromCart();
    this.hideCartButton(this.buttonRemoveFromCart);

    this.configView();
  }

  public getProductId() {
    return this.product.id;
  }

  public setProductInCart(value: boolean) {
    if (value) {
      this.disableCartButton(this.buttonAddToCart);
      this.showCartButton(this.buttonRemoveFromCart);
    } else {
      this.enableCartButton(this.buttonAddToCart);
      this.hideCartButton(this.buttonRemoveFromCart);
    }
  }

  private disableCartButton(button: HTMLElement) {
    button.classList.add(styleCss['card-button_disabled']);
  }

  private enableCartButton(button: HTMLElement) {
    button.classList.remove(styleCss['card-button_disabled']);
  }

  private hideCartButton(button: HTMLElement) {
    button.classList.add(styleCss['card-button_hide']);
  }

  private showCartButton(button: HTMLElement) {
    button.classList.remove(styleCss['card-button_hide']);
  }

  private getImagesUrl() {
    const imagesUrl = this.product.masterVariant?.images?.map((image) => image.url) || [];

    return imagesUrl;
  }

  private addProductHandler(e: MouseEvent) {
    e.stopPropagation();

    const { sku } = this.product.masterVariant;
    if (!sku) {
      new ErrorMessage().showMessage(Strings.Strings.SKU_NOT_AVAILABLE[this.LANG]);
      return;
    }

    this.checkCartExistAndAddProduct(sku);
  }

  private checkCartExistAndAddProduct(sku: string) {
    this.api
      .getClientApi()
      .getActiveCart()
      .then((cart) => {
        const cartId = cart.body.id;
        this.addProductToCart(cartId, sku);
        localStorage.setItem(LocalStorageKeys.ANONIM_CART_ID, cartId);
      })
      .catch(() => {
        this.api
          .getClientApi()
          .createCustomerCart()
          .then((cart) => {
            const cartId = cart.body.id;
            localStorage.setItem(LocalStorageKeys.ANONIM_CART_ID, cartId);
            this.addProductToCart(cartId, sku);
          })
          .catch((error) => {
            if (error instanceof Error) {
              new ErrorMessage().showMessage(error.message);
            }
          });
      })
      .catch((error) => {
        if (error instanceof Error) {
          new ErrorMessage().showMessage(error.message);
        }
      });
  }

  private addProductToCart(cardId: string, sku: string) {
    this.api
      .getClientApi()
      .getCartByCartID(cardId)
      .then((responce) => {
        this.api
          .getClientApi()
          .addItemToCartByID(cardId, responce.body.version, sku)
          .then(() => {
            new InfoMessage().showMessage(Strings.Strings.PRODUCT_ADDED[this.LANG]);
            this.observer.notify(EventName.ADD_TO_CART);
            this.observer.notify(EventName.UPDATE_CART);
          });
      })
      .catch((error) => {
        if (error instanceof Error) {
          new ErrorMessage().showMessage(error.message);
        }
      });
  }

  private removeProductHandler(e: MouseEvent) {
    e.stopPropagation();

    this.api
      .getClientApi()
      .getActiveCart()
      .then((cart) => {
        const cartId = cart.body.id;
        this.removeProductFromCart(cartId);
        localStorage.setItem(LocalStorageKeys.ANONIM_CART_ID, cartId);
      })
      .catch((error) => {
        if (error instanceof Error) {
          new ErrorMessage().showMessage(error.message);
        }
      });
  }

  private removeProductFromCart(cartID: string) {
    this.api
      .getClientApi()
      .getCartByCartID(cartID)
      .then((responce) => {
        const lineItems = responce.body.lineItems.filter((lineItem) => lineItem.productKey === this.product.key);
        const lineItemId = lineItems[0].id;
        this.api
          .getClientApi()
          .removeLineItem(cartID, responce.body.version, lineItemId)
          .then(() => {
            new InfoMessage().showMessage(Strings.Strings.PRODUCT_REMOVED[this.LANG]);
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

  private createButtonAddToCart() {
    this.buttonAddToCart = this.creator.createTagElement('div', [styleCss['card-button'], styleCss['button-add']], '+');
    this.buttonAddToCart.addEventListener('click', this.addProductHandler.bind(this));

    return this.buttonAddToCart;
  }

  private createButtonRemoveFromCart() {
    this.buttonRemoveFromCart = this.creator.createTagElement(
      'div',
      [styleCss['card-button'], styleCss['button-remove']],
      '-'
    );
    this.buttonRemoveFromCart.addEventListener('click', this.removeProductHandler.bind(this));

    return this.buttonRemoveFromCart;
  }

  private configView() {
    this.setRouteLink();

    this.createProductView();
  }

  private setRouteLink() {
    const routePath = `${PagePath.CATALOG}/${this.product.key}`;
    this.getElement().addEventListener('click', () => this.router.setHref(routePath));
  }

  private createProductView() {
    const parent = this.getElement();

    const { masterVariant } = this.product;

    const image = this.getImageElement(masterVariant);

    const wrapper = this.creator.createTagElement('div', [styleCss['product-card__content-wrapper']]);
    parent.append(image, this.buttonRemoveFromCart, this.buttonAddToCart, wrapper);

    const title = this.getTitleElement();
    const description = this.getDescriptionElement();
    const prices = this.getPricesElement(masterVariant);
    wrapper.append(title, description, prices);
  }

  private getPricesElement(masterVariant: ProductVariant) {
    const pricesWrapper = this.creator.createTagElement('span', [styleCss['product-card__prices-wrapper']]);

    const price = this.getLocalPrices(masterVariant);

    const priceElement = this.creator.createTagElement('span', [styleCss['product-card__price']], price.value);
    pricesWrapper.append(priceElement);

    if (price.discount) {
      priceElement.classList.add(styleCss['product-card__price_discounted']);
      const discountElement = this.creator.createTagElement(
        'span',
        [styleCss['product-card__discount']],
        price.discount
      );
      pricesWrapper.append(discountElement);
    }
    return pricesWrapper;
  }

  private getDescriptionElement() {
    const descriptionText = this.product.description?.[this.LANG] || Strings.Strings.EMPTY_TEXT[this.LANG];
    const description = this.creator.createTagElement('span', [styleCss['product-card__description']], descriptionText);

    return description;
  }

  private getTitleElement() {
    const titleText = this.product.name[this.LANG] || Strings.Strings.NO_DATA[this.LANG];
    const title = this.creator.createTagElement('span', [styleCss['product-card__title']], titleText);
    return title;
  }

  private getImageElement(masterVariant: ProductVariant) {
    const url = masterVariant.images ? masterVariant.images[0].url : this.URL_NO_IMAGE;
    const image = this.creator.createTagElement('img', [styleCss['product-card__image']]);
    image.setAttribute('src', url);
    image.addEventListener('click', this.showSliderPopup.bind(this));

    return image;
  }

  private showSliderPopup(e: Event) {
    e.stopPropagation();
    const imagesUrl = this.getImagesUrl();
    const swiper = new SliderPopup(imagesUrl);
    document.body.append(swiper.getElement());
  }

  private getLocalPrices(masterVariant: ProductVariant): LocalPrices {
    const localPrices = {
      value: '',
      discount: '',
    };
    const { prices } = masterVariant;
    if (prices) {
      const locals = prices.filter((item) => item.country === this.COUNTRY);
      if (locals.length > 0) {
        const { value } = locals[0];
        localPrices.value = `${(value.centAmount / 100).toFixed(value.fractionDigits)} ${value.currencyCode}`;
        const { discounted } = locals[0];
        if (discounted?.value) {
          localPrices.discount = `${(discounted.value.centAmount / 100).toFixed(discounted.value.fractionDigits)} ${
            discounted.value.currencyCode
          }`;
        }
      }
    }
    return localPrices;
  }
}
