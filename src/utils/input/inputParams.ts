export type InputParams = {
  classNames: Array<string>;
  callback: CallbackClick;
  attributes: InputAttributes;
};

export type InputAttributes = {
  type: string;
  name: string;
  placeholder: string;
  title?: string;
  pattern?: string;
};

export type CallbackClick = (event: Event) => void;
