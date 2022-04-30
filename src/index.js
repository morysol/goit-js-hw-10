import './css/styles.css';
import countryCardTpl from '../templates/country-card.hbs';
import countryListTpl from '../templates/countries-list.hbs';

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-aio-3.2.5.min.js';

//
// var debounce = require('lodash.debounce');
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const searchBoxUI = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const debouncedFn = debounce(onTextInput, DEBOUNCE_DELAY);

searchBoxUI.addEventListener('input', event => {
  debouncedFn(event.currentTarget.value);
});

function onTextInput(searchPattern) {
  // console.log(searchPattern);

  const url = `https://restcountries.com/v3.1/name/${searchPattern.trim()}?fields=name,capital,population,flags,languages`;

  fetch(url)
    .then(response => {
      if (!response.ok || response.status === 404) {
        console.clear();
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      // console.log('---------', data);
      // console.log('+++++++', data.length);
      if (data.length === 1) {
        const {
          name: { official: country },
          capital,
          population,
          flags: { svg: flag },
          languages,
        } = data[0];

        const countryCapital = capital.join('');
        const countryLanguages = Object.values(languages).join('');
        // console.log(country, countryCapital, population, flag, countryLanguages);

        const countryCardMarkup = countryCardTpl({
          country,
          countryCapital,
          population,
          flag,
          countryLanguages,
        });
        renderCountryCard(countryCardMarkup);
      } else if (data.length > 1 && data.length < 11) {
        const countryListMarkup = ''.concat(
          '<ul class="countries__list">',
          data
            .map(data =>
              countryListTpl({
                flag: data.flags.svg,
                country: data.name.official,
              }),
            )
            .join(''),
          '</ul>',
        );

        renderCountryList(countryListMarkup);
      } else {
        Notiflix.Notify.success('Too many matches found. Please enter a more specific name.');
      }
    })
    .catch(error => Notiflix.Notify.failure('Oops, there is no country with that name'));
}

function renderCountryCard(markup) {
  countryInfo.innerHTML = markup;
}
function renderCountryList(markup) {
  countryList.innerHTML = markup;
}
