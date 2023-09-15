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
import Observer from '../../../../observer/observer';
import EventName from '../../../../enum/event-name';
import InfoMessage from '../../../message/info-message';
import LocalStorageKeys from '../../../../enum/local-storage-keys';
import TotalApi from '../../../../api/total-api';
import ApiType from '../../../app/type';

export default class ProductView extends DefaultView {
  private api: TotalApi;

  private observer = Observer.getInstance();

  private router: Router;

  private productId: string = '';

  private wrapper: HTMLDivElement;

  private productCategory = new ElementCreator({
    tag: TagName.SPAN,
    classNames: [styleCss['product-category']],
    textContent: `CATEGORY: `,
  });

  private addButtonContainer = new ElementCreator({
    tag: TagName.DIV,
    classNames: [],
    textContent: ``,
  });

  constructor(router: Router, paramApi: ApiType) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['product-view']],
      textContent: '',
    };
    super(params);

    this.api = paramApi.api;

    this.router = router;

    this.wrapper = new CreateTagElement().createTagElement('div', [styleCss['content-wrapper']]);

    this.getCreator().addInnerElement(this.wrapper);
  }

  public initContent(productId?: string) {
    if (productId) {
      this.productId = productId;
    }
    this.createAnonimCart();
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
    });
  }

  private renderProductCard(key: string) {
    const imagesUrls: string[] = [];
    return this.api
      .getClientApi()
      .productProjectionResponseKEY(key)
      .then(async (productResponse) => {
        this.getCategory(productResponse);

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

        if (productResponse.body.masterVariant.images) {
          productResponse.body.masterVariant.images.forEach((image) => imagesUrls.push(image.url));
        }

        const productInfo = new ElementCreator({
          tag: TagName.DIV,
          classNames: [styleCss['product-info']],
          textContent: '',
        });

        const productName = new ElementCreator({
          tag: TagName.SPAN,
          classNames: [styleCss['product-name']],
          textContent: `${productResponse.body.name.en}`,
        });

        const price = () => {
          if (productResponse.body.masterVariant.prices?.[1].value) {
            return `PRICE: ${(Number(productResponse.body.masterVariant.prices?.[1].value?.centAmount) / 100).toFixed(
              2
            )} ${productResponse.body.masterVariant.prices?.[1].value?.currencyCode}`;
          }
          return '';
        };

        const productPrice = new ElementCreator({
          tag: TagName.SPAN,
          classNames: [styleCss['product-price']],
          textContent: price(),
        });

        function discountPrice() {
          if (productResponse.body.masterVariant.prices?.[1].discounted?.value) {
            productPrice.getElement().classList.add(styleCss.crossed);
            return `DISCOUNT PRICE: ${(
              Number(productResponse.body.masterVariant.prices?.[1].discounted?.value?.centAmount) / 100
            ).toFixed(2)} ${productResponse.body.masterVariant.prices?.[1].discounted?.value?.currencyCode}`;
          }
          return '';
        }

        const productDiscountPrice = new ElementCreator({
          tag: TagName.SPAN,
          classNames: [styleCss['product-discount-price']],
          textContent: discountPrice(),
        });

        const productAttributes = new ElementCreator({
          tag: TagName.DIV,
          classNames: [styleCss['product-attributes']],
          textContent: `ATTRIBUTES:`,
        });

        const developer = () => {
          const index = productResponse.body.masterVariant.attributes?.findIndex((el) => el.name === 'developer');
          if (index !== undefined && index > -1) {
            return productResponse.body.masterVariant.attributes?.[index].value?.[0];
          }
          return '';
        };

        const productDeveloper = new ElementCreator({
          tag: TagName.DIV,
          classNames: [styleCss['product-developer'], styleCss.attributes],

          textContent: `DEVELOPER: ${developer()}`,
        });

        // eslint-disable-next-line consistent-return
        const playersQuantity = () => {
          const index = productResponse.body.masterVariant.attributes?.findIndex(
            (el) => el.name === 'players_quantity'
          );
          if (index !== undefined && index > -1) {
            return productResponse.body.masterVariant.attributes?.[index].value?.[0];
          }
          return '';
        };

        const productPlayersQuantity = new ElementCreator({
          tag: TagName.DIV,
          classNames: [styleCss['product-developer'], styleCss.attributes],
          textContent: `PLAYERS QUANTITY: ${playersQuantity()}`,
        });

        const platform = () => {
          let result = '';
          const index = productResponse.body.masterVariant.attributes?.findIndex((el) => el.name === 'Platform');
          if (index && index > -1) {
            productResponse.body.masterVariant.attributes?.[index].value?.forEach(
              (el: { [x: string]: string; key: string }, i: number) => {
                if (i === 0) {
                  result += `${el.key} `;
                } else {
                  result += `/ ${el.key} `;
                }
              }
            );
            return result;
          }
          return '';
        };

        const productPlatform = new ElementCreator({
          tag: TagName.DIV,
          classNames: [styleCss['product-developer'], styleCss.attributes],
          textContent: `PLATFORM: ${platform()}`,
        });

        const genre = () => {
          const index = productResponse.body.masterVariant.attributes?.findIndex((el) => el.name === 'genre');
          if (index !== undefined && index > -1) {
            return productResponse.body.masterVariant.attributes?.[index].value?.[0].key;
          }
          return '';
        };

        const productGenre = new ElementCreator({
          tag: TagName.DIV,
          classNames: [styleCss['product-developer'], styleCss.attributes],
          textContent: `GENRE: ${genre()}`,
        });

        const release = () => {
          const index = productResponse.body.masterVariant.attributes?.findIndex((el) => el.name === 'release');
          if (index !== undefined && index > -1) {
            return productResponse.body.masterVariant.attributes?.[index].value?.[0];
          }
          return '';
        };

        const productRelease = new ElementCreator({
          tag: TagName.DIV,
          classNames: [styleCss['product-developer'], styleCss.attributes],
          textContent: `RELEASE: ${release()}`,
        });

        const productDescription = new ElementCreator({
          tag: TagName.SPAN,
          classNames: [styleCss['product-description']],
          textContent: `DESCRIPTION: ${productResponse.body.description?.en}`,
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

        if (productResponse.body.masterVariant.prices?.[1].discounted?.value) {
          productInfo.addInnerElement(productDiscountPrice);
        }

        productInfo.addInnerElement(productDescription);
        productInfo.addInnerElement(productAttributes);
        productAttributes.addInnerElement(productDeveloper);
        productAttributes.addInnerElement(productPlayersQuantity);
        productAttributes.addInnerElement(productPlatform);
        productAttributes.addInnerElement(productGenre);
        productAttributes.addInnerElement(productRelease);
        if (productResponse.body.masterVariant.sku)
          this.addButtonContainer.addInnerElement(
            (await this.createToCartButton(productResponse, productInfo)).getElement()
          );

        productInfo.addInnerElement(this.addButtonContainer);
        this.wrapper.textContent = '';
        this.wrapper.append(section.getElement());
      })
      .catch((error) => {
        if (error instanceof Error) {
          new ErrorMessage().showMessage(error.message);
        }
      });
  }

  private showModal(images: Array<string>) {
    const modal = new ProductModal('modal', images);
    modal.renderModal();
  }

  private getCategory(response: ClientResponse<ProductProjection>) {
    const categoryId = response.body.categories?.[0].id;

    return this.api
      .getClientApi()
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
      this.router.setHref(PagePath.INDEX);
    });
    return button;
  }

  private async createToCartButton(response: ClientResponse<ProductProjection>, productInfo: ElementCreator) {
    this.addButtonContainer.getElement().innerHTML = '';
    let button = new LinkButton('Add to cart', async () => {
      this.addToCart(response, productInfo);
      button.getElement().remove();
      // productInfo.addInnerElement((await this.createToCartButton(response, productInfo)).getElement());
    });

    const anonimCartID = localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID);
    if (anonimCartID)
      await this.api
        .getClientApi()
        .getCartByCartID(anonimCartID)
        .then(async (cartResponse) => {
          const item = cartResponse.body.lineItems.filter((lineItem) => lineItem.productKey === response.body.key);
          if (cartResponse.body.lineItems.some((lineItem) => lineItem.productKey === response.body.key)) {
            button = new LinkButton('Remove from cart', async () => {
              this.removeFromCart(anonimCartID, item[0].id, response, productInfo);
              button.getElement().remove();
              // productInfo.addInnerElement((await this.createToCartButton(response, productInfo)).getElement());
            });
          }
        })
        .catch((error) => {
          if (error instanceof Error) {
            new ErrorMessage().showMessage(error.message);
          }
        });

    return button;
  }

  private removeFromCart(
    cartID: string,
    lineItemId: string,
    response: ClientResponse<ProductProjection>,
    productInfo: ElementCreator
  ) {
    this.anonimApi
      .getCartByCartID(cartID)
      .then((cartResponse) => {
        if (lineItemId) {
          // console.log('response.body.key', lineItemId);
          this.anonimApi
            .removeLineItem(cartID, cartResponse.body.version, lineItemId)
            .then(async () =>
              productInfo.addInnerElement((await this.createToCartButton(response, productInfo)).getElement())
            );
        }
      })
      .then(() => {
        this.observer.notify(EventName.UPDATE_CART);
        this.observer.notify(EventName.REMOVE_FROM_CART);
        new InfoMessage().showMessage('Item removed from cart');
      })
      .catch((error) => {
        if (error instanceof Error) {
          new ErrorMessage().showMessage(error.message);
        }
      });
  }

  private createAnonimCart() {
    if (!localStorage.getItem('isLogin') && !localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID)) {
      this.api
        .getClient()
        .then((cartResponse) => {
          localStorage.setItem(LocalStorageKeys.ANONIM_CART_ID, `${cartResponse.body.id}`);
        })
        .catch((error) => {
          if (error instanceof Error) {
            new ErrorMessage().showMessage(error.message);
          }
        });
    }
  }

  private addToCart(response: ClientResponse<ProductProjection>, productInfo: ElementCreator) {
    // this.createAnonimCart();

    const cartID = localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID);

    if (cartID !== null) {
      this.addItemToCart(cartID, response, productInfo);
    }
  }

  private addItemToCart(cartID: string, response: ClientResponse<ProductProjection>, productInfo: ElementCreator) {
    this.anonimApi
      .getCartByCartID(cartID)
      .then((cartResponse) => {
        if (response.body.masterVariant?.sku)
          this.anonimApi
            .addItemToCartByID(cartID, cartResponse.body.version, response.body.masterVariant?.sku)
            .then(async () =>
              productInfo.addInnerElement((await this.createToCartButton(response, productInfo)).getElement())
            );
      })
      .then(() => {
        new InfoMessage().showMessage('Item added to cart');
        this.observer.notify(EventName.UPDATE_CART);
        this.observer.notify(EventName.ADD_TO_CART);
      })
      .catch((error) => {
        if (error instanceof Error) {
          new ErrorMessage().showMessage(error.message);
        }
      });
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
      this.observer.notify(EventName.IMAGES_LOADED_TO_PRODUCT_PAGE);
    });

    return slide.getElement();
  }
}
