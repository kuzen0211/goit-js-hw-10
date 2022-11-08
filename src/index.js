import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

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

function clearMarkup() {
  listRef.innerHTML = '';
  infoRef.innerHTML = '';
}

function fetchCountries(name) {
  fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data.length > 10) {
        throw new Error('max country');
      }
      renderCountry(data);
    })
    .catch(error => {
      if (error.message === '404') {
        clearMarkup();
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
      if (error.message === 'max country') {
        clearMarkup();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
      }
    });
}

function renderCountry(countries) {
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
