export enum InputTittles {
  PASSWORD = 'Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
}

export enum InputPatterns {
  PASSWORD = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
}

export enum InputPlaceholder {
  PASSWORD = 'password',
}
