enum PostalPaterns {
  SIX_DIGITS = '^[0-9]{6,6}$',
  FIVE_DIGITS = '^[0-9]{5,5}$',
  FOUR_DIGITS = '^[0-9]{4,4}$',
  TWO_DIGITS = '^[0-9]{2,2}$',
  TWO_LETTERS_THREE_DIGITS = '^[A-Z][A-Z][0-9]{3,3}$',
  TWO_LETTERS_FOUR_DIGITS = '^[A-Z][A-Z][0-9]{4,4}$',
  TWO_LETTERS_FIVE_DIGITS = '^[A-Z][A-Z][0-9]{5,5}$',
}

export default PostalPaterns;
