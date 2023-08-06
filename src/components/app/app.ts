import Favicon from '../favicon/favicon';
import LoginView from '../view/page/login-vew/login-view';
import MainView from '../view/page/main-view/main-view';
import RegistrationView from '../view/page/registration-view/registration-view';

export default class App {
  private favicon: Favicon;

  private mainView: MainView;

  private loginView: LoginView;

  private registrationView: RegistrationView;

  constructor() {
    this.favicon = new Favicon();
    this.mainView = new MainView();
    this.loginView = new LoginView();
    this.registrationView = new RegistrationView();
  }

  init() {
    document.head.append(this.favicon.getElement());

    document.body.append(this.mainView.getElement());
    document.body.append(this.loginView.getElement());
    document.body.append(this.registrationView.getElement());
  }
}
