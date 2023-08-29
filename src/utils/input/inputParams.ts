export type InputParams = {
  attributes: InputAttributes;
  classNames?: Array<string>;
  group?: string;
  callback?: Array<[CallbackListener, string]>;
};

export type InputAttributes = {
  type: string;
  name?: string;
  placeholder?: string;
  title?: string;
  pattern?: string;
  max?: string;
  list?: string;
};

export type CallbackListener = (event: Event) => void;

export type Group = 'main' | 'shipping' | 'billing';
