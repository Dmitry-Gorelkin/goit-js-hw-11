import './css/styles.css';
import fetchImages from './js/fetchImages';
import fnScroll from './js/fnScroll';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btn: document.querySelector('.load-more'),
};

const PER_PAGE = 40;
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

  fetchGallery(request, page, PER_PAGE)
    .then(data => {
      Notify.info(`Hooray! We found ${data.totalHits} images.`, {
        timeout: 5000,
      });
    })
    .catch(errorRequest);
}

function onLoadMore() {
  refs.btn.disabled = true;
  refs.btn.textContent = 'Loading...';
  page += 1;

  fetchGallery(request, page, PER_PAGE).then(fnScroll).catch(errorRequest);
}

function fetchGallery(request, page, per_page) {
  return fetchImages(request, page, per_page)
    .then(data => {
      if (!data.hits.length) {
        throw new Error(response.status);
      }
      return data;
    })
    .then(data => {
      galleryRender(data.hits);
      gallery.refresh();
      refs.btn.disabled = false;
      refs.btn.textContent = 'Load more';
      return data;
    })
    .then(data => {
      const maxPage = Math.ceil(data.totalHits / PER_PAGE);

      if (data.hits.length < 40 || page === maxPage) {
        refs.btn.classList.add('visually-hidden');
        endRequest();
        return data;
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
          />
          <div class="photo-card-info">
            <p class="info-item"><b>Likes</b> ${likes}</p>
            <p class="info-item"><b>Views</b> ${views}</p>
            <p class="info-item"><b>Comments</b> ${comments}</p>
            <p class="info-item"><b>Downloads</b> <span>${downloads}</span></p>
          </div></a>
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

refs.form.addEventListener('submit', onSubmit);
refs.btn.addEventListener('click', onLoadMore);
