import styleCss from './product-card.module.scss';
import Router from '../../router/router';
import DefaultView from '../../view/default-view';
import { ElementParams } from '../../../utils/element-creator';
import TagName from '../../../enum/tag-name';
import ProductApi from '../../../api/products-api';
import TagElement from '../../../utils/create-tag-element';

// enum Strings {
//   NO_DATA = {
//     ru: 'н/д',
//     en: 'n/a'
//   }
// }

export default class ProductCard extends DefaultView {
  private router: Router;

  private productKey: string;

  private productApi: ProductApi;

  constructor(productKey: string, router: Router) {
    const params: ElementParams = {
      tag: TagName.DIV,
      classNames: [styleCss['product-card']],
      textContent: '',
    };
    super(params);

    this.router = router;
    this.productKey = productKey;
    this.productApi = new ProductApi();

    this.configView();
  }

  private configView() {
    this.showProduct();
  }

  private showProduct() {
    const creator = new TagElement();
    this.productApi.getProductbyKey(this.productKey).then((response) => {
      const { masterVariant } = response.body.masterData.current;
      let url = '';
      if (masterVariant && masterVariant.images) {
        url = masterVariant.images[0].url;
      }
      const image = creator.createTagElement('img', [styleCss['product-card__image']]);
      image.setAttribute('src', url);
      console.log('image: ', image);
      // let title = Strings.NO_DATA.ru;
      // console.log('title: ', title);
      // if (response.body.masterData.current.metaDescription) {
      //   const title = response.body.masterData.current.metaDescription?.;
      // }
      console.log('product:', response);
    });
  }
}
