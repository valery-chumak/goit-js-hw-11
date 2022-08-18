export function createGalleryItem(item) {
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
