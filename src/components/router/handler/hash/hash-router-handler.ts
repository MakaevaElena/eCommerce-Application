import DefaultRouterHandler from '../default-router-handler';

export default class HashRouterHandler extends DefaultRouterHandler {
  constructor(callbackRouter: () => void) {
    const handlerParams = {
      nameEvent: 'hashchange',
      locationField: 'hash',
      callback: callbackRouter,
    };
    super(handlerParams);

    window.addEventListener('hashchange', this.navigate.bind(this));
  }
}
