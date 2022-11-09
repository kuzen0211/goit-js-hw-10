import { renderCountry, clearMarkup } from '../index';
import Notiflix from 'notiflix';

export function fetchCountries(name) {
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
