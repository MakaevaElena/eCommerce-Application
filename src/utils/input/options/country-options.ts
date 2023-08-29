import InputsList from '../../../components/view/page/registration-view/inputs-params/inputs-list';

export default class CountryOptions {
  private countrysList: Array<Array<string>>;

  private countryListElement: HTMLDataListElement;

  constructor() {
    this.countrysList = this.createCountryList();

    this.countryListElement = this.createCountryListElement();
  }

  getListElement() {
    return this.countryListElement;
  }

  getCountryList() {
    return this.countrysList;
  }

  private createCountryListElement(): HTMLDataListElement {
    const countryListElement = document.createElement('datalist');
    countryListElement.id = InputsList.COUNTRY;

    const optionValues = this.createCountryList().flat().sort();
    optionValues.forEach((optionValue) => {
      const optionElement = this.createOptionElement(optionValue);
      countryListElement.append(optionElement);
    });

    return countryListElement;
  }

  private createOptionElement(value: string): HTMLOptionElement {
    const optionElement = document.createElement('option');
    optionElement.value = value;
    return optionElement;
  }

  private createCountryList(): Array<Array<string>> {
    const sixDigitsPostalCodeCountries = [
      'Belarus BY',
      'China CN',
      'Colombia CO',
      'Ecuador EC',
      'Kazakhstan KZ',
      'Kyrgyzstan KG',
      'Malawi MW',
      'Nigeria NG',
      'Romania RO',
      'Russia RU',
      'Singapore SG',
      'Tajikistan TJ',
      'Trinidad and Tobago TT',
      'Turkmenistan TM',
      'Uzbekistan UZ',
      'India IN',
    ];
    const fiveDigitsPostalCodeCountries = [
      'Czech Republic CZ',
      'Greece CR',
      'Slovakia SK',
      'Sweden SE',
      'Algeria DZ',
      'Bhutan BT',
      'Bosnia and Herzegovina BA',
      'Costa Rica CR',
      'Croatia HR',
      'Cuba CU',
      'Dominican Republic DO',
      'Egypt EG',
      'Estonia EE',
      'Finland FI',
      'France FR',
      'Germany DE',
      'Guatemala GT',
      'Indonesia ID',
      'Iraq IQ',
      'Italy IT',
      'Jordan JO',
      'Kenya KE',
      'Korea, South KR',
      'Kosovo XK',
      'Kuwait KW',
      'Laos LA',
      'Malaysia MY',
      'Maldives MV',
      'Mauritius MU',
      'Mexico MX',
      'Mongolia MN',
      'Montenegro ME',
      'Morocco MA',
      'Myanmar MM',
      'Namibia NA',
      'Nepal NP',
      'Nicaragua NI',
      'Pakistan PK',
      'Puerto Rico PR',
      'Senegal SN',
      'Serbia RS',
      'Spain ES',
      'Sri Lanka LK',
      'Sudan SD',
      'Tanzania TZ',
      'Thailand TH',
      'Turkey TR',
      'Ukraine UA',
      'United States US',
      'Uruguay UY',
      'Vietnam VN',
      'Zambia ZM',
      'Saudi Arabia SA',
      'Iran IR',
      'Peru PE',
      'Åland AX',
      'Lebanon LB',
      'Brazil BR',
      'American Samoa AS',
      'Guam GU',
      'Marshall Islands MH',
      'Micronesia FM',
      'Northern Mariana Islands MP',
      'Palau PW',
      'U.S. Virgin Islands VI',
    ];
    const fourDigitsPostalCodeCountries = [
      'Guinea',
      'Iceland',
      'Lesotho',
      'Madagascar',
      'Oman',
      'Palestine',
      'Papua New Guinea',
      'Afghanistan AF',
      'Albania AL',
      'Argentina AR',
      'Armenia AM',
      'Australia AU',
      'Austria AT',
      'Bangladesh BD',
      'Belgium BE',
      'Bulgaria BG',
      'Cape Verde CV',
      'Christmas Island CX',
      'Greenland GL',
      'Hungary HU',
      'Liechtenstein LI',
      'Luxembourg LU',
      'New Zealand NZ',
      'Niger NE',
      'North Macedonia MK',
      'Norway NO',
      'Panama PA',
      'Paraguay PY',
      'Philippines PH',
      'Portugal PT',
      'Singapore SG',
      'South Africa ZA',
      'Switzerland CH',
      'Svalbard and Jan Mayen SJ',
      'Tunisia TN',
      'Portugal PT',
      'Slovenia SI',
      'Venezuela VE',
    ];
    const twoDigitsPostalCodeCountries = ['Jamaica JM', 'Singapore SG'];
    const twoLetterThreeDigitsPostalCodeCountries = ['Faroe Islands', 'Barbados', 'Andorra AD'];
    const twoLetterFourDigitsPostalCodeCountries = [
      'Azerbaijan AZ',
      'Latvia LV',
      'British Virgin Islands VG',
      'Saint Kitts and Nevis KN',
      'Saint Vincent and the Grenadines VC',
      'Samoa WS',
      'Moldova MD',
    ];
    const twoLetterFiveDigitsPostalCodeCountries = ['Lithuania LT', 'Barbados BB'];
    const allCountries = [
      sixDigitsPostalCodeCountries,
      fiveDigitsPostalCodeCountries,
      fourDigitsPostalCodeCountries,
      twoDigitsPostalCodeCountries,
      twoLetterThreeDigitsPostalCodeCountries,
      twoLetterFourDigitsPostalCodeCountries,
      twoLetterFiveDigitsPostalCodeCountries,
    ];
    return allCountries;
  }
}
