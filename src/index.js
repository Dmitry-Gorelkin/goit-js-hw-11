import './css/styles.css';
import fetchImages from './js/fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btn: document.querySelector('#btn-load-more'),
};

let request = null;
let page = 1;
let btnEvent = null;

function onSubmit(e) {
  e.preventDefault();
  clear();
  btrOffRender();

  request = e.target[0].value.trim();
  page = 1;

  if (!request) {
    errorRequest();
    return;
  }

  fetchImages(request, page)
    .then(data => {
      // btnEvent.disabled = true;
      galleryRender(data.hits);
      btrOnRender();
      // btnEvent.disabled = false;
      return data;
    })
    .then(data => {
      Notify.info(`Hooray! We found ${data.totalHits} images.`, {
        timeout: 5000,
      });
      return data;
    })
    .then(data => {
      if (data.hits.length < 40) {
        btnOffEvent();
        btrOffRender();
      }
      return data;
    })
    .catch(errorRequest);
}

function onLoadMore() {
  btnEvent.disabled = true;
  page += 1;
  fetchImages(request, page)
    .then(data => {
      galleryRender(data.hits);
      return data;
    })
    .then(data => {
      btnEvent.disabled = false;
      return data;
    })
    .then(data => {
      if (data.hits.length < 40) {
        btnOffEvent();
        btrOffRender();
      }
      return data;
    })
    .catch(errorRequest);
}

// function fechGallery(request, page) {
//   return fetchImages(request, page)
//     .then(data => {
//       // btnEvent.disabled = true;
//       galleryRender(data.hits);
//       // btnEvent.disabled = false;
//       return data;
//     })
//     .then(data => {
//       if (data.hits.length < 40) {
//         btrOffRender();
//       }
//       return data;
//     })
//     .catch(errorRequest);
// }

function galleryRender(arr) {
  const images = arr
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
          <img class="photo-card-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
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

function btrOnRender() {
  const btn = `<button type="button" class="load-more">Load more</button>`;
  refs.btn.insertAdjacentHTML('beforeend', btn);
  btnEvent = document.querySelector('.load-more');
  btnEvent.addEventListener('click', onLoadMore);
}

function btrOffRender() {
  refs.btn.innerHTML = '';
}

// function btnOnEvent() {
//   btnEvent.addEventListener('click', onLoadMore);
// }

function btnOffEvent() {
  btnEvent.removeEventListener('click', onLoadMore);
}

function clear() {
  refs.gallery.innerHTML = '';
}

function errorRequest() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.', {
    timeout: 5000,
  });
}

refs.form.addEventListener('submit', onSubmit);
