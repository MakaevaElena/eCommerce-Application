import DefaultRouterHandler, { RequestParams, RouterHandlerParam } from '../default-router-handler';

export default class HistoryRouterHandler extends DefaultRouterHandler {
  constructor(callbackRouter: (param: RequestParams) => void) {
    const handlerParams: RouterHandlerParam = {
      nameEvent: 'popstate',
      locationField: 'pathname',
      callback: callbackRouter,
    };
    super(handlerParams);

    window.addEventListener(handlerParams.nameEvent, this.navigate.bind(this));
  }
}
