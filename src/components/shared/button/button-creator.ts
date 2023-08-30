import styleButton from './button-style.module.scss';
import { CallbackListener } from '../../../utils/input/inputParams';
import TagName from '../../../enum/tag-name';

export default class buttonCreator {
  private button: HTMLButtonElement;

  private textContent: string;

  private classList?: Array<string>;

  private eventListener?: CallbackListener;

  private event?: string;

  constructor(textContent: string, classList?: Array<string>, eventListener?: CallbackListener, event?: string) {
    this.textContent = textContent;
    this.classList = classList;
    this.eventListener = eventListener;
    this.event = event;
    this.createButton();
  }

  getButton() {
    return this.button;
  }

  private createButton() {
    this.button = document.createElement(TagName.BUTTON);
    this.button.textContent = this.textContent;
    this.button.classList.add(...Object.values(styleButton));
    if (this.classList) {
      this.button.classList.add(...this.classList);
    }

    if (this.eventListener && this.event) {
      this.button.addEventListener(this.event, this.eventListener);
    }
  }
}
