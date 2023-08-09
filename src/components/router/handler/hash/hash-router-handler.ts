import HistoryRouterHandler, { RequestParams } from '../default-router-handler';

export default class HashRouterHandler extends HistoryRouterHandler {
  constructor(callbackRouter: (param: RequestParams) => void) {
    const handlerParams = {
      nameEvent: 'hashchange',
      locationField: 'hash',
      callback: callbackRouter,
    };
    super(handlerParams);

    window.addEventListener(handlerParams.nameEvent, this.navigate.bind(this));
  }
}
