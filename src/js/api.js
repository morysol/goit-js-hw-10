import countryCardTpl from '../templates/country-card.hbs';
import countryListTpl from '../templates/countries-list.hbs';
import UI from './ui';

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-aio-3.2.5.min.js';

const BASE_URL = 'https://restcountries.com/v3.1/';

function fetchCountry(searchString) {
  return fetch(`${BASE_URL}${searchString}`).then(response => {
    if (!response.ok || response.status === 404) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

function parseCountries(fetchedCountries) {
  if (fetchedCountries.length === 1) {
    const {
      name: { official: country },
      capital: countryCapital = capital.join(''),
      population,
      flags: { svg: flag },
      languages,
    } = fetchedCountries[0];

    const countryLanguages = Object.values(languages).join(', ');
    const countryCardMarkup = makeCountryCardMarkup({
      country,
      countryCapital,
      population,
      flag,
      countryLanguages,
    });

    return { country: countryCardMarkup, countries: '' };
  } else if (fetchedCountries.length > 1 && fetchedCountries.length < 11) {
    const countryListMarkup = makecountryListMarkup(fetchedCountries);

    const renderedMarkup = { country: '', countries: countryListMarkup };

    return renderedMarkup;
  } else {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');

    return { country: '', countries: '' };
  }
}

function makeCountryCardMarkup({ country, countryCapital, population, flag, countryLanguages }) {
  return countryCardTpl({
    country,
    countryCapital,
    population,
    flag,
    countryLanguages,
  });
}

function makecountryListMarkup(countryList) {
  return countryList
    .map(countryList =>
      countryListTpl({
        flag: countryList.flags.svg,
        country: countryList.name.official,
      }),
    )
    .join('');
}

function drawCountries(markupCountries) {
  const { country, countries } = markupCountries;
  renderCountryList(countries);
  renderCountryCard(country);
}

function renderCountryCard(markup) {
  UI.countryInfo.innerHTML = markup;
}

function renderCountryList(markup) {
  UI.countryList.innerHTML = markup;
}

export default { fetchCountry, parseCountries, drawCountries };
