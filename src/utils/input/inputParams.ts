export type InputParams = {
  classNames: Array<string>;
  attributes: InputAttributes;
  callback?: CallbackClick;
  eventName?: Event;
};

export type InputAttributes = {
  type: string;
  name: string;
  placeholder?: string;
  title?: string;
  pattern?: string;
  max?: string;
};

export type CallbackClick = (event: Event) => void;
// export type Callback = (event: Event) => void;
