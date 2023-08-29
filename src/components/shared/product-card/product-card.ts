import styleCss from './product-card.module.scss';
import Router from '../../router/router';
import DefaultView from '../../view/default-view';
import { ElementParams } from '../../../utils/element-creator';
import TagName from '../../../enum/tag-name';
import ProductApi from '../../../api/products-api';
import TagElement from '../../../utils/create-tag-element';
import { PagePath } from '../../router/pages';
import Strings from './strings';

export default class ProductCard extends DefaultView {
  private router: Router;

  private productKey: string;

  private productApi: ProductApi;

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
    this.getElement().addEventListener('click', () => this.router.navigate(routePath));
  }

  private createProductView() {
    const creator = new TagElement();
    const parent = this.getElement();
    const lang = 'en-US';

    this.productApi.getProductbyKey(this.productKey).then((response) => {
      const { masterVariant } = response.body.masterData.current;
      let url = '';
      if (masterVariant && masterVariant.images) {
        url = masterVariant.images[0].url;
      }
      const image = creator.createTagElement('img', [styleCss['product-card__image']]);
      image.setAttribute('src', url);

      const text = response.body.masterData.current.name[lang] || Strings.Strings.NO_DATA[lang];
      const title = creator.createTagElement('span', [styleCss['product-card__title']], text);

      parent.append(image, title);

      console.log('product:', response);
    });
  }
}
