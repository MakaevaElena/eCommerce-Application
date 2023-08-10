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

export default class HistoryRouterHandler {
  private params: RouterHandlerParam;

  private callback: (params: RequestParams) => void;

  private windowHandler: (param: NavigateParam) => void;

  constructor(callback: (params: RequestParams) => void) {
    this.params = {
      nameEvent: 'popstate',
      locationField: LocationField.PATHNAME,
    };

    this.callback = callback;
    this.windowHandler = this.windowEventHandler;

    window.addEventListener(this.params.nameEvent, this.windowHandler);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private windowEventHandler(e: Event) {
    this.navigate(window.location[this.params.locationField]);
  }

  public disable() {
    window.removeEventListener(this.params.nameEvent, this.windowHandler);
  }

  public navigate(url: string) {
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
    window.history.pushState(null, '', `/${url}`);
  }
}
