export type RequestParams = {
  path: string;
  resource: string;
};

export enum LocationField {
  PATHNAME = 'pathname',
  HASH = 'hash',
}

export type NavigateParam = PopStateEvent | string;

export type RouterHandlerParam = {
  nameEvent: keyof WindowEventMap;
  locationField: LocationField;
};

export default class HistoryRouterHandler {
  private params: RouterHandlerParam;

  private callback: (params: RequestParams) => void;

  private handler: (param: NavigateParam) => void;

  constructor(callback: (params: RequestParams) => void) {
    this.params = {
      nameEvent: 'popstate',
      locationField: LocationField.PATHNAME,
    };

    this.callback = callback;
    this.handler = this.navigate.bind(this);

    window.addEventListener(this.params.nameEvent, this.handler);
  }

  public disable() {
    window.removeEventListener(this.params.nameEvent, this.handler);
  }

  public navigate(url: NavigateParam) {
    if (typeof url === 'string') {
      this.setHistory(url);
    }

    const location = window.location[this.params.locationField].slice(1);
    const urlString = typeof url === 'string' ? url || location : location;
    const fullPath = urlString.split('/'); // TODO: must depend on this.params.locationField

    const result: RequestParams = {
      path: '',
      resource: '',
    };

    [result.path = '', result.resource = ''] = fullPath;

    this.callback(result);
  }

  // eslint-disable-next-line class-methods-use-this
  private setHistory(url: string) {
    window.history.pushState(null, '', `/${url}`);
  }
}
