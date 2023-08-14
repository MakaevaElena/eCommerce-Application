export type InputParams = {
  classNames: Array<string>;
  attributes: InputAttributes;
  callback?: Callback;
  eventName?: keyof HTMLElementTagNameMap;
};

export type InputAttributes = {
  type: string;
  name: string;
  placeholder: string;
  title?: string;
  pattern?: string;
};

export type Callback = (event: Event) => void;
