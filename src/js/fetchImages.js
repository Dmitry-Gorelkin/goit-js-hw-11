const BASE_URL = 'https://pixabay.com/api/';
const KEY = '25376419-21146ccb6c229e91e9e9974ae';
const PER_PAGE = 40;

export default function fetchImages(request, page) {
  return fetch(
    `${BASE_URL}?key=${KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`,
  )
    .then(r => r.json())
    .then(data => {
      if (!data.hits.length) {
        throw new Error(response.status);
      }
      return data;
    });
}
