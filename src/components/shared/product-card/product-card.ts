import { Product, ProductVariant } from '@commercetools/platform-sdk';
import styleCss from './product-card.module.scss';
import Router from '../../router/router';
import DefaultView from '../../view/default-view';
import { ElementParams } from '../../../utils/element-creator';
import TagName from '../../../enum/tag-name';
import TagElement from '../../../utils/create-tag-element';
import { PagePath } from '../../router/pages';
import Strings from './strings';

type LocalPrices = {
  value: string;
  discount: string;
};

export default class ProductCard extends DefaultView {
  private readonly URL_NO_IMAGE = '';

  private readonly LANG = 'en-US';

  private readonly COUNTRY = 'US';

  private router: Router;

  private product: Product;

  private creator = new TagElement();

  constructor(product: Product, router: Router) {
    const params: ElementParams = {
      tag: TagName.DIV,
      classNames: [styleCss['product-card'], styleCss['product-card__link']],
      textContent: '',
    };
    super(params);

    this.product = product;
    this.router = router;

    this.configView();
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

    const { masterVariant } = this.product.masterData.current;

    const image = this.getImageElement(masterVariant);
    const wrapper = this.creator.createTagElement('div', [styleCss['product-card__content-wrapper']]);
    parent.append(image, wrapper);

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
    const descriptionText =
      this.product.masterData.current.description?.[this.LANG] || Strings.Strings.EMPTY_TEXT[this.LANG];
    const description = this.creator.createTagElement('span', [styleCss['product-card__description']], descriptionText);

    return description;
  }

  private getTitleElement() {
    const titleText = this.product.masterData.current.name[this.LANG] || Strings.Strings.NO_DATA[this.LANG];
    const title = this.creator.createTagElement('span', [styleCss['product-card__title']], titleText);
    return title;
  }

  private getImageElement(masterVariant: ProductVariant) {
    const url = masterVariant.images ? masterVariant.images[0].url : this.URL_NO_IMAGE;
    const image = this.creator.createTagElement('img', [styleCss['product-card__image']]);
    image.setAttribute('src', url);
    return image;
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
