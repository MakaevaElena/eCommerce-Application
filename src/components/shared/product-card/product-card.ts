import styleCss from './product-card.module.scss';
import Router from '../../router/router';
import DefaultView from '../../view/default-view';
import { ElementParams } from '../../../utils/element-creator';
import TagName from '../../../enum/tag-name';
import ProductApi from '../../../api/products-api';
import TagElement from '../../../utils/create-tag-element';
import { PagePath } from '../../router/pages';
import Strings from './strings';
import ErrorMessage from '../../message/error-message';

type LocalPrices = {
  value: string;
  discount: string;
};

export default class ProductCard extends DefaultView {
  private router: Router;

  private productKey: string;

  private productApi: ProductApi;

  private readonly LANG = 'en-US';

  private readonly COUNTRY = 'US';

  constructor(productKey: string, router: Router) {
    const params: ElementParams = {
      tag: TagName.DIV,
      classNames: [styleCss['product-card'], styleCss['product-card__link']],
      textContent: '',
    };
    super(params);

    this.router = router;
    this.productKey = productKey;
    this.productApi = new ProductApi();

    this.configView();
  }

  private configView() {
    this.setRouteLink();

    this.createProductView();
  }

  private setRouteLink() {
    const routePath = `${PagePath.CATALOG}/${this.productKey}`;
    this.getElement().addEventListener('click', () => this.router.setHref(routePath));
  }

  private createProductView() {
    const creator = new TagElement();
    const parent = this.getElement();

    this.productApi
      .getProductbyKey(this.productKey)
      .then((response) => {
        const { masterVariant } = response.body.masterData.current;

        const url = masterVariant.images ? masterVariant.images[0].url : '';
        const image = creator.createTagElement('img', [styleCss['product-card__image']]);
        image.setAttribute('src', url);
        parent.append(image);

        const wrapper = creator.createTagElement('div', [styleCss['product-card__content-wrapper']]);
        parent.append(wrapper);

        const titleText = response.body.masterData.current.name[this.LANG] || Strings.Strings.NO_DATA[this.LANG];
        const title = creator.createTagElement('span', [styleCss['product-card__title']], titleText);
        wrapper.append(title);

        if (response.body.masterData.current.description) {
          const descriptionText = response.body.masterData.current.description[this.LANG];
          const description = creator.createTagElement(
            'span',
            [styleCss['product-card__description']],
            descriptionText
          );
          wrapper.append(description);
        }

        const pricesWrapper = creator.createTagElement('span', [styleCss['product-card__prices-wrapper']]);
        const getLocalPrices = (): LocalPrices => {
          const localPrices = {
            value: '',
            discount: '',
          };
          const { prices } = masterVariant;
          if (prices) {
            const locals = prices.filter((item) => item.country === this.COUNTRY);
            if (locals.length > 0) {
              const { value } = locals[0];
              localPrices.value = `${(value.centAmount / 100).toFixed(value.fractionDigits)}${value.currencyCode}`;
              const { discounted } = locals[0];
              if (discounted?.value) {
                localPrices.discount = `${(discounted.value.centAmount / 100).toFixed(
                  discounted.value.fractionDigits
                )}${discounted.value.currencyCode}`;
              }
            }
          }
          return localPrices;
        };
        const price = getLocalPrices();
        const priceElement = creator.createTagElement('span', [styleCss['product-card__price']], price.value);
        pricesWrapper.append(priceElement);
        if (price.discount) {
          priceElement.classList.add(styleCss['product-card__price_discounted']);
          const discountElement = creator.createTagElement(
            'span',
            [styleCss['product-card__discount']],
            price.discount
          );
          pricesWrapper.append(discountElement);
        }
        wrapper.append(pricesWrapper);
      })
      .catch((error) => {
        new ErrorMessage().showMessage(error.message);
        this.getElement().remove(); // TODO add retry to get a card's info insteed
      });
  }
}
