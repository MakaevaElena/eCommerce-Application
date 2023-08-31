import Modal from './modal';
import ElementCreator from '../../../../utils/element-creator';
import TagName from '../../../../enum/tag-name';

export default class ProductModal extends Modal {
  private images: string[];

  constructor(classes: string, images: Array<string>) {
    super(classes);
    this.images = images;
  }

  private createProductModal() {
    let template = '';
    const card = document.createElement('div');
    card.className = 'modal__product-card';

    const productImagesSwiper = new ElementCreator({
      tag: TagName.DIV,
      classNames: ['modal-swiper'],
      textContent: '',
    });

    productImagesSwiper.addInnerElement(this.createSwiperWrapper(this.images));

    template += ` `;

    //   <div class="modal-swiper">
    //   ${productImagesSwiper.addInnerElement(this.createSwiperWrapper(this.images))}
    //   <div class="swiper-pagination"></div>
    //   <div class="swiper-button-prev"></div>
    //   <div class="swiper-button-next"></div>
    // </div>`;

    card.innerHTML = template;

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
