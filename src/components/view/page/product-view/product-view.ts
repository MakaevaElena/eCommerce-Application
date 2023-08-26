import ClientApi from '../../../../api/client-api';
import TagName from '../../../../enum/tag-name';
import ElementCreator, { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import { LinkName, PagePath } from '../../../router/pages';
import Router from '../../../router/router';
import LinkButton from '../../../shared/link-button/link-button';
import DefaultView from '../../default-view';
import styleCss from './product-view.module.scss';
import CreateTagElement from '../../../../utils/create-tag-element';

export default class ProductView extends DefaultView {
  private router: Router;

  private productId: string = '';

  private wrapper: HTMLDivElement;

  anonimApi: ClientApi;

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['product-view']],
      textContent: '',
    };
    super(params);
    // this.router = router;
    // this.observer = Observer.getInstance();
    this.anonimApi = new ClientApi();

    // this.productKey = window.location.hash;
    this.getProducts();

    this.router = router;

    this.wrapper = new CreateTagElement().createTagElement('div', [styleCss['content-wrapper']]);

    this.getCreator().addInnerElement(this.wrapper);
  }

  public initContent(productId?: string) {
    if (productId) {
      this.productId = productId;
    }

    this.configView();
  }

  private configView() {
    // this.getProductByKey('FOR_HONOR');

    this.createContent();
  }

  public setContent(element: InsertableElement) {
    this.wrapper.replaceChildren('');
    if (element instanceof ElementCreator) {
      this.wrapper.append(element.getElement());
    } else {
      this.wrapper.append(element);
    }
  }

  private createContent() {
    // TODO: create content for current this.productId
    this.renderProductCart(this.productId);
    const button = this.createMainButton();

    this.wrapper.append(button.getElement());
  }

  private createMainButton() {
    const button = new LinkButton(LinkName.INDEX, () => {
      this.router.navigate(PagePath.INDEX);
    });
    return button;
  }

  private renderProductCart(key: string) {
    this.anonimApi.productProjectionResponseKEY(key).then((response) => {
      console.log('product', response);

      const section = new ElementCreator({
        tag: TagName.SECTION,
        classNames: [styleCss['product-section']],
        textContent: '',
      });

      const productImages = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['product-images']],
        textContent: '',
      });

      const productImage = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['product-image']],
        textContent: '',
      });

      if (response.body.masterVariant.images)
        productImage.getElement().style.backgroundImage = `url(${response.body.masterVariant.images?.[0].url})`;
      console.log(response.body.masterVariant.images?.[0].url);

      const productInfo = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['product-info']],
        textContent: 'PRODUCT INFO',
      });

      const productName = new ElementCreator({
        tag: TagName.SPAN,
        classNames: [styleCss['product-name']],
        textContent: `${response.body.name.en}`,
      });

      const productCategory = new ElementCreator({
        tag: TagName.SPAN,
        classNames: [styleCss['product-category']],
        // textContent: `CATEGORY: ${response.body.categories?.[0]}`,
        textContent: `GENRE: ${response.body.masterVariant.attributes?.[3].value[0].key}`,
      });

      const productPrice = new ElementCreator({
        tag: TagName.SPAN,
        classNames: [styleCss['product-price']],
        textContent: `PRICE: ${response.body.masterVariant.prices?.[0].value.centAmount} ${response.body.masterVariant.prices?.[0].value.currencyCode}`,
      });

      const productAttributes = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['product-attributes']],
        textContent: `ATTRIBUTES:`,
      });

      const productDeveloper = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['product-developer'], styleCss.attributes],
        textContent: `DEVELOPER: ${response.body.masterVariant.attributes?.[0].value[0]}`,
      });

      const productPlayersQuantity = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['product-developer'], styleCss.attributes],
        textContent: `PLAYERS QUANTITY: ${response.body.masterVariant.attributes?.[1].value[0]}`,
      });

      const productPlatform = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['product-developer'], styleCss.attributes],
        textContent: `PLATFORM: ${response.body.masterVariant.attributes?.[2].value[0].key}`,
      });

      const productGenre = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['product-developer'], styleCss.attributes],
        textContent: `GENRE: ${response.body.masterVariant.attributes?.[3].value[0].key}`,
      });

      const productRelease = new ElementCreator({
        tag: TagName.DIV,
        classNames: [styleCss['product-developer'], styleCss.attributes],
        textContent: `RELEASE: ${response.body.masterVariant.attributes?.[4].value[0]}`,
      });

      const productVideo = new CreateTagElement().createTagElement('span', [styleCss['product-video']], '');

      // productVideo.setAttribute('data-href', `${response.body.masterVariant.attributes?.[5].value[0]}`);
      // console.log(response.body.masterVariant.attributes?.[5].value[0]);

      const productDescription = new ElementCreator({
        tag: TagName.SPAN,
        classNames: [styleCss['product-description']],
        textContent: `DESCRIPTION: ${response.body.description?.en}`,
      });

      const addToCart = new ElementCreator({
        tag: TagName.BUTTON,
        classNames: [styleCss['product-description'], styleCss.button],
        textContent: 'ADD TO CART',
      });

      productImages.addInnerElement(productImage);
      section.addInnerElement(productImages);
      section.addInnerElement(productInfo);
      productInfo.addInnerElement(productName);
      productInfo.addInnerElement(productCategory);
      productInfo.addInnerElement(productPrice);
      productInfo.addInnerElement(productDescription);
      productInfo.addInnerElement(addToCart);
      productInfo.addInnerElement(productAttributes);
      productAttributes.addInnerElement(productDeveloper);
      productAttributes.addInnerElement(productPlayersQuantity);
      productAttributes.addInnerElement(productPlatform);
      productAttributes.addInnerElement(productGenre);
      productAttributes.addInnerElement(productRelease);
      this.getCreator().addInnerElement(section);
      this.getCreator().addInnerElement(productVideo);
    });
  }

  private getProducts() {
    this.anonimApi
      .getProducts()
      .then((response) => console.log(response))
      .catch((error) => {
        this.createMessagePopup('error.message');
        throw new Error(error.message);
      });
  }

  private getProductByKey(key: string) {
    this.anonimApi.productProjectionResponseKEY(key).then((response) => {
      console.log('product', response);
    });
  }

  private createMessagePopup(message: string) {
    const messagePopup = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['login-form__popup']],
      textContent: message,
    });

    this.getCreator().addInnerElement(messagePopup);

    messagePopup.getElement().addEventListener('click', () => {
      messagePopup.getElement().remove();
    });
  }
}

export function getView(router: Router): ProductView {
  return new ProductView(router);
}
