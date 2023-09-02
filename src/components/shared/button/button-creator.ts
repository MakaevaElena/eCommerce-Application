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
    this.button = this.createButton();
  }

  getButton() {
    return this.button;
  }

  private createButton() {
    const button = document.createElement(TagName.BUTTON);
    button.textContent = this.textContent;
    button.classList.add(...Object.values(styleButton));
    if (this.classList) {
      button.classList.add(...this.classList);
    }

    if (this.eventListener && this.event) {
      button.addEventListener(this.event, this.eventListener);
    }
    return button;
  }
}
