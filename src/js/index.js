import '../css/styles.css';
import '../css/main.css';

import API from './api';
import UI from './ui';

import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-aio-3.2.5.min.js';

import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

//
const debouncedFn = debounce(onTextInput, DEBOUNCE_DELAY);

UI.searchBoxUI.addEventListener('input', event => {
  debouncedFn(event.currentTarget.value);
});

function onTextInput(searchPattern) {
  if (searchPattern === '') {
    UI.clearCountryCard();
    UI.clearCountryList();
    return;
  }

  const fields = 'name,capital,population,flags,languages';
  const searchString = `name/${searchPattern.trim()}?fields=${fields}`;

  API.fetchCountry(searchString)
    .then(API.parseCountries)
    .then(API.drawCountries)
    .catch(onFetchError);
}

function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
  // Notiflix.Notify.failure(`${error}`);
  console.log(`${error}`);
}
