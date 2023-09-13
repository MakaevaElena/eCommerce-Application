import styleCss from './pagination.module.scss';
import { ElementParams } from '../../../utils/element-creator';
import DefaultView from '../../view/default-view';
import TagName from '../../../enum/tag-name';
import ImageButton from '../image-button/image-button';

export type PaginationConfig = {
  total: number;
  limit: number;
  offset: number;
  currentPage: number;
};

export default class Pagination extends DefaultView {
  private config: PaginationConfig;

  private paginations: Pagination[];

  private buttonPrev: ImageButton;

  private buttonNext: ImageButton;

  private callback: () => void;

  constructor(config: PaginationConfig, paginations: Pagination[], callback: () => void) {
    const elementParams: ElementParams = {
      tag: TagName.NAV,
      classNames: [styleCss.pagination],
      textContent: '',
    };

    super(elementParams);

    this.config = config;
    this.paginations = paginations;
    this.callback = callback;

    this.buttonPrev = new ImageButton(this.clickPrevButtonHandler.bind(this), styleCss['pagination__button-prev']);
    this.buttonNext = new ImageButton(this.clickNextButtonHandler.bind(this), styleCss['pagination__button-next']);

    this.setupButtons();
    this.configView();
  }

  public initConfig(config: PaginationConfig) {
    this.config = this.correctConfig(config);
    this.setupButtons();
  }

  public setupButtons() {
    if (this.config.total <= 0) {
      this.buttonPrev.disableButton();
      this.buttonNext.disableButton();

      return;
    }

    if (this.config.offset + this.config.limit >= this.config.total) {
      this.buttonNext.disableButton();
    } else {
      this.buttonNext.enableButton();
    }

    if (this.config.offset === 0) {
      this.buttonPrev.disableButton();
    } else {
      this.buttonPrev.enableButton();
    }
  }

  private correctConfig(config: PaginationConfig) {
    this.config = config;
    this.config.offset = 0;
    this.config.currentPage = 0;

    return config;
  }

  private configView() {
    this.setupButtons();
    this.getElement().append(this.buttonPrev.getElement(), this.buttonNext.getElement());
  }

  private clickPrevButtonHandler() {
    if (this.config.offset - this.config.limit <= 0) {
      this.config.offset = 0;
      this.config.currentPage = 0;
    } else {
      this.config.offset -= this.config.limit;
      this.config.currentPage -= 1;
    }
    this.paginations.forEach((pagination) => pagination.setupButtons());

    this.callback();
  }

  private clickNextButtonHandler() {
    if (this.config.offset + this.config.limit < this.config.total) {
      this.config.offset += this.config.limit;
      this.config.currentPage += 1;
      this.paginations.forEach((pagination) => pagination.setupButtons());

      this.callback();
    }
  }
}
