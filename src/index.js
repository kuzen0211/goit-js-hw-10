import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';

const inputValue = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const infoRef = document.querySelector('.country-info');

inputValue.addEventListener(
  'input',
  debounce(() => {
    let name = inputValue.value.trim();
    if (name === '') {
      return clearMarkup;
    }
    fetchCountries(name);
  }, 300)
);

export function clearMarkup() {
  listRef.innerHTML = '';
  infoRef.innerHTML = '';
}

export function renderCountry(countries) {
  let markup = '';

  clearMarkup();

  markup = countries
    .map(
      country =>
        `<li class='country-list__item'>
        <img class='country-list__img' src="${country.flags.svg}" alt="flag of ${country.name.official}" width = 50 heigth = 30>${country.name.official}</li>`
    )
    .join('');

  listRef.insertAdjacentHTML('beforeend', markup);

  const itemRef = document.querySelector('.country-list__item');
  const imgRef = document.querySelector('.country-list__img');

  if (countries.length === 1) {
    itemRef.classList.add('country-list__item--country');
    imgRef.classList.add('country-list__img--size');

    markup = countries
      .map(
        ({ capital, population, languages }) => `
        <p class='country-info__params'>Capital: <b class='country-info__text'>${capital}</b></p>
        <p class='country-info__params'>Population: <b class='country-info__text'>${population}</b></p>
        <p class='country-info__params'>Languages: <b class='country-info__text'>${Object.values(
          languages
        ).join(',')}</b></p>
      `
      )
      .join('');
    infoRef.insertAdjacentHTML('beforeend', markup);
  }
}
