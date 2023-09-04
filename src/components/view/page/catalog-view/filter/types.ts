import FilterAttribute from './enum';

type FilterData = {
  [key in FilterAttribute]: string[];
};

export default FilterData;
