/* import axios from 'axios';
import { showAlert } from './alerts';
import { searchView } from './searchView';

export const state = {
  search: {
    query: '',
    results: [],
  },
};



export const loadSearchResults = async (query) => {
  try {
    state.search.query = query;
    // console.log(query);

    const res = await axios({
      method: 'GET',
      url: `http://localhost:4000/api/v1/men/?categoryType=${query}`,
        // data
      //   data: {
      //     email,
      //     password,
      //   },
    });
    state.search.results = res.data;

    // console.log(res.data);
    // if (res.data.status === 'success') {
    //   // showAlert('success', 'Logged in successfully!');
    //   showMyAlert('success', 'Logged in successfully!');
    //   window.setTimeout(() => {
    //     location.assign('/');
    //   }, 1500);
    // }
  } catch (err) {
    console.error(err);
    // showAlert('error', err.response.data.message);
  }
};

export const controlSearchResults = async function () {

  try {
    let query = document.querySelector('.search-overlay-content__field').value;

    if (!query) return;
    console.log(query);
    document.querySelector('.search-overlay-content__field').value = '';//  BUG this works but implentation it's not ok

    await loadSearchResults(query);
    // await loadSearchResults('LEATHER JACKET');

    // Render results
    console.log(state.search.results);

      if ((state.search.results = 'success')) {
        // location.reload();
         location.assign(`/search/`);
      }
  } catch (err) {
    console.error(err);
  }
};

const addHandlerSearch = function (handler) {
  const search = document.querySelector('.search ');
  search.addEventListener('submit', function (e) {
    e.preventDefault();
    handler();
  });
};

const init = function () {
  addHandlerSearch(controlSearchResults);
};
init(); */

/* 
class SearchView {
  constructor(search) {
    this.search = search;
  }
  getQuery() {
    return this.querySelector('.search-overlay-content__field').value;
  }
  addHandlerSearch(handler) {
    this.search.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView(); */

/* 
export const loadSearchResults = async (query) => {
  try {
    state.search.query = query;
    console.log(query);

    const res = await axios({
      method: 'GET',
      url: `http://localhost:4000/api/v1/men/?categoryType=${query}`,
      //   data: men,
      //   data: {
      //     email,
      //     password,
      //   },
    });
    state.search.results = res.data;
    
    console.log(res.data);
    // if (res.data.status === 'success') {
    //   // showAlert('success', 'Logged in successfully!');
    //   showMyAlert('success', 'Logged in successfully!');
    //   window.setTimeout(() => {
    //     location.assign('/');
    //   }, 1500);
    // }
  } catch (err) {
    console.error(err);
    // showAlert('error', err.response.data.message);
  }
};

// loadSearchResults('LEATHER JACKET');

//  export default new SearchView();

export const controlSearchResults = async function () {
  try {
    const query = getQuery;
    console.log(query);
 
    if (!query) return;

    await loadSearchResults(query);
    // await loadSearchResults('LEATHER JACKET');
    console.log(state.search.results);
  } catch (err) {
    console.error(err);
  }
}; */
// controlSearchResults()
