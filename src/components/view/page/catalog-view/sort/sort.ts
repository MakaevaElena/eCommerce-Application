import TagName from '../../../../../enum/tag-name';
import DefaultView from '../../../default-view';
import styleCss from './sort.module.scss';
import { ElementParams } from '../../../../../utils/element-creator';
import TagElement from '../../../../../utils/create-tag-element';
import { SortOrderSymbol, SortOrderValue } from './enum';
import Observer from '../../../../../observer/observer';
import EventName from '../../../../../enum/event-name';

export default class SortView extends DefaultView {
  private sortCondition = SortOrderValue.NAME_ASC;

  private observer = Observer.getInstance();

  private sortList: HTMLSelectElement;

  private options = [
    { title: `Name ${SortOrderSymbol.ASC}`, value: SortOrderValue.NAME_ASC, sortOrder: 'name.en asc' },
    { title: `Name ${SortOrderSymbol.DESC}`, value: SortOrderValue.NAME_DESC, sortOrder: 'name.en desc' },
    {
      title: `Price ${SortOrderSymbol.ASC}`,
      value: SortOrderValue.PRICE_ASC,
      sortOrder: 'variants.scopedPrice.currentValue.centAmount asc',
    },
    {
      title: `Price ${SortOrderSymbol.DESC}`,
      value: SortOrderValue.PRICE_DESC,
      sortOrder: 'variants.scopedPrice.currentValue.centAmount desc',
    },
  ];

  constructor() {
    const params: ElementParams = {
      tag: TagName.DIV,
      classNames: [styleCss['sort-header']],
      textContent: '',
    };
    super(params);

    this.sortList = this.createSortList();

    this.configView();
  }

  private configView() {
    this.sortList.addEventListener('change', this.sortHandler.bind(this));

    this.getElement().append(this.sortList);
  }

  public getSortCondition(): string {
    const selected = this.options[this.sortList.selectedIndex].sortOrder;
    return selected;
  }

  private sortHandler() {
    this.observer.notify(EventName.UPDATE_CATALOG_CARDS);
  }

  private createSortList() {
    const creator = new TagElement();
    const list = creator.createTagElement('select', [styleCss['sort-header__list']]);

    this.options.forEach((option) => {
      const element = creator.createTagElement('option', [styleCss['sort-header__option']], option.title);
      element.setAttribute('value', option.value.toString());

      list.append(element);
    });

    return list;
  }
}
