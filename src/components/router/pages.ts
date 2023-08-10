/**
 * url resource
 */
enum Pages {
  INDEX = 'index',
  LOGIN = 'login',
  REGISTRATION = 'registration',
  PRODUCT = 'product',
  NOT_FOUND = '404',
  EMPTY = '',
}

enum LinkName {
  INDEX = 'Main',
  LOGIN = 'Log In',
  REGISTRATION = 'Registration',
  PRODUCT = 'Catalog',
}

const ID_SELECTOR = '{id}';

export { Pages, LinkName, ID_SELECTOR };
