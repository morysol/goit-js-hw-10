import './css/styles.css';
import countryCardTpl from '../templates/country-card.hbs';
import countryListTpl from '../templates/countries-list.hbs';

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-aio-3.2.5.min.js';

import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchBoxUI = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

//
const debouncedFn = debounce(onTextInput, DEBOUNCE_DELAY);

searchBoxUI.addEventListener('input', event => {
  debouncedFn(event.currentTarget.value);
});

function onTextInput(searchPattern) {
  if (searchPattern === '') {
    clearCountryCard();
    clearCountryList();
    return;
  }

  const baseURL = 'https://restcountries.com/v3.1/';
  const fields = 'name,capital,population,flags,languages';
  const url = `${baseURL}name/${searchPattern.trim()}?fields=${fields}`;

  fetch(url)
    .then(response => {
      if (!response.ok || response.status === 404) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(fetchedCountries => {
      if (fetchedCountries.length === 1) {
        const {
          name: { official: country },
          capital: countryCapital = capital.join(''),
          population,
          flags: { svg: flag },
          languages: countryLanguages = Object.values(languages).join(''),
        } = fetchedCountries[0];

        const countryCardMarkup = makeCountryCardMarkup({
          country,
          countryCapital,
          population,
          flag,
          countryLanguages,
        });

        clearCountryList();
        renderCountryCard(countryCardMarkup);
      } else if (fetchedCountries.length > 1 && fetchedCountries.length < 11) {
        const countryListMarkup = makecountryListMarkup(fetchedCountries);

        clearCountryCard();
        renderCountryList(countryListMarkup);
      } else {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      Notiflix.Notify.failure(`${error}`);
    });
}

function renderCountryCard(markup) {
  countryInfo.innerHTML = markup;
}
function clearCountryCard() {
  countryInfo.innerHTML = '';
}
function renderCountryList(markup) {
  countryList.innerHTML = markup;
}
function clearCountryList() {
  countryList.innerHTML = '';
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
  return ''.concat(
    '<ul class="countries__list">',
    countryList
      .map(countryList =>
        countryListTpl({
          flag: countryList.flags.svg,
          country: countryList.name.official,
        }),
      )
      .join(''),
    '</ul>',
  );
}
