import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { createGalleryItem } from "./js/createGalleryItem";
import { refs } from "./js/refs";
import { lightbox } from "./js/lightBox";
import PhotosApiService from "./js/getPhotos";

let query = '';
const photosApiService = new PhotosApiService;

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
  photosApiService.resetPage();
  const response = await photosApiService.getPhotos(query);
  const result = await insertGalleryContent(response);
  const { hits, totalHits } = response;
  if (totalHits != 0) {
    if (totalHits <= 40) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      refs.loadBtn.setAttribute('hidden',true);
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    refs.loadBtn.removeAttribute('hidden');
  }
}

async function onLoadBtnClick(e) {
  const response = await photosApiService.getPhotos(query);
  const result = await insertGalleryContent(response);
  const { hits, totalHits } = response;
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
  if (photosApiService.currentPage > Math.ceil(totalHits/ 40)) {
    refs.loadBtn.setAttribute('hidden', true);
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      }
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