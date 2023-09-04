enum TextContent {
  ADD_SHIPPING_ADDRESS_BUTTON = 'add shipping address',
  ADD_BILLING_ADDRESS_BUTTON = 'add billing address',

  DELETE_ADDRESS_BUTTON = 'delete this address',
  MAKE_ADDRESS_SHIPPING_BUTTON = 'make this address shipping',
  MAKE_ADDRESS_BILLING_BUTTON = 'make this address billing',
  MAKE_ADDRESS_SHIPPING_DEFAULT_BUTTON = 'make this address default shipping',
  MAKE_ADDRESS_BILLING_DEFAULT_BUTTON = 'make this address default billing',

  TITLE_ADDRESS_SHIPPING = 'shipping address',
  TITLE_ADDRESS_BILLING = 'billing address',

  DEFAULT_ADDRESS_SHIIPPING = 'default shipping',
  DEFAULT_ADDRESS_BILLING = 'default billling',

  REDACTION_MODE_BUTTON = 'edit',
  CONFIRM_BUTTON = 'confirm',
  CANCEL_BUTTON = 'cancel',

  CONFIRM_MESSAGE_INFO = 'new data successfully saved',
  CANCEL_MESSAGE_INFO = 'modifications have been canceled',

  CHANGE_COUNTRY_INFO = "Don't forget to change the postal code according to the selected country",
  COUNTRY_CHANGING_OK = 'data successfully changed',

  CHANGE_PASSWORD = 'change password',
  CHANGE_PASSWORD_INFO_IS_OK = 'password successfully changed',

  ADD_ADRESS_OK = 'the address was successfully added',
  CHANGE_ADRESS_OK = 'the address was successfully changed',

  VALIDATE_INPUT_BEFORE_SUBMIT = 'Make sure you fill out your account correctly',
  VALIDATE_FORM_BEFORE_SUBMIT = 'Make sure you fill out all fields correctly',

  NEW_PASSWORD_FIELD_LABEL = 'enter the new password',
  REPEAT_NEW_PASSWORD_FIELD_LABEL = 'repeat the new password',
  OLD_PASSWORD_FIELD_LABEL = 'enter the existing password',
}

export default TextContent;
