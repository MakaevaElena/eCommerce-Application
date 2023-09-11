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

  private creator = new TagElement();

  private buttonAddToCart: HTMLElement;

  private buttonRemoveFromCart: HTMLElement;

  constructor(product: ProductProjection, router: Router) {
    const params: ElementParams = {
      tag: TagName.DIV,
      classNames: [styleCss['product-card'], styleCss['product-card__link']],
      textContent: '',
    };
    super(params);

    this.product = product;

    this.router = router;

    this.buttonAddToCart = this.createButtonAddToCart();
    this.buttonRemoveFromCart = this.createButtonRemoveFromCart();

    this.configView();
  }

  public getProduct() {
    return this.product;
  }

  public setProductInCart(value: boolean) {
    if (value) {
      this.buttonAddToCart.classList.remove(styleCss['card-button_disabled']);
      this.buttonRemoveFromCart.classList.add(styleCss['card-button_hide']);
    } else {
      this.buttonAddToCart.classList.add(styleCss['card-button_disabled']);
      this.buttonRemoveFromCart.classList.remove(styleCss['card-button_hide']);
    }
  }

  private getImagesUrl() {
    const imagesUrl = this.product.masterVariant?.images?.map((image) => image.url) || [];

    return imagesUrl;
  }

  private createButtonAddToCart() {
    this.buttonAddToCart = this.creator.createTagElement('div', [styleCss['card-button'], styleCss['button-add']], '+');

    return this.buttonAddToCart;
  }

  private createButtonRemoveFromCart() {
    this.buttonRemoveFromCart = this.creator.createTagElement(
      'div',
      [styleCss['card-button'], styleCss['button-remove']],
      '-'
    );

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

    return image;
  }

  private showSliderPopup() {
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
