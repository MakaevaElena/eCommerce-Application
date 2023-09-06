import ProductApi, { Template } from '../../../../../api/products-api';
import EventName from '../../../../../enum/event-name';
import Observer from '../../../../../observer/observer';
import ErrorMessage from '../../../../message/error-message';
import FilterAttribute from './enum';
import FilterHeaderView from './filter-header/filter-header';
import FilterPopup from './filter-popup/filter-popup';
import FilterData from './types';

export default class Filter {
  private filterData: FilterData = this.getEmptyFilterArray();

  private usedFilter: FilterData = this.getEmptyFilterArray();

  private productApi: ProductApi;

  private filterHeader = new FilterHeaderView();

  private observer = Observer.getInstance();

  constructor(productApi: ProductApi) {
    this.productApi = productApi;
    this.getFilterData();
    this.createFilterTags();
    this.observer.subscribe(EventName.SHOW_FILTER, this.showFilterPopup.bind(this));
    this.observer.subscribe(EventName.UPDATE_FILTER_TAGS, this.createFilterTags.bind(this));
  }

  /**
   * Get basic data to setup Filter
   */
  public getFilterData() {
    this.productApi
      .getAllProducts()
      .then((response) => {
        const { results } = response.body;
        results.forEach((result) => {
          const { attributes } = result.masterData.current.masterVariant;
          if (attributes) {
            attributes.forEach((attr) => {
              if (attr.name === FilterAttribute.GENGE) {
                this.filterData[FilterAttribute.GENGE].push(attr.value[0].key);
              }
              if (attr.name === FilterAttribute.PLATFORM) {
                this.filterData[FilterAttribute.PLATFORM].push(attr.value[0].key);
              }
              if (attr.name === FilterAttribute.DEVELOPER) {
                this.filterData[FilterAttribute.DEVELOPER].push(attr.value[0]);
              }
            });
          }
        });
        this.filterData.genre = Array.from(new Set(this.filterData.genre));
        this.filterData.Platform = Array.from(new Set(this.filterData.Platform));
        this.filterData.developer = Array.from(new Set(this.filterData.developer));
      })
      .catch((error) => new ErrorMessage().showMessage(error.message));
  }

  public getFilterHeaderElement() {
    const headerElement = this.filterHeader.getCreator().getElement();
    return headerElement;
  }

  private getEmptyFilterArray(): FilterData {
    return { genre: [], Platform: [], developer: [] };
  }

  public clearFilters() {
    this.usedFilter = this.getEmptyFilterArray();
    this.createFilterTags();
  }

  private showFilterPopup() {
    const popup = new FilterPopup(this.filterData, this.usedFilter).getDialog();
    document.body.prepend(popup);
    popup.showModal();
  }

  private createFilterTags() {
    this.filterHeader.clearFilterTags();

    this.usedFilter.genre.forEach((filter) => {
      this.filterHeader.addFilterTag(
        FilterAttribute.GENGE,
        filter,
        this.deleteFilter.bind(this, this.usedFilter.genre, filter)
      );
    });
    this.usedFilter.Platform.forEach((filter) => {
      this.filterHeader.addFilterTag(
        FilterAttribute.PLATFORM,
        filter,
        this.deleteFilter.bind(this, this.usedFilter.Platform, filter)
      );
    });
    this.usedFilter.developer.forEach((filter) => {
      this.filterHeader.addFilterTag(
        FilterAttribute.DEVELOPER,
        filter,
        this.deleteFilter.bind(this, this.usedFilter.developer, filter)
      );
    });
  }

  private deleteFilter(filters: string[], filterValue: string) {
    const index = filters.indexOf(filterValue);
    if (index >= 0) {
      filters.splice(index, 1);
    }
    this.observer.notify(EventName.UPDATE_CATALOG_CARDS);
    this.observer.notify(EventName.UPDATE_FILTER_TAGS);
  }

  public getFilterCondition(): string[] {
    const genreFilter = this.getFilterForArrtibute(Template.ENUM_ATTRIBUTE_MASK, FilterAttribute.GENGE);
    const genrePlatform = this.getFilterForArrtibute(Template.ENUM_ATTRIBUTE_MASK, FilterAttribute.PLATFORM);
    const genreDeveloper = this.getFilterForArrtibute(Template.TEXT_ATTRIBUTE_MASK, FilterAttribute.DEVELOPER);

    const filters: string[] = [];

    if (genreFilter) {
      filters.push(genreFilter);
    }
    if (genrePlatform) {
      filters.push(genrePlatform);
    }
    if (genreDeveloper) {
      filters.push(genreDeveloper);
    }

    return filters;
  }

  private getFilterForArrtibute(template: string, attributeKey: FilterAttribute): string {
    const values: string[] = [];

    this.usedFilter[attributeKey].forEach((filter) => values.push(`"${filter}"`));

    const filter =
      values.length > 0 ? template.replace('%ATTRIBUTE%', attributeKey).replace('%VALUE%', values.join(',')) : '';

    return filter;
  }
}
