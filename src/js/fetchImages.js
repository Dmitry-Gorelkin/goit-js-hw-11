import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '25376419-21146ccb6c229e91e9e9974ae';
const PER_PAGE = 40;

export default async function fetchImages(request, page) {
  try {
    const response = await axios(
      `${BASE_URL}?key=${KEY}&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`,
    );
    return response.data;
  } catch (error) {
    return {
      hits: [],
      total: 0,
      totalHits: 0,
    };
  }
}
