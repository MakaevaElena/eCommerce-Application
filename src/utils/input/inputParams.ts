export type InputParams = {
  classNames: Array<string>;
  group: Group;
  attributes: InputAttributes;
  callback?: Array<[CallbackListener, string]>;
  eventName?: string;
};

export type InputAttributes = {
  type: string;
  name: string;
  placeholder?: string;
  title?: string;
  pattern?: string;
  max?: string;
  list?: string;
};

export type CallbackListener = (event: Event) => void;
// export type Callback = (event: Event) => void;

export type Group = 'main' | 'shipping' | 'billing';
