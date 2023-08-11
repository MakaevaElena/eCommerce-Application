export type RequestParams = {
  path: string;
  resource: string;
};

export enum LocationField {
  PATHNAME = 'pathname',
  HASH = 'hash',
}

export type NavigateParam = Event;

export type RouterHandlerParam = {
  nameEvent: keyof WindowEventMap;
  locationField: LocationField;
};

export default class RouterHandler {
  private params: RouterHandlerParam;

  private callback: (params: RequestParams) => void;

  constructor(callback: (params: RequestParams) => void) {
    this.callback = callback;

    this.params = {
      nameEvent: 'hashchange',
      locationField: LocationField.HASH,
    };

    window.addEventListener(this.params.nameEvent, this.windowEventHandler.bind(this));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private windowEventHandler(e: Event) {
    const path = window.location[this.params.locationField].slice(1);
    this.navigate(path);
  }

  public navigate(url: string) {
    console.log('url: ', url);
    this.setAddressLine(url);

    const location = window.location[this.params.locationField].slice(1);
    const urlString = url || location;
    const fullPath = urlString.split('/');

    const result: RequestParams = {
      path: '',
      resource: '',
    };

    [result.path = '', result.resource = ''] = fullPath;

    this.callback(result);
  }

  // eslint-disable-next-line class-methods-use-this
  private setAddressLine(url: string) {
    window.history.pushState(null, '', `#${url}`);
  }
}
