import NumberInput from '../../../../shared/number-input/number-input';
import FilterAttribute from './enum';

type FilterData = {
  [key in FilterAttribute]: string[];
};

type PriceFilterGroup = {
  minPrice: NumberInput;
  maxPrice: NumberInput;
};

export { FilterData, PriceFilterGroup };
