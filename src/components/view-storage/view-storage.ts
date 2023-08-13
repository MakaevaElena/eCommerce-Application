import DefaultView from '../view/default-view';

export default class ViewStorage {
  private map: Map<string, DefaultView> = new Map();

  public get(viewName: string) {
    return this.map.get(viewName);
  }

  public set(viewName: string, view: DefaultView) {
    this.map.set(viewName, view);
  }

  public has(viewName: string) {
    return this.map.has(viewName);
  }
}
