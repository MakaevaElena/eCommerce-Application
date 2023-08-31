import { ClientResponse, ProductProjection } from '@commercetools/platform-sdk';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
//
import './swiper.css';
import './modal.css';

import 'swiper/css/bundle';
import 'swiper/css/zoom';
import Swiper from 'swiper';
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
import ErrorMessage from '../../../message/error-message';
import ProductModal from './product-modal';

export default class ProductView extends DefaultView {
  private router: Router;

  private productId: string = '';

  private wrapper: HTMLDivElement;

  private anonimApi: ClientApi;

  private productCategory = new ElementCreator({
    tag: TagName.SPAN,
    classNames: [styleCss['product-category']],
    textContent: `CATEGORY: `,
  });

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
    // this.getProducts();

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

  public setContent(element: InsertableElement) {
    this.wrapper.replaceChildren('');
    if (element instanceof ElementCreator) {
      this.wrapper.append(element.getElement());
    } else {
      this.wrapper.append(element);
    }
  }

  private configView() {
    this.wrapper.replaceChildren('');
    this.renderProductCard(this.productId).then(() => {
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

      console.log(swiper.params);
    });
  }

  private renderProductCard(key: string) {
    const imagesUrls: string[] = [];
    return this.anonimApi
      .productProjectionResponseKEY(key)
      .then((response) => {
        console.log('product', response);

        this.getCategory(response);

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

          // productImagesSwiper.getElement().addEventListener('click', (event: Event) => {
          //   event.stopPropagation();
          //   this.showModal(imagesUrls);
          // });
        }

        const productInfo = new ElementCreator({
          tag: TagName.DIV,
          classNames: [styleCss['product-info']],
          textContent: '',
        });

        const productName = new ElementCreator({
          tag: TagName.SPAN,
          classNames: [styleCss['product-name']],
          textContent: `${response.body.name.en}`,
        });

        // this.category = `CATEGORY: ${response.body.masterVariant.attributes?.[3].value?.[0].key}`;
        // eslint-disable-next-line consistent-return

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

        const productDiscountPrice = new ElementCreator({
          tag: TagName.SPAN,
          classNames: [styleCss['product-discount-price']],
          textContent: `DISCOUNT PRICE: ${(
            Number(response.body.masterVariant.prices?.[1].discounted?.value?.centAmount) / 100
          ).toFixed(2)} ${response.body.masterVariant.prices?.[1].discounted?.value?.currencyCode}`,
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

        // eslint-disable-next-line consistent-return
        const playersQuantity = () => {
          const index = response.body.masterVariant.attributes?.findIndex((el) => el.name === 'players_quantity');
          if (index && index > -1) {
            return response.body.masterVariant.attributes?.[index].value?.[0];
          }
          return '';
        };

        const productPlayersQuantity = new ElementCreator({
          tag: TagName.DIV,
          classNames: [styleCss['product-developer'], styleCss.attributes],
          textContent: `PLAYERS QUANTITY: ${playersQuantity()}`,
        });

        const productPlatform = new ElementCreator({
          tag: TagName.DIV,
          classNames: [styleCss['product-developer'], styleCss.attributes],
          textContent: `PLATFORM: ${response.body.masterVariant.attributes?.[2].value[0].key}`,
        });

        const genre = () => {
          const index = response.body.masterVariant.attributes?.findIndex((el) => el.name === 'genre');
          if (index && index > -1) {
            return response.body.masterVariant.attributes?.[index].value?.[0].key;
          }
          return '';
        };

        const productGenre = new ElementCreator({
          tag: TagName.DIV,
          classNames: [styleCss['product-developer'], styleCss.attributes],
          textContent: `GENRE: ${genre()}`,
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

        productImagesSwiper.addInnerElement(this.createSwiperWrapper(imagesUrls));
        productImagesSwiper.addInnerElement(swiperPrev);
        productImagesSwiper.addInnerElement(swiperNext);
        productImagesSwiper.addInnerElement(swiperPagination);

        section.addInnerElement(productImagesSwiper);
        section.addInnerElement(productInfo);
        productInfo.addInnerElement(productName);
        productInfo.addInnerElement(this.productCategory);
        productInfo.addInnerElement(productPrice);
        productInfo.addInnerElement(productDiscountPrice);
        productInfo.addInnerElement(productDescription);
        // productInfo.addInnerElement(addToCard);
        productInfo.addInnerElement(this.createToCartButton().getElement());
        productInfo.addInnerElement(productAttributes);
        productAttributes.addInnerElement(productDeveloper);
        productAttributes.addInnerElement(productPlayersQuantity);
        productAttributes.addInnerElement(productPlatform);
        productAttributes.addInnerElement(productGenre);
        productAttributes.addInnerElement(productRelease);
        this.wrapper.textContent = '';
        this.wrapper.append(section.getElement());
        // this.wrapper.append(productVideo);
      })
      .catch((error) => new ErrorMessage().showMessage(error.message));
  }

  private showModal(images: Array<string>) {
    const modal = new ProductModal('modal', images);
    modal.renderModal();
  }

  private getCategory(response: ClientResponse<ProductProjection>) {
    const categoryId = response.body.categories?.[0].id;

    return this.anonimApi
      .getCategory(categoryId)
      .then((category) => {
        // console.log('category', category);
        this.productCategory.getElement().textContent = `CATEGORY: ${category.body.name.ru}`;
      })
      .catch((error) => {
        this.createMessagePopup('error.message');
        throw new Error(error.message);
      });
  }

  private getProducts() {
    this.anonimApi
      .getProducts()
      // .then((response) => console.log(response))
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
    messagePopup.addInnerElement(messagePopup);

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

  private createToCartButton() {
    const button = new LinkButton('Add to cart', () => {
      this.router.navigate(PagePath.EMPTY);
    });
    return button;
  }

  public createSwiperWrapper(images: Array<string>) {
    const swiperWrapper = new ElementCreator({
      tag: TagName.DIV,
      classNames: ['swiper-wrapper'],
      textContent: '',
    });

    images.forEach((image) => swiperWrapper.getElement().append(this.createSlide(image, images)));
    return swiperWrapper;
  }

  private createSlide(imgUrl: string, images: Array<string>) {
    const slide = new ElementCreator({
      tag: TagName.DIV,
      classNames: ['swiper-slide'],
      textContent: '',
    });

    slide.getElement().style.backgroundImage = `url(${imgUrl})`;

    slide.getElement().addEventListener('click', (event: Event) => {
      event.stopPropagation();

      this.showModal(images);
    });

    return slide.getElement();
  }
}

export function getView(router: Router): ProductView {
  return new ProductView(router);
}
