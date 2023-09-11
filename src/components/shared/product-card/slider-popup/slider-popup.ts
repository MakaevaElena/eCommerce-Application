import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import TagElement from '../../../../utils/create-tag-element';
import './slider-popup.scss';

export default class SliderPopup {
  private element: HTMLElement;

  private swiper: Swiper;

  private sliderWrapper: HTMLElement;

  private pagination: HTMLElement;

  private swiperButtonPrev: HTMLElement;

  private swiperButtonNext: HTMLElement;

  private creator = new TagElement();

  private imagesUrl: string[] = [];

  constructor(imagesUrl: string[]) {
    this.imagesUrl = imagesUrl.slice();

    this.element = this.creator.createTagElement('div', ['slider-popup__container']);

    const swiper = this.creator.createTagElement('div', ['swiper']);
    this.sliderWrapper = this.creator.createTagElement('div', ['swiper-wrapper']);
    this.pagination = this.creator.createTagElement('div', ['swiper-pagination']);
    this.swiperButtonPrev = this.creator.createTagElement('div', ['swiper-button-prev']);
    this.swiperButtonNext = this.creator.createTagElement('div', ['swiper-button-next']);

    swiper.append(this.sliderWrapper, this.pagination, this.swiperButtonPrev, this.swiperButtonNext);

    this.element.append(swiper);

    this.makeSlides();

    this.swiper = this.initSwiper();
  }

  public getElement() {
    return this.element;
  }

  private makeSlides() {
    this.imagesUrl.forEach((url) => {
      const image = this.creator.createTagElement('img', ['slider-popup__image']);
      this.sliderWrapper.append(image);
      image.setAttribute('src', url);
    });
  }

  private initSwiper() {
    this.swiper = new Swiper('.slider-popup__container', {
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

    console.log('this.swiper: ', this.swiper);
    return this.swiper;
  }
}
