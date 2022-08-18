import axios from "axios";
const BASE_URL = "http://pixabay.com/api/";
const API_KEY = "29247796-24b66d41fb94834f451b18c5a";
export default class PhotosApiService{
    constructor() {
        this.currentPage = 1;
    }

    async getPhotos(query) {
    try {
        const response = await axios.get(`${BASE_URL}`, {
            params: {
                key: `${API_KEY}`,
                q: `${query}`,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                per_page: 40,
                page: this.currentPage
            }
        });
        const hits = await response.data.hits;
        const totalHits = await response.data.totalHits;
        return { hits, totalHits };
    } catch (error) {
        console.log(error);
            } finally {
              this.incrementPage();
          }
    }

    incrementPage() {
        this.currentPage += 1;
    }
    resetPage() {
        this.currentPage = 1;
    }
}
    

