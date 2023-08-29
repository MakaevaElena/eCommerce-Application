import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

//
import './swiper.css';

// import 'swiper/scss';
import 'swiper/css/bundle';
// import 'swiper/scss/navigation';
// import 'swiper/scss/pagination';
import 'swiper/css/zoom';
// eslint-disable-next-line import/no-extraneous-dependencies
import Swiper from 'swiper';
// import { register } from 'swiper/element/bundle';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Navigation, Pagination } from 'swiper/modules';

import ClientApi from '../../../../api/client-api';
import TagName from '../../../../enum/tag-name';
import ElementCreator, { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import { LinkName, PagePath } from '../../../router/pages';
import Router from '../../../router/router';
import LinkButton from '../../../shared/link-button/link-button';
import DefaultView from '../../default-view';
import styleCss from './product-view.module.scss';
import CreateTagElement from '../../../../utils/create-tag-element';

const ERROR_NOT_FOUND_GAME = 'GAME not found';

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
    this.wrapper.replaceChildren('');
    this.renderProductCart(this.productId).then(() => {
      const swiper = new Swiper('.swiper', {
        modules: [Navigation, Pagination],
        speed: 500,
        effect: 'fade',
        direction: 'horizontal',
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        keyboard: true,
        // ...
      });

      // Swiper.use([Navigation, Pagination]);
      // register();
      console.log(swiper.params);
    });
  }

  private renderProductCart(key: string) {
    const imagesUrls: Array<string> = [];
    return this.anonimApi
      .productProjectionResponseKEY(key)
      .then((response) => {
        // console.log('product', response);

        const section = new ElementCreator({
          tag: TagName.SECTION,
          classNames: [styleCss['product-section']],
          textContent: '',
        });

        const productImagesSwiper = new ElementCreator({
          tag: TagName.DIV,
          classNames: ['swiper'],
          textContent: '',
        });

        const swiperNext = new ElementCreator({
          tag: TagName.DIV,
          classNames: ['swiper-button-next'],
          textContent: '',
        });

        const swiperPrev = new ElementCreator({
          tag: TagName.DIV,
          classNames: ['swiper-button-prev'],
          textContent: '',
        });

        const swiperPagination = new ElementCreator({
          tag: TagName.DIV,
          classNames: ['swiper-pagination'],
          textContent: '',
        });

        if (response.body.masterVariant.images) {
          response.body.masterVariant.images.forEach((image) => imagesUrls.push(image.url));
          // productImage.getElement().style.backgroundImage = `url(${response.body.masterVariant.images?.[0].url})`;
        }

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
          textContent: `CATEGORY: ${response.body.masterVariant.attributes?.[3].value?.[0].key}`,
        });

        const price = () => {
          if (response.body.masterVariant.prices?.[1].value) {
            return `PRICE: ${(Number(response.body.masterVariant.prices?.[1].value?.centAmount) / 100).toFixed(
              2
            )} ${response.body.masterVariant.prices?.[1].value?.currencyCode}`;
          }
          return '';
        };

        const productPrice = new ElementCreator({
          tag: TagName.SPAN,
          classNames: [styleCss['product-price']],
          textContent: price(),
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

        // const productVideo = new CreateTagElement().createTagElement('span', [styleCss['product-video']], '');
        // productVideo.setAttribute('data-href', `${response.body.masterVariant.attributes?.[5].value[0]}`);
        // console.log(response.body.masterVariant.attributes?.[5].value[0]);

        const productDescription = new ElementCreator({
          tag: TagName.SPAN,
          classNames: [styleCss['product-description']],
          textContent: `DESCRIPTION: ${response.body.description?.en}`,
        });

        const addToCart = new ElementCreator({
          tag: TagName.BUTTON,
          classNames: [styleCss['product-button'], styleCss.button],
          textContent: 'ADD TO CART',
        });

        productImagesSwiper.addInnerElement(this.createSwiperWrapper(imagesUrls));
        productImagesSwiper.addInnerElement(swiperPrev);
        productImagesSwiper.addInnerElement(swiperNext);
        productImagesSwiper.addInnerElement(swiperPagination);

        section.addInnerElement(productImagesSwiper);
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
        this.wrapper.append(section.getElement());
        // this.wrapper.append(productVideo);
      })
      .catch((error) => {
        console.log('error', error);
        this.createMessagePopup(ERROR_NOT_FOUND_GAME);
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
      classNames: [styleCss['product-view__popup']],
      textContent: message,
    });

    this.getCreator().addInnerElement(this.createMainButton().getElement());
    this.getCreator().addInnerElement(messagePopup);

    messagePopup.getElement().addEventListener('click', () => {
      messagePopup.getElement().remove();
    });
  }

  private createMainButton() {
    const button = new LinkButton(LinkName.INDEX, () => {
      this.router.navigate(PagePath.INDEX);
    });
    return button;
  }

  public createSwiperWrapper(images: Array<string>) {
    const swiperWrapper = new ElementCreator({
      tag: TagName.DIV,
      classNames: ['swiper-wrapper'],
      textContent: '',
    });

    images.forEach((image) => swiperWrapper.getElement().append(this.createSlide(image)));
    return swiperWrapper;
  }

  private createSlide(imgUrl: string) {
    const slide = new ElementCreator({
      tag: TagName.DIV,
      classNames: ['swiper-slide'],
      textContent: '',
    });

    slide.getElement().style.backgroundImage = `url(${imgUrl})`;
    return slide.getElement();
  }
}

export function getView(router: Router): ProductView {
  return new ProductView(router);
}
