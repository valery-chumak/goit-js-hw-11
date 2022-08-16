import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
  form: document.querySelector('#search-form'),
  query: document.querySelector('input[name="searchQuery"]'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-btn')
}
const BASE_URL = "http://pixabay.com/api";
const API_KEY = "29247796-24b66d41fb94834f451b18c5a";
let currentPage = 1;
let query = '';
let   lightbox = new SimpleLightbox('.gallery__link', {
        captionsData: 'alt',
        captionPosition: 'bottom',
        captionDelay: 250,
    });


refs.form.addEventListener('submit', onFormSubmit);
refs.loadBtn.addEventListener('click', onLoadBtnClick);


async function onFormSubmit(e) {
  e.preventDefault();
  clear();
  refs.loadBtn.setAttribute('hidden', true);
  query = refs.query.value.trim();
  if (query == "") {
    Notiflix.Notify.info(`Please fill in the search form`);
    return;
  }
  resetPage();
  const response = await getPhotos(query);
  const result = await insertGalleryContent(response);
  const { hits, totalHits } = response;
  if (totalHits != 0) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    refs.loadBtn.removeAttribute('hidden');
  }
}

async function onLoadBtnClick(e) {
  const response = await getPhotos(query);
  const result = await insertGalleryContent(response);
  const { hits, totalHits } = response;
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
  if (currentPage > Math.ceil(totalHits/ 40)) {
    refs.loadBtn.setAttribute('hidden', true);
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
}


async function getPhotos(query) {
    try {
    const response = await axios.get(`${BASE_URL}`,{
        params: {
            key: `${API_KEY}`,
            q: `${query}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 40,
            page: currentPage
    }
    });
      const hits = await response.data.hits;
      const totalHits = await response.data.totalHits;
      return { hits, totalHits };
  } catch (error) {
    console.log(error);
    } finally {
      incrementPage();
  }
}
function createGalleryItem(item) {
  return `
  <div class="photo-card">
    <a href="${item.largeImageURL}" class="gallery__link link">
    <img class="gallery__image" src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
    </a>
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          <span>${item.likes}</span>
        </p>
        <p class="info-item">
          <b>Views</b>
          <span>${item.views}</span>
        </p>
        <p class="info-item">
          <b>Comments</b>
          <span>${item.comments}</span>
        </p>
        <p class="info-item">
          <b>Downloads</b>
          <span>${item.downloads}</span>
        </p>
      </div>
  </div>`
}
const createGallery = (array) => array.reduce((acc, item) => acc + createGalleryItem(item), '');
const insertGalleryContent = async (object) => {
  const { hits, totalHits } = object;
    if (hits.length === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
  const result = createGallery(hits);
  refs.gallery.insertAdjacentHTML('beforeend', result);
  lightbox.refresh();
}
function clear() {
  refs.gallery.innerHTML = '';
}
function incrementPage() {
  currentPage =currentPage +  1;
}
function resetPage() {
  currentPage = 1;
}
console.log(lightbox);