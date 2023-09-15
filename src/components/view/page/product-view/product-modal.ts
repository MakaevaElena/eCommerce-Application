import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import Modal from './modal';
import ElementCreator from '../../../../utils/element-creator';
import TagName from '../../../../enum/tag-name';
import 'swiper/css';
import './modal.css';
import Observer from '../../../../observer/observer';
import EventName from '../../../../enum/event-name';

export default class ProductModal extends Modal {
  private observer: Observer;

  private images: string[];

  constructor(classes: string, images: Array<string>) {
    super(classes);
    this.observer = Observer.getInstance();
    this.images = images;
    this.observer?.subscribe(EventName.IMAGES_LOADED_TO_PRODUCT_PAGE, this.initSwiper.bind(this));
  }

  private initSwiper() {
    const productModalSwiper = new Swiper('.product-modal-swiper', {
      modules: [Navigation, Pagination],
      speed: 500,
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
    });
  }

  private createProductModal() {
    const card = document.createElement('div');
    card.className = 'product-modal__product-card';

    const productImagesSwiper = new ElementCreator({
      tag: TagName.DIV,
      classNames: ['product-modal-swiper'],
      textContent: '',
    });

    const swiperPagination = new ElementCreator({
      tag: TagName.DIV,
      classNames: ['swiper-pagination'],
      textContent: '',
    });

    const swiperPrev = new ElementCreator({
      tag: TagName.DIV,
      classNames: ['swiper-button-prev'],
      textContent: '',
    });

    const swiperNext = new ElementCreator({
      tag: TagName.DIV,
      classNames: ['swiper-button-next'],
      textContent: '',
    });

    productImagesSwiper.addInnerElement(this.createSwiperWrapper(this.images));
    productImagesSwiper.addInnerElement(swiperPrev);
    productImagesSwiper.addInnerElement(swiperNext);
    productImagesSwiper.addInnerElement(swiperPagination);

    card.append(productImagesSwiper.getElement());

    return card;
  }

  public renderModal() {
    const content = this.createProductModal();
    // console.log(content);
    this.buildModal(content);

    // document.querySelector('.modal__image').style.backgroundImage = `url(${this.img})`;
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
