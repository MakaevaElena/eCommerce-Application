import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './swiper.scss';
import TagElement from '../../../../utils/create-tag-element';
import styleCss from './slider-popup.module.scss';

export default class SliderPopup {
  private element: HTMLElement;

  private sliderWrapper: HTMLElement;

  private pagination: HTMLElement;

  private swiperButtonPrev: HTMLElement;

  private swiperButtonNext: HTMLElement;

  private closeButton: HTMLAnchorElement;

  private creator = new TagElement();

  private imagesUrl: string[] = [];

  constructor(imagesUrl: string[]) {
    this.imagesUrl = imagesUrl.slice();

    this.element = this.creator.createTagElement('div', [styleCss['slider-popup__container']]);
    this.closeButton = this.createCloseButton();

    const swiper = this.creator.createTagElement('div', ['swiper']);
    this.sliderWrapper = this.creator.createTagElement('div', ['swiper-wrapper']);
    this.pagination = this.creator.createTagElement('div', ['swiper-pagination']);
    this.swiperButtonPrev = this.creator.createTagElement('div', ['swiper-button-prev']);
    this.swiperButtonNext = this.creator.createTagElement('div', ['swiper-button-next']);

    swiper.append(this.sliderWrapper, this.pagination, this.swiperButtonPrev, this.swiperButtonNext, this.closeButton);

    this.element.append(swiper);

    this.addSlides();

    this.configClose();
  }

  public getElement() {
    return this.element;
  }

  private configClose() {
    this.element.addEventListener('click', this.closeHandler.bind(this));
  }

  private createCloseButton() {
    this.closeButton = this.creator.createTagElement('a', [styleCss['slider-popup__close-button']]);
    this.closeButton.addEventListener('click', () => this.element.remove());

    return this.closeButton;
  }

  private closeHandler(e: Event) {
    if (e instanceof PointerEvent && e.target instanceof HTMLElement) {
      if (e.target.classList.contains(styleCss['slider-popup__container'])) {
        this.element.remove();
      }
    }
  }

  private addSlides() {
    this.imagesUrl.forEach((url, index, arr) => {
      const imageWrapper = this.creator.createTagElement('div', ['swiper-slide']);
      const image = this.creator.createTagElement('img', [styleCss['slider-popup__image']]);
      image.setAttribute('src', url);
      imageWrapper.append(image);
      this.sliderWrapper.append(imageWrapper);

      // Initialize Swiper after creating DOM
      if (index === arr.length - 1) {
        image.addEventListener('load', this.initSwiper.bind(this));
      }
    });
  }

  private initSwiper() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const swiper = new Swiper('.swiper', {
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
}
