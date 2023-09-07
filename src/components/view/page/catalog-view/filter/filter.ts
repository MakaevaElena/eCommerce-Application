import ProductApi, { Template } from '../../../../../api/products-api';
import EventName from '../../../../../enum/event-name';
import Observer from '../../../../../observer/observer';
import ErrorMessage from '../../../../message/error-message';
import NumberInput from '../../../../shared/number-input/number-input';
import FilterAttribute from './enum';
import FilterHeaderView from './filter-header/filter-header';
import FilterPopup from './filter-popup/filter-popup';
import { FilterData, PriceFilterGroup } from './types';

export default class Filter {
  private readonly WRONG_PRICE_RANGE = `Price filter didn't applied.\n Wrong price range: %MIN% to %MAX%`;

  private readonly MIN_PRICE_TITLE = 'min';

  private readonly MAX_PRICE_TITLE = 'max';

  private readonly CURRENCY_FACTOR = 100;

  private filterData: FilterData = this.getEmptyFilterArray();

  private filterUsed: FilterData = this.getEmptyFilterArray();

  private filterPriceData: PriceFilterGroup = this.getEmptyPriceData();

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

  private getEmptyPriceData(): PriceFilterGroup {
    return { minPrice: new NumberInput(this.MIN_PRICE_TITLE, ''), maxPrice: new NumberInput(this.MAX_PRICE_TITLE, '') };
  }

  private getEmptyFilterArray(): FilterData {
    return { genre: [], Platform: [], developer: [] };
  }

  public clearFilters() {
    this.filterUsed = this.getEmptyFilterArray();
    this.filterPriceData = this.getEmptyPriceData();
    this.createFilterTags();
  }

  private showFilterPopup() {
    const popup = new FilterPopup(this.filterData, this.filterUsed, this.filterPriceData).getDialog();
    document.body.prepend(popup);
    popup.showModal();
  }

  private createFilterTags() {
    this.filterHeader.clearFilterTags();

    this.filterUsed.genre.forEach((filter) => {
      this.filterHeader.addFilterTag(
        FilterAttribute.GENGE,
        filter,
        this.deleteFilterTag.bind(this, this.filterUsed.genre, filter)
      );
    });
    this.filterUsed.Platform.forEach((filter) => {
      this.filterHeader.addFilterTag(
        FilterAttribute.PLATFORM,
        filter,
        this.deleteFilterTag.bind(this, this.filterUsed.Platform, filter)
      );
    });
    this.filterUsed.developer.forEach((filter) => {
      this.filterHeader.addFilterTag(
        FilterAttribute.DEVELOPER,
        filter,
        this.deleteFilterTag.bind(this, this.filterUsed.developer, filter)
      );
    });
  }

  private deleteFilterTag(filters: string[], filterValue: string) {
    const index = filters.indexOf(filterValue);
    if (index >= 0) {
      filters.splice(index, 1);
    }
    this.observer.notify(EventName.UPDATE_CATALOG_CARDS);
    this.observer.notify(EventName.UPDATE_FILTER_TAGS);
  }

  public getFilterCondition(): string[] {
    const genreFilter = this.getFilterForArrtibute(Template.ENUM_ATTRIBUTE_MASK, FilterAttribute.GENGE);
    const platformFilter = this.getFilterForArrtibute(Template.ENUM_ATTRIBUTE_MASK, FilterAttribute.PLATFORM);
    const developerFilter = this.getFilterForArrtibute(Template.TEXT_ATTRIBUTE_MASK, FilterAttribute.DEVELOPER);
    const priceFilter = this.getFilterForPrice(Template.PRICE_FILTER_MASK);

    const filters: string[] = [genreFilter, platformFilter, developerFilter, priceFilter];

    return filters.filter((filter) => filter);
  }

  private getFilterForPrice(template: string): string {
    const minPrice = this.filterPriceData.minPrice.value || '0';
    const maxPrice = this.filterPriceData.maxPrice.value || '0';

    if (+minPrice > +maxPrice || +minPrice < 0 || +maxPrice < 0) {
      new ErrorMessage().showMessage(this.WRONG_PRICE_RANGE.replace('%MIN%', minPrice).replace('%MAX%', maxPrice));
      return '';
    }
    if (+minPrice === 0 && +maxPrice === 0) {
      return '';
    }

    this.filterPriceData.minPrice.value = minPrice;

    const filter = template
      .replace('%MIN%', (+minPrice * this.CURRENCY_FACTOR).toString())
      .replace('%MAX%', (+maxPrice * this.CURRENCY_FACTOR).toString());

    return filter;
  }

  private getFilterForArrtibute(template: string, attributeKey: FilterAttribute): string {
    const values: string[] = [];

    this.filterUsed[attributeKey].forEach((filter) => values.push(`"${filter}"`));

    const filter =
      values.length > 0 ? template.replace('%ATTRIBUTE%', attributeKey).replace('%VALUE%', values.join(',')) : '';

    return filter;
  }
}
