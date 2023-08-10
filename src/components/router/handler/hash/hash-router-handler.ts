import HistoryRouterHandler, { LocationField, RequestParams } from '../history-router-handler';

export default class HashRouterHandler extends HistoryRouterHandler {
  constructor(callback: (params: RequestParams) => void) {
    super(params);

    this.params = {
      nameEvent: 'hashchange',
      locationField: LocationField.HASH,
    };

    this.callback = callback;
    this.windowHandler = this.windowEventHandler;

    window.addEventListener(this.params.nameEvent, this.windowHandler);
  }
}
