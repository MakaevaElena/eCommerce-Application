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
  PASSWORD = 'PASSWORD',
  EMAIL = 'example@email.ru',
  REPEAT_PASSWORD = 'RETRY THE PASSWORD',
  FIRST_NAME = 'FIRST NAME',
  LAST_NAME = 'LAST NAME',
  DATE_OF_BIRTH = 'DAY OF BIRTH',
  CITY = 'CITY',
  STREET = 'STREET',
  POSTAL = 'POSTAL',
  COUNTRY = 'COUNTRY',
}

export enum InputTittles {
  PASSWORD = 'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
  EASY_TEXT = 'Must contain at least one character',
  DATE_OF_BIRTH_HINT = 'Only 13 years old or older',
  TEXT = 'Must contain at least one character and no special characters or numbers',
  POSTAL_HINT = 'Must follow the format for the country (e.g., 12345 or A1B 2C3 for the U.S. and Canada, respectively)',
  COUNTRY_HINT = 'Must be a valid country from a predefined list or autocomplete field',
}

export enum InputPatterns {
  PASSWORD = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$',
  TEXT = '^(?!.*\\d)(?!.*[!@#$%^&*])[А-Яа-яA-Za-z\\d!@#$%^&*]{1,}$',
  EASY_TEXT = '',
  DATE = 'date?',
  POSTAL = 'postal',
  COUNTRY = 'country',
}
