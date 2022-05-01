const searchBoxUI = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function clearCountryCard() {
  countryInfo.innerHTML = '';
}

function clearCountryList() {
  countryList.innerHTML = '';
}

export default { searchBoxUI, countryList, countryInfo, clearCountryCard, clearCountryList };
