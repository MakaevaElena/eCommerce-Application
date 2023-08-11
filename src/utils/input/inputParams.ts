export type InputParams = {
  classNames: Array<string>;
  textContent: string;
  callback: CallbackClick;
  attributes: InputAttributes;
};

type InputAttributes = {
  type: string;
  name: string;
  placeholder: string;
  Required: boolean;
};

export type CallbackClick = (event: Event) => void;
