import EventName from '../../../../../../enum/event-name';
import Observer from '../../../../../../observer/observer';
import TagElement from '../../../../../../utils/create-tag-element';
import LinkButton from '../../../../../shared/link-button/link-button';
import FilterAttribute from '../enum';
import FilterCheckbox from '../filter-checkbox/filter-checkbox';
import { IFilterInput } from '../interface/filter-input';
import { FilterData, PriceFilterGroup } from '../types';
import styleCss from './filter-popup.module.scss';

enum KeyCodes {
  ENTER = 'Enter',
  NUMPAD_ENTER = 'NumpadEnter',
  ESC = 'Escape',
}

export default class FilterPopup {
  private filterInputs: IFilterInput[] = [];

  private readonly BUTTON_APPLY_TEXT = 'Apply';

  private readonly PRICE_FILTER_TITLE = 'price';

  private POPUP_TITLE = 'Filter';

  private tagCreator = new TagElement();

  private element: HTMLDialogElement;

  private filterUsed: FilterData;

  private filterData: FilterData;

  private priceGroup: PriceFilterGroup;

  private observer = Observer.getInstance();

  constructor(filterData: FilterData, filterUsed: FilterData, filterPriceData: PriceFilterGroup) {
    this.element = this.tagCreator.createTagElement('dialog', [styleCss['filter-popup']]);

    this.filterUsed = filterUsed;
    this.filterData = filterData;
    this.priceGroup = filterPriceData;
    this.configView();
    this.configClosing();
  }

  public getDialog() {
    return this.element;
  }

  private configView() {
    const wrapper = this.tagCreator.createTagElement('div', [styleCss['filter-popup__wrapper']]);
    const title = this.tagCreator.createTagElement('span', [styleCss['filter-popup__title']], this.POPUP_TITLE);
    wrapper.append(title);

    wrapper.append(this.createGroupPrice());
    wrapper.append(this.createGroupGenre());
    wrapper.append(this.createGroupPlatform());
    wrapper.append(this.createGroupDeveloper());

    const applyButton = this.createApplyButton();
    wrapper.append(applyButton.getElement());

    const closeButton = this.createCloseButton();
    wrapper.append(closeButton);

    this.element.append(wrapper);
  }

  private createCloseButton() {
    const closeButton = this.tagCreator.createTagElement('a', [styleCss['filter-popup__close-icon']]);
    closeButton.addEventListener('click', () => this.getDialog().remove());
    closeButton.setAttribute('tabindex', '1');
    closeButton.setAttribute('autofocus', '');

    return closeButton;
  }

  private createApplyButton() {
    const linkButton = new LinkButton(this.BUTTON_APPLY_TEXT, () => {
      this.filterInputs.forEach((input) => input.updateSource());

      this.observer.notify(EventName.UPDATE_CATALOG_CARDS);
      this.observer.notify(EventName.UPDATE_FILTER_TAGS);

      this.getDialog().remove();
    });

    return linkButton;
  }

  private createGroupDeveloper(): HTMLFieldSetElement {
    const group = this.tagCreator.createTagElement('fieldset', [styleCss['filter-popup__group']]);
    const legend = this.tagCreator.createTagElement(
      'legend',
      [styleCss['filter-popup__group-legend']],
      FilterAttribute.DEVELOPER
    );
    group.append(legend);

    this.filterData[FilterAttribute.DEVELOPER].forEach((item) => {
      const checkbox = new FilterCheckbox(item, this.filterUsed[FilterAttribute.DEVELOPER]);
      this.filterInputs.push(checkbox);
      group.append(checkbox.getElement());
    });

    return group;
  }

  private createGroupPlatform(): HTMLFieldSetElement {
    const group = this.tagCreator.createTagElement('fieldset', [styleCss['filter-popup__group']]);
    const legend = this.tagCreator.createTagElement(
      'legend',
      [styleCss['filter-popup__group-legend']],
      FilterAttribute.PLATFORM
    );
    group.append(legend);

    this.filterData[FilterAttribute.PLATFORM].forEach((item) => {
      const checkbox = new FilterCheckbox(item, this.filterUsed[FilterAttribute.PLATFORM]);
      this.filterInputs.push(checkbox);
      group.append(checkbox.getElement());
    });

    return group;
  }

  private createGroupPrice(): HTMLFieldSetElement {
    const group = this.tagCreator.createTagElement('fieldset', [styleCss['filter-popup__group']]);
    const legend = this.tagCreator.createTagElement(
      'legend',
      [styleCss['filter-popup__group-legend']],
      this.PRICE_FILTER_TITLE
    );

    const priceWrapper = this.tagCreator.createTagElement('div', [styleCss['filter-popup__price-wrapper']]);
    priceWrapper.append(this.priceGroup.minPrice.getElement(), this.priceGroup.maxPrice.getElement());

    group.append(legend, priceWrapper);

    return group;
  }

  private createGroupGenre(): HTMLFieldSetElement {
    const group = this.tagCreator.createTagElement('fieldset', [styleCss['filter-popup__group']]);
    const legend = this.tagCreator.createTagElement(
      'legend',
      [styleCss['filter-popup__group-legend']],
      FilterAttribute.GENGE
    );
    group.append(legend);

    this.filterData[FilterAttribute.GENGE].forEach((item) => {
      const checkbox = new FilterCheckbox(item, this.filterUsed[FilterAttribute.GENGE]);
      this.filterInputs.push(checkbox);
      group.append(checkbox.getElement());
    });

    return group;
  }

  private configClosing() {
    const onCloseDialogHandler = this.onCloseDialog.bind(this);
    this.element.addEventListener('click', onCloseDialogHandler);
    this.element.addEventListener('keydown', onCloseDialogHandler);
  }

  private onCloseDialog(e: Event): void {
    if (e instanceof KeyboardEvent && e.code === KeyCodes.ESC) {
      this.element.remove();
    }

    if (e instanceof MouseEvent && e.target instanceof HTMLDialogElement) {
      this.element.remove();
    }
  }
}
