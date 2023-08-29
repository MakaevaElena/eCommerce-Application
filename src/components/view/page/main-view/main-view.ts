import ProductApi from '../../../../api/client-api';
import TagName from '../../../../enum/tag-name';
import { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import DefaultView from '../../default-view';
import styleCss from './main-view.module.scss';

export default class MainView extends DefaultView {
  private anonimApi: ProductApi;

  constructor() {
    const params: ElementParams = {
      tag: TagName.MAIN,
      classNames: Object.values(styleCss),
      textContent: 'MainView',
    };
    super(params);

    this.anonimApi = new ProductApi();
    this.configView();
  }

  private configView() {
    // throw new Error(`configView() for ${this.getElement()} not implemented`);
    this.getAllProducts();
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }

  // получить все товары
  private getAllProducts() {
    this.anonimApi.getProducts().then((response) => {
      if (response.body.results) {
        // results[i]
        // console.log('key', response.body.results[15].key);
        // console.log('image', response.body.results[15].masterData.current.masterVariant.images?.[0].url);
        // console.log('name', response.body.results[15].masterData.current.name.en);
        // почему то порядок аттрибутов отличается у товаров (
        // console.log('developer', response.body.results[15].masterData.current.masterVariant.attributes?.[0].value[0]);
        // console.log(
        //   'platform',
        //   response.body.results[15].masterData.current.masterVariant.attributes?.[2].value[0].key
        // );
        // console.log('genre', response.body.results[15].masterData.current.masterVariant.attributes?.[3].value[0].key);
        // console.log('description', response.body.results[15].masterData.current.description?.en);
        // console.log('price', response.body.results[15].masterData.current.masterVariant.prices?.[0].value?.centAmount);
        // console.log(
        //   'valute',
        //   response.body.results[8].masterData.current.masterVariant.prices?.[0].value?.currencyCode
        // );
        // console.log(
        //   'discountPrice',
        //   response.body.results[8].masterData.current.masterVariant.prices?.[0].discounted?.value?.centAmount
        // );
        // не у всех товаров все есть, я дозаведу, но на данный момент может не быть цены или description?.en
      }
    });
  }
}
