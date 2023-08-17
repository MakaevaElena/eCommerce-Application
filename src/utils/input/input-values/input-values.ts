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
  EMAIL = 'EMAIL',
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
  SIX_DIGITS = 'Must consist of six numbers',
  FIVE_DIGITS = 'Must consist of five numbers',
  FOUR_DIGITS = 'Must consist of four numbers',
  THREE_DIGITS = 'Must consist of three numbers',
  TWO_DIGITS = 'Must consist of two numbers',
  TWO_LETTERS_FOUR_DIGITS = 'Must consist of two capital letters and four numbers',
  TWO_LETTERS_FIVE_DIGITS = 'Must consist of two capital letters and five numbers',
}

export enum InputPatterns {
  PASSWORD = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$',
  TEXT = '^(?!.*\\d)(?!.*[!@#$%^&*])[А-Яа-яA-Za-z\\d!@#$%^&*]{1,}$',
  SIX_DIGITS = '^[0-9]{6,6}$',
  FIVE_DIGITS = '^[0-9]{5,5}$',
  FOUR_DIGITS = '^[0-9]{4,4}$',
  THREE_DIGITS = '^[0-9]{3,3}$',
  TWO_DIGITS = '^[0-9]{2,2}$',
  TWO_LETTERS_FOUR_DIGITS = '^[A-Z][A-Z][0-9]{6,6}$',
  TWO_LETTERS_FIVE_DIGITS = '^[A-Z][A-Z][0-9]{7,7}$',
  POSTAL = 'postal',
  COUNTRY = 'country',
  DATE_OF_BIRTH_MAX = '13',
}

export enum InputCountries {}

export enum InputLabels {
  SHIPPING_ADDRESS = 'DELIVERY ADDRESS',
  BILLING_ADDRESS = 'BILLING ADDRESS',
}
