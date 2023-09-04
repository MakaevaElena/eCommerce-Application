import TagName from '../../../../../enum/tag-name';
import DefaultView from '../../../default-view';
import styleCss from './sort.module.scss';
import { ElementParams } from '../../../../../utils/element-creator';
import TagElement from '../../../../../utils/create-tag-element';
import { SortOrderSymbol, SortOrderValue } from './enum';

export default class SortView extends DefaultView {
  private sortCondition = '';

  private options = [
    { title: `Name ${SortOrderSymbol.ASC}`, value: SortOrderValue.NAME_ASC },
    { title: `Name ${SortOrderSymbol.DESC}`, value: SortOrderValue.NAME_ASC },
    { title: `Price ${SortOrderSymbol.ASC}`, value: SortOrderValue.NAME_ASC },
    { title: `Price ${SortOrderSymbol.DESC}`, value: SortOrderValue.NAME_ASC },
  ];

  constructor() {
    const params: ElementParams = {
      tag: TagName.DIV,
      classNames: [styleCss['sort-header']],
      textContent: '',
    };
    super(params);
    this.configView();
  }

  private configView() {
    const list = this.createSortList();

    this.getElement().append(list);
  }

  public getSortCondition() {
    return this.sortCondition;
  }

  private createSortList() {
    const creator = new TagElement()
    const list = creator.createTagElement('select', [styleCss['sort-header__list']]);

    this.options.forEach((option) => {
      const element = creator.createTagElement('option', [styleCss['sort-header__option']], option.title);
      element.setAttribute('value', option.value.toString());

      list.append(element);
    });

    // list.setAttribute('type', 'dropdown');

    return list;
  }
}
