export enum InputTypes {
  PASSWORD = 'password',
  EMAIL = 'email',
  TEXT = 'text',
  DATE = 'date',
  CHECKBOX = 'checkbox',
}

export enum InputNames {
  PASSWORD = 'password',
  EMAIL = 'email',
  REPEAT_PASSWORD = 'repeat-password',
  FIRST_NAME = 'first-name',
  LAST_NAME = 'last-name',
  DATE_OF_BIRTH = 'date-of-birth',
  SHIPPING_CITY = 'shipping-city',
  SHIPPING_STREET = 'shipping-street',
  SHIPPING_POSTAL = 'shipping-postal',
  SHIPPING_COUNTRY = 'shipping-country',
  BILLING_CITY = 'billing-city',
  BILLING_STREET = 'billing-street',
  BILLING_POSTAL = 'billing-postal',
  BILLING_COUNTRY = 'country',
}

export enum InputPlaceholders {
  PASSWORD = 'Password',
  EMAIL = 'Email',
  REPEAT_PASSWORD = 'Repeat password',
  FIRST_NAME = 'First name',
  LAST_NAME = 'Last name',
  CITY = 'City',
  STREET = 'Street',
  POSTAL = 'Postal',
  COUNTRY = 'Country',
  DATE_OF_BIRTH = 'Date of birth',
}

export enum InputTittles {
  EMAIL_HINT = 'Must contain valid email address (example@gmail.com)',
  PASSWORD = 'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character (!@#$%^&*)',
  PASSWORD_REPEAT = 'The passwords must match',
  EASY_TEXT = 'Must contain at least one character',
  DATE_OF_BIRTH_HINT = 'Only 13 years old or older',
  TEXT = 'Must contain at least one character and no special characters or numbers',
  POSTAL_HINT = 'Must follow the format for the country (e.g., 12345 or A1B 2C3 for the U.S. and Canada, respectively)',
  COUNTRY_HINT = 'Must be a valid country from a predefined list or autocomplete field',
  WRONG_COUNTRY = 'Select country',
}

export enum InputPatterns {
  PASSWORD = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$',
  TEXT = '^(?!.*\\d)(?!.*[!@#$%^&*])[А-Яа-яA-Za-z\\d!@#$%^&*]{1,}$',
  DATE_OF_BIRTH_MAX = '13',
  EMAIL = '[a-z0-9]+[a-z0-9._%+\\-]+@[a-z]+\\.[a-z]{2,}',
}

export enum InputCountries {}

export enum InputLabels {
  SHIPPING_ADDRESS = 'DELIVERY ADDRESS',
  SHIPPING_ADDRESS_DEFAULT = 'DELIVERY ADDRESS (default)',
  BILLING_ADDRESS = 'BILLING ADDRESS',
  BILLING_ADDRESS_DEFAULT = 'BILLING ADDRESS (default)',
}
