import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export default async function fetchImages(request, page) {
  const options = {
    params: {
      key: '25376419-21146ccb6c229e91e9e9974ae',
      q: `${request}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: `${page}`,
      per_page: 40,
    },
  };

  try {
    const response = await axios(`/`, options);
    return response.data;
  } catch (error) {
    return {
      hits: [],
      total: 0,
      totalHits: 0,
    };
  }
}
