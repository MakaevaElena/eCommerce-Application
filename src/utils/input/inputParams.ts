export type InputParams = {
  classNames: Array<string>;
  textContent: string;
  callback: CallbackClick;
  attributes: InputAttributes;
};

type InputAttributes = {
  type: string;
  name: string;
  title: string;
  placeholder?: string;
  pattern?: string;
};

export type CallbackClick = (event: Event) => void;
