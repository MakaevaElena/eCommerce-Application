type CategoryType = {
  id: string;
  name: string;
  children?: CategoryType[];
};

export default CategoryType;
