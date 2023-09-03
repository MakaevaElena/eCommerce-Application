import ProductApi, { Template } from '../../../../../api/products-api';
import EventName from '../../../../../enum/event-name';
import Observer from '../../../../../observer/observer';
import ErrorMessage from '../../../../message/error-message';
import FilterHeaderView from './filter-header/filter-header';

export enum FilterAttribute {
  GENGE = 'genre',
  PLATFORM = 'Platform',
  DEVELOPER = 'developer',
}

type FilterData = {
  [key in FilterAttribute]: string[];
};

export default class Filter {
  private filterData: FilterData = {
    genre: [],
    Platform: [],
    developer: [],
  };

  private usedFilter: FilterData = {
    genre: ['action'],
    Platform: ['PC'],
    developer: [],
  };

  private productApi = new ProductApi();

  private filterHeader = new FilterHeaderView();

  private initiated = false;

  private observer = Observer.getInstance();

  constructor() {
    this.getFilterData();
    this.createFilterTags();
  }

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

        this.initiated = true;
      })
      .catch((error) => new ErrorMessage().showMessage(error.message));
  }

  public isInit() {
    return this.initiated;
  }

  public getFilterHeaderElement() {
    const headerElement = this.filterHeader.getCreator().getElement();
    return headerElement;
  }

  public createFilterTags() {
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
      filters.splice(index);
    }
    this.observer.notify(EventName.UPDATE_CATALOG_CARDS);
  }

  public getWhereCondition(): string {
    const wheres: string[] = [];

    this.usedFilter.genre.forEach((filter) => {
      wheres.push(Template.WHERE_MASK.replace('%ATTRIBUTE%', FilterAttribute.GENGE).replace('%VALUE%', filter));
    });
    this.usedFilter.Platform.forEach((filter) => {
      wheres.push(Template.WHERE_MASK.replace('%ATTRIBUTE%', FilterAttribute.PLATFORM).replace('%VALUE%', filter));
    });
    this.usedFilter.developer.forEach((filter) => {
      wheres.push(Template.WHERE_MASK.replace('%ATTRIBUTE%', FilterAttribute.DEVELOPER).replace('%VALUE%', filter));
    });

    return wheres.join(' and ');
  }
}
