import EventName from '../../../../../../enum/event-name';
import Observer from '../../../../../../observer/observer';
import TagElement from '../../../../../../utils/create-tag-element';
import LinkButton from '../../../../../shared/link-button/link-button';
import FilterAttribute from '../enum';
import FilterCheckbox from '../filter-checkbox/filter-checkbox';
import { IFilterInput } from '../interface/filter-input';
import FilterData from '../types';
import styleCss from './filter-popup.module.scss';

enum KeyCodes {
  ENTER = 'Enter',
  NUMPAD_ENTER = 'NumpadEnter',
  ESC = 'Escape',
}

export default class FilterPopup {
  private filterInputs: IFilterInput[] = [];

  private BUTTON_APPLY_TEXT = 'Apply';

  private TITLE = 'Filter';

  private tagCreator = new TagElement();

  private element: HTMLDialogElement;

  private usedFilter: FilterData;

  private filterData: FilterData;

  private observer = Observer.getInstance();

  constructor(filterData: FilterData, usedFilter: FilterData) {
    this.element = this.tagCreator.createTagElement('dialog', [styleCss['filter-popup']]);

    this.usedFilter = usedFilter;
    this.filterData = filterData;
    this.configView();
    this.configClosing();
  }

  public getDialog() {
    return this.element;
  }

  private configView() {
    const wrapper = this.tagCreator.createTagElement('div', [styleCss['filter-popup__wrapper']]);
    const title = this.tagCreator.createTagElement('span', [styleCss['filter-popup__title']], this.TITLE);
    wrapper.append(title);

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
      const checkbox = new FilterCheckbox(item, this.usedFilter[FilterAttribute.DEVELOPER]);
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
      const checkbox = new FilterCheckbox(item, this.usedFilter[FilterAttribute.PLATFORM]);
      this.filterInputs.push(checkbox);
      group.append(checkbox.getElement());
    });

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
      const checkbox = new FilterCheckbox(item, this.usedFilter[FilterAttribute.GENGE]);
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
