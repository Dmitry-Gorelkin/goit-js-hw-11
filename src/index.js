import './css/styles.css';
import fetchImages from './js/fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btn: document.querySelector('.load-more'),
};

let request = null;
let page = 1;

let gallery = new SimpleLightbox('.gallery a', {
  captionPosition: 'bottom',
  captionSelector: 'img',
});

function onSubmit(e) {
  e.preventDefault();
  reRequest();

  request = e.target[0].value.trim();
  if (!request) {
    errorRequest();
    return;
  }

  fetchGallery(request, page)
    .then(data => {
      Notify.info(`Hooray! We found ${data.totalHits} images.`, {
        timeout: 5000,
      });
    })
    .catch(errorRequest);
}

function onLoadMore() {
  refs.btn.classList.add('visually-hidden');
  page += 1;

  fetchGallery(request, page).then(fn);
}

function fetchGallery(request, page) {
  return fetchImages(request, page)
    .then(data => {
      if (!data.hits.length) {
        throw new Error(response.status);
      }
      return data;
    })
    .then(data => {
      galleryRender(data.hits);
      gallery.refresh();
      return data;
    })
    .then(data => {
      if (data.hits.length < 40) {
        endRequest();
        return;
      }

      refs.btn.classList.remove('visually-hidden');
      return data;
    });
}

function galleryRender(arr) {
  const images = arr
    .map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL }) => {
      return `<div class="photo-card">
          <a class="link" href="${largeImageURL}"
            ><img class="photo-card-img" src="${webformatURL}" alt="${tags}" loading="lazy"
          /></a>
          <div class="photo-card-info">
            <p class="info-item"><b>Likes</b> ${likes}</p>
            <p class="info-item"><b>Views</b> ${views}</p>
            <p class="info-item"><b>Comments</b> ${comments}</p>
            <p class="info-item"><b>Downloads</b> <span>${downloads}</span></p>
          </div>
        </div>`;
    })
    .join('');

  refs.gallery.insertAdjacentHTML('beforeend', images);
}

function reRequest() {
  page = 1;
  refs.gallery.innerHTML = '';
  refs.btn.classList.add('visually-hidden');
}

function errorRequest() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
    timeout: 5000,
  });
}

function endRequest() {
  Notify.warning("We're sorry, but you've reached the end of search results.", {
    timeout: 5000,
  });
}

function fn() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

refs.form.addEventListener('submit', onSubmit);
refs.btn.addEventListener('click', onLoadMore);
