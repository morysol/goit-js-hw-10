const searchBoxUI = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

function clearCountryCard() {
  UI.countryInfo.innerHTML = '';
}

function clearCountryList() {
  UI.countryList.innerHTML = '';
}

export default { searchBoxUI, countryList, countryInfo, clearCountryCard, clearCountryList };
