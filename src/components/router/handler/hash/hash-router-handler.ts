import HistoryRouterHandler, { LocationField, RequestParams } from '../history-router-handler';

export default class HashRouterHandler extends HistoryRouterHandler {
  constructor(callback: (params: RequestParams) => void) {
    super(callback);

    this.params = {
      nameEvent: 'hashchange',
      locationField: LocationField.HASH,
    };

    window.addEventListener(this.params.nameEvent, this.windowHandler);
  }
}
