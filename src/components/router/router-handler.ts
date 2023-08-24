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

    window.addEventListener(this.params.nameEvent, this.hashchangeEventHandler.bind(this));
  }

  private hashchangeEventHandler(e: Event) {
    let path = '';
    if (e instanceof HashChangeEvent && e.currentTarget instanceof Window) {
      path = e.currentTarget.location.hash.slice(1);
    }
    this.navigate(path);
  }

  public navigate(url: string) {
    window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${url}`;

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
}
