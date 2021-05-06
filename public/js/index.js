import axios from 'axios';
import '@babel/polyfill';
import {
  login,
  signup,
  logout,
  showMyAlert,
  showMyAlertFail,
  showMyAlert1,
  logoutBtn,
} from './login';
import { displayMap } from './mapbox';

import { updateSettings } from './updateSettings';
import {
  loadSearchResults,
  state,
  controlSearchResults,
  handlerSearch,
} from './loadSearchResults';

import { searchView } from './searchView';
import { bookmark } from './bookmark';
// import { signUp } from './signup';
import { buyProduct } from './stripe';

const cookieStorage = {
  getItem: (item) => {
    const cookies = document.cookie
      .split(';')
      .map((cookie) => cookie.split('='))
      .reduce((acc, [key, value]) => ({ ...acc, [key.trim()]: value }), {});
    return cookies[item];
  },
  setItem: (item, value) => {
    document.cookie = `${item}=${value}`;
  },
};

const storageType = cookieStorage;
// const storageType = localStorage;
const consentPropertyName = 'pop_consent';

const shouldShowPopup = () => !storageType.getItem(consentPropertyName);
const saveToStorage = () => storageType.setItem(consentPropertyName, true);

// window.onload = () => {
//   const consentPopup = document.getElementById('consent-popup');
//   const acceptBtn = document.getElementById('accept');

//   const accceptFn = (event) => {
//     saveToStorage(storageType);
//     consentPopup.classList.add('hidden');
//   };

//   acceptBtn.addEventListener('click', accceptFn);
//   if (shouldShowPopup()) {
//     setTimeout(() => {
//       consentPopup.classList.remove('hidden');
//     }, 2000);

//     // const consent = confirm('Agree to the terms and conditions of the sites?');
//     // if (consent) {
//     //   saveToStorage();
//     // }
//   }
// };

window.onload = () => {
  const popupAuto = document.querySelector('.popup-auto');
  const popupAutoClose = document.querySelector('.close-popup-auto');
  const consentPopup = document.getElementById('consent-popup');
  const acceptBtn = document.getElementById('accept');

  const accceptFn = (event) => {
    saveToStorage(storageType);
    consentPopup.classList.add('hidden');
  };

  acceptBtn.addEventListener('click', accceptFn);
  if (shouldShowPopup()) {
    setTimeout(() => {
      consentPopup.classList.remove('hidden');
    }, 2000);
  }
  const accceptPopup2 = (event) => {
    saveToStorage(storageType);

    popupAuto.classList.add('hidden');
  };

  popupAutoClose.addEventListener('click', accceptPopup2);
  if (shouldShowPopup()) {
    setTimeout(() => {
      popupAuto.classList.remove('hidden');
    }, 10000);
  }
};

const mapBox = document.getElementById('map');
/*  Cart Shopping */
const bagIconCart = document.querySelector('.bag__icon__cart');
const shopping = document.querySelector('.shopping');
const bagCartClose = document.querySelector('.bag__close__icon');

const btnCartRemoveOne = document.querySelector('.btn-cart-remove');
const btnBagCartQty = document.querySelector('.descrip-title');
const cartItemsBag = document.querySelector('.shopping-container-middle-item');

const cartItemDesc = document.getElementById('cartItemDesc');
const cartItemPrice = document.getElementById('cartItemPrice');
const cartItemSize = document.getElementById('cartItemSize');
const cartItemQuantity = document.getElementById('cartItemQuantity');
const ProductDom = document.querySelector(
  '.showcase-container-gallery-grid-item-img'
);

// This is where I will be getting Info and place Info

/* const bookmarkHeart = document.querySelector('.icon-page-increase');
const svgHeart = document.querySelector('.icon-close__menu');
bookmarkHeart.addEventListener('click', function (e) {
  //  e.target.classList.replace('icon-close', 'heart');
  // playBtn.classList.replace('fa-pause', 'fa-play');
  console.log('hey');
}); */

// document
//   .querySelector('.text-main-hidden')
//   .addEventListener('click', loadSearchResults('Knitwear'));

//NOTE LOGIN  USER
const form1 = document.querySelector('#form1');
if (!form1) return;
form1.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

//NOTE CREATE NEW USER
const formCreate = document.querySelector('#formCreate');
if (formCreate)
  formCreate.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('create_email').value;
    const password = document.getElementById('create_password').value;
    const passwordConfirm = document.getElementById('create_password_confirm')
      .value;
    signup(name, email, password, passwordConfirm);
  });

const userDataform = document.getElementById('form-user-data');

if (userDataform)
  userDataform.addEventListener('submit', (e) => {
    e.preventDefault();
    // const form = new FormData();
    const name = document.getElementById('name').value;
    const email = document.getElementById('emailToBe').value;
    const country = document.getElementById('countryToBe').value;
    const home_tel = document.getElementById('home_telToBe').value;
    const mobile_tel = document.getElementById('mobile_telToBe').value;

    // form.append('name', document.getElementById('name').value);
    // form.append('email', document.getElementById('email').value);
    // form.append('country', document.getElementById('country').value);
    // form.append('home_tel', document.getElementById('home_tel').value);
    // form.append('mobile_tel', document.getElementById('mobile_tel').value);
    updateSettings(name, email, country, home_tel, mobile_tel);
    // updateSettings({ form }, 'data');
    // console.log(form);
  });

//NOTE this is update Password which is not working now
/* if (userDataform)
  userDataform.addEventListener('submit', (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById('passwordCurrent').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    updateSettings({ passwordCurrent, password, passwordConfirm }, 'data');
  }); */
/* eslint-disable */

//NOTE All working close not working
/*******************************************/

const btnAddWhishlist = document.querySelector('.btn-add-all-to-bag');
const gridWhishlist = document.querySelector('.whishlist-container-title-grid');
const logo = document.querySelector('.header__logo');

const popupKlarna = document.querySelector('.popupKlarna');
const popup = document.querySelector('.checkout-page-2-popup');

const bagMobile = document.querySelector('.icon_bag__icon__small');
const heartMobile = document.querySelector('.icon__heart__whishlist');
// const whishlist = document.querySelector('.whishlist');//BUG
// const whishlistMenu = document.querySelector('.whishlist__form');//BUG
const signinAccount = document.querySelector('.signin-account');
const signin = document.querySelector('.sign__In ');
const signinClose = document.querySelector('.icon-close-signin');
const language = document.querySelector('.language');
// const currency = document.querySelector('.currency');
// const iconCurrencyClose = document.querySelector('.iconCurrency');
const overlayer2 = document.querySelector('.overlayer-2 ');

// popupKlarna.addEventListener('click', function () {
//   popup.style.visibility = 'visible';
//   popup.style.opacity = '1';
// });

// const iconBarMenu = document.querySelector('.menu-bar-icon');
const menuBarIcon = document.querySelector('.menu-bar-icon');
const selectTarget = document.querySelector('.select-target');
const navBarIconMenuOpen = document.querySelector('.nav__bar__icon');
navBarIconMenuOpen.addEventListener(
  'click',
  function (e) {
    menuBarIcon.classList.add('menu-bar-icon-active');
    e.stopImmediatePropagation();
  },
  true
);

const navBarIconClose = document.querySelector('#icon-close__menu');
navBarIconClose.addEventListener('click', function () {
  menuBarIcon.classList.remove('menu-bar-icon-active');
});

// const navBarMenu = document.querySelector('.nav__bar__icon');
// const navBarMenuClose = navBarMenu.closest('.nav__item');
//

/* navBarMenuClose.addEventListener('click', function () {
  menuBarIcon.classList.remove('active');
  menuBarIcon.style.transform = 'scale(1,1)';
});

navBarIconClose.addEventListener('click', function () {
  menuBarIcon.classList.add('active');
  menuBarIcon.style.transform = 'scale(0,1)';
}); */

const bagOpen = bagIconCart.closest('button');
bagOpen.addEventListener('click', function () {
  shopping.classList.remove('active');
});

//NOTE IMPORTANT
const bagOpenMobile = bagMobile.closest('button');

bagOpenMobile.addEventListener('click', function () {
  shopping.classList.remove('active');
});

bagCartClose.addEventListener('click', function () {
  shopping.classList.add('active');
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    shopping.classList.add('active');
  }
});

/* whishlistMenu.addEventListener('click', function () {
  whishlist.classList.remove('active');

});
const closeWhisHeart = whishlistMenu.closest('button');
closeWhisHeart.addEventListener('click', function () {
  whishlist.classList.add('activation');
}); */
if (signin)
  signin.addEventListener('click', function () {
    signinAccount.classList.add('signin-account-active');
    overlayer2.style.opacity = 1;
    overlayer2.style.visibility = 'visible';
    overlayer2.style.display = 'inline';
  });

const signInCloseModal = function () {
  signinClose.addEventListener('click', function () {
    signinAccount.classList.remove('signin-account-active');
    overlayer2.style.opacity = 0;
    overlayer2.style.visibility = 'invisible';
    overlayer2.style.display = 'none';
  });
};
signInCloseModal();

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    signinAccount.classList.remove('signin-account-active');
    overlayer2.style.opacity = 0;
    overlayer2.style.visibility = 'invisible';
    overlayer2.style.display = 'none';
  }
});

// NOTE Language
/* currency.addEventListener('click', function () {
  language.classList.remove('active');
});

iconCurrencyClose.addEventListener('click', function () {
  language.classList.add('active');
});

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    language.classList.add('active');
  }
}); */

// FOOTER NAV DROPDOWN
const footerUp1 = document.querySelector('.footer-first');
const footerUp2 = document.querySelector('.footer-second');
const footerUp3 = document.querySelector('.footer-third');
// const footerUp4 = document.querySelector('.footer-fouth');
// const footerUp5 = document.querySelector('.footer-five');
// const footerUp6 = document.querySelector('.footer-six');
const footerUp_1 = document.querySelector('#footerUp_1');
const footerUp_2 = document.querySelector('#footerUp_2');
const footerUp_11 = document.querySelector('#footerUp_11');
const footerUp_4 = document.querySelector('#footerUp_4');
const footerUp_5 = document.querySelector('#footerUp_5');
const footerUp_6 = document.querySelector('#footerUp_6');
const footerUp_44 = document.querySelector('#footerUp_44');
footerUp1.addEventListener('click', function (e) {
  e.target.classList.toggle('icon-footer-rotation');
  footerUp_1.classList.toggle('active-link');
  footerUp_11.classList.toggle('active-link');
});

footerUp2.addEventListener('click', function (e) {
  e.target.classList.toggle('icon-footer-rotation');
  footerUp_2.classList.toggle('active-link');
});

footerUp3.addEventListener('click', function (e) {
  e.target.classList.toggle('icon-footer-rotation');
  footerUp_3.classList.toggle('active-link');
});

// footerUp4.addEventListener('click', function (e) {
//   e.target.classList.toggle('icon-footer-rotation');
//   footerUp_4.classList.toggle('active-link');
//   footerUp_44.classList.toggle('active-link');
// });

// footerUp5.addEventListener('click', function (e) {
//   e.target.classList.toggle('icon-footer-rotation');
//   footerUp_5.classList.toggle('active-link');
// });
// footerUp6.addEventListener('click', function (e) {
//   e.target.classList.toggle('icon-footer-rotation');
//   footerUp_6.classList.toggle('active-link');
// });

// FOOTER NAV DROPDOWN END ///

const selected = document.querySelector('.selected');
const optionsContainer = document.querySelector('.options-container');
const optionsList = document.querySelectorAll('.option');
const sameSize = document.querySelector('.same-size');
const sizeGuide = document.querySelector('.size-guide');
const btnNotClear = document.querySelector('.btn-not-clear');
const btnReset = document.querySelector('.reset-size-details');
const whishlistImgSingle = document.querySelector('.whishlist-img');
const whishlistImgClose = document.querySelector('.whishlist-img-stock-close');
// const closeWishListSelect = document.querySelector('#icon-close');

//LECTURE
/* whishlistImgClose.addEventListener('click', function () {
  console.log('hey');
  whishlistImgSingle.style.display = 'none';
  // whishlistImgSingle.style.opacity = 0;
  // whishlistImgSingle.style.visibility = 'hidden';
}); */

//LECTURE
/* selected.addEventListener('click', function () {
  console.log('heu');
  optionsContainer.classList.toggle('active');
  sizeGuide.innerHTML = '';
  btnNotClear.style.display = 'none';
});

optionsList.forEach((el) => {
  el.addEventListener('click', () => {
    selected.innerHTML = el.querySelector('label').innerHTML;
    optionsContainer.classList.remove('active');
    sameSize.innerHTML = '';
    sameSize.innerHTML = selected.innerHTML;
    btnNotClear.style.display = 'inline';
    btnNotClear.style.cursor = 'pointer';
    btnNotClear.style.backgroundColor = 'black';
  });
}); */

// btnReset.addEventListener('click', function () {
//   selected.innerHTML = '-';
//   sameSize.innerHTML = '';
//   btnReset.innerHTML = 'EDIT DETAILS';
//   btnNotClear.style.display = 'inline';
//   btnNotClear.style.cursor = 'not-allowed';
//   btnNotClear.style.backgroundColor = '#ddd';

// });

const saleTab1 = document.querySelector('.sale__tab_1');
const saleTab2 = document.querySelector('.sale__tab_2');
const saleTab3 = document.querySelector('.sale__tab_3');
const saleTabBox = document.querySelector('.sale__tab_1_box');
const saleTabBox2 = document.querySelector('.sale__tab_2_box');
const saleTabBox3 = document.querySelector('.sale__tab_3_box');

if (saleTab1) {
  saleTab1.addEventListener('mouseover', function () {
    saleTabBox.style.transition = 'all 0.1s;';
    saleTabBox.classList.remove('hidden');
  });
  saleTab1.addEventListener('mouseleave', function () {
    saleTabBox.classList.add('hidden');
  });
}

if (saleTab2) {
  saleTab2.addEventListener('mouseenter', function () {
    saleTabBox2.style.transition = 'all 0.1s;';
    saleTabBox2.classList.remove('hidden');
  });

  saleTab2.addEventListener('mouseleave', function () {
    saleTabBox2.classList.add('hidden');
  });
}
// saleTab3.addEventListener('mouseenter', function () {
//   saleTabBox3.style.transition = 'all 0.1s;';
//   console.log('enter3');
//   // saleTabBox3.classList.remove('hidden');
// });

// saleTab3.addEventListener('mouseleave', function () {
//   saleTabBox3.classList.add('hidden');
//     console.log('leave3');
// });

// MENU  MOUSE HOVER ( women and men)
const tabsContent = document.querySelectorAll('.hero__tab__hidden');
const navContainer = document.querySelector('.nav__container');
const dropSelect = document.querySelectorAll('.drop-select');

// LECTURE
/* navContainer.addEventListener('mouseover', function (e) {
  //const clickedIt = e.target.parentElement;
  const clickedIt = e.target.closest('.nav__btn');
  // console.log(clickedIt);
  // Guard Close -> if there is nothing clicked returns immediatly
  if (!clickedIt) return;

  // Remove Active
  tabsContent.forEach((t) => t.classList.remove('hidden'));

  document
    .querySelector(`.hero-sale__content--${clickedIt.dataset.tab} `)
    .classList.add('hidden');
});
navContainer.addEventListener('mouseleave', function () {
  // Remove Active
  tabsContent.forEach((t) => t.classList.add('hidden'));

  document
    .querySelector(`.hero-sale__content--${clickedIt.dataset.tab} `)
    .classList.remove('hidden');
}); */

/* dropSelect.forEach(el =>
  el.addEventListener('mouseover', function (e) {
    //const clickedIt = e.target.parentElement;
    const clickedIt = e.target.closest('.nav__btn');
    console.log(clickedIt);
    // Guard Close -> if there is nothing clicked returns immediatly
    if (!clickedIt) return;

    // Remove Active
    tabsContent.forEach(t => t.classList.remove('hidden'));

    document
      .querySelector(`.hero-sale__content--${clickedIt.dataset.tab} `)
      .classList.add('hidden');
  })
);

dropSelect.forEach(el =>
  el.addEventListener('mouseleave', function (e) {
    //const clickedIt = e.target.parentElement;
    const clickedIt = e.target.closest('.nav__btn');
    console.log(clickedIt);
    // Guard Close -> if there is nothing clicked returns immediatly
    if (!clickedIt) return;

    // Remove Active
    tabsContent.forEach(t => t.classList.add('hidden'));
    tabsContent.forEach(t => (t.classList.style.display = 'none'));
  })
); */

// SEARCH
const searchIcon = document.querySelector('.icon-test_space ');
const search = document.querySelector('.search ');

const searchClose = document.querySelector('.closeX ');


const searchMenu = document.getElementById('newSearch');
const openNewSeacrh = searchMenu.closest('nav__item');

if (searchMenu){
  searchMenu.addEventListener('click', function () {
    (search.style.opacity = 1), (search.style.visibility = 'visible');
  });
}
if (searchIcon)
  searchIcon.addEventListener('click', function () {
    (search.style.opacity = 1), (search.style.visibility = 'visible');
  });
  if (searchClose){
    searchClose.addEventListener('click', function () {
      (search.style.opacity = 0), (search.style.visibility = 'invisible');
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        (search.style.opacity = 0), (search.style.visibility = 'invisible');
      }
    });
  }
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider-spring__btn__btn--left');
  const btnRight = document.querySelector('.slider-spring__btn__btn--right');

  let curSlide = 0;
  const maxSlide = slides.length;

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    // activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    // activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    // createDots();

    // activateDot(0);
  };
  init();

  // Event handlers
  if (btnRight) btnRight.addEventListener('click', nextSlide);
  if (btnLeft) btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });
};
slider();

const swicthSingle = document.querySelector('.switch-single-page');
const swicthDouble = document.querySelector('.switch-double-page');
const colorDisplay = document.querySelector('.colorDisplay');
const showcaseItem = document.querySelector('.showcase-container-gallery-grid');

const gridImage = document.querySelectorAll(
  '.showcase-container-gallery-grid-item'
);
let sizeSlider = document.querySelector('.size-slider');
const galleryGrid = document.querySelectorAll(
  '.showcase-container-gallery-grid'
);

galleryGrid.forEach((el) => {
  swicthDouble.addEventListener('click', function () {
    el.classList.add('change-to-double-view');
  });
  //showcaseItem.style.gridTemplateRows = 'minmax(25rem, auto)'

  // grid-auto-rows: minmax(50rem, auto)
});

galleryGrid.forEach((el) => {
  swicthSingle.addEventListener('click', function () {
    el.classList.remove('change-to-double-view');
  });
});

// Player
const player = document.querySelector('.player');
const video = document.querySelector('video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.querySelector('#play-btn');
const volumeIcon = document.querySelector('#volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const fullscreenBtn = document.querySelector('.fullscreen');
const btnInpicture = document.querySelector('.fa-ellipsis-v');

if (player) {
  let lastVolume = 1;

  function changeVolume(e) {
    let volume = e.offsetX / volumeRange.offsetWidth;

    if (volume < 0.1) {
      volume = 0;
    }
    if (volume > 0.9) {
      volume = 1;
    }
    volumeBar.style.width = ` ${volume * 100}%`;
    video.volume = volume;

    volumeIcon.className = ''; // no icon
    if (volume > 0.7) {
      volumeIcon.classList.add('fas', 'fa-volume-up');
    } else if (volume < 0.7 && volume > 0) {
      volumeIcon.classList.add('fas', 'fa-volume-down');
    } else if (volume === 0) {
      volumeIcon.classList.add('fas', 'fa-volume-off');
    }
    lastVolume = volume;
  }

  function toggleMute() {
    volumeIcon.className = '';
    if (video.volume) {
      lastVolume = video.volume;
      video.volume = 0;
      volumeBar.style.width = 0;
      volumeIcon.classList.add('fas', 'fa-volume-mute');
      volumeIcon.setAttribute('title', 'Unmute');
    } else {
      video.volume = lastVolume;
      volumeBar.style.width = `${lastVolume * 100}%`;
      volumeIcon.classList.add('fas', 'fa-volume-up');
      volumeIcon.setAttribute('title', 'Mute');
    }
  }

  function calcDisplayTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds > 9 ? seconds : `0${seconds}`;

    return ` ${minutes}:${seconds}`;
  }

  function updateProgress() {
    //console.log('currentTime', video.currentTime, 'duartion', video.duration);
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
    currentTime.textContent = `${calcDisplayTime(video.currentTime)} / `;
    duration.textContent = `${calcDisplayTime(video.duration)}  `;
  }
  function showPlayIcon() {
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
  }

  function togglePlay() {
    if (video.paused) {
      video.play();
      playBtn.classList.replace('fa-play', 'fa-pause');
      playBtn.setAttribute('title', 'Pause');
    } else {
      video.pause();
      showPlayIcon();
    }
  }

  // View in fullscreen
  function openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      // Safari
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      // IE11
      elem.msRequestFullscreen();
    }
    video.classList.add('video-fullscreen');
  }

  // Close fullscreen
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      // Safari
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      // IE11
      document.msExitFullscreen();
    }
    video.classList.remove('video-fullscreen');
  }

  let fullscreen = false;

  function toggleFullscreen() {
    if (!fullscreen) {
      openFullscreen(player);
    } else {
      closeFullscreen();
    }
    fullscreen = !fullscreen;
  }

  playBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);
  video.addEventListener('ended', showPlayIcon);

  video.addEventListener('timeupdate', updateProgress);
  video.addEventListener('canplay', updateProgress);
  volumeRange.addEventListener('click', changeVolume);
  volumeIcon.addEventListener('click', toggleMute);
  fullscreenBtn.addEventListener('click', toggleFullscreen);
}

/* if (btnInpicture) {
  async function selectMediaStream() {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia();
      video.srcObject = mediaStream;
      video.onloadedmetadata = () => {
        video.play();
      };
    } catch (error) {
      console.log('Oops!', error);
    }
  }
  btnInpicture.addEventListener('click', async () => {
    btnInpicture.disabled = true;
    await video.requestPictureInPicture();
    btnInpicture.disabled = false;
  });

  selectMediaStream();
} */
/* whishlistImgClose.forEach(el =>
  el.addEventListener('click', function () {
    console.log('removed');

    whishlistImgSingle.forEach( el => el.style.opacity = 0 )
    whishlistImgSingle.forEach( el => el.style.visibility = 'hidden' )
    // whishlistImgSingle.style.opacity = 0;
    // whishlistImgSingle.style.visibility = 'hidden';
  })
);
whishlistImgSingle.addEventListener('click', function(){

})

whishlistImgSingle */
let types = [];

// myFunction(x)

//BUG SCROLLING with scrol event (Bad Performance)
/* const scroolSectionFilter = document.querySelector('.showcase-container-filter');
 const initialCoords = scroolSectionFilter.getBoundingClientRect()
 console.log(initialCoords);
window.addEventListener('scroll', function () {
  console.log(window.scrollY);
  if(window.scrollY > initialCoords.top) scroolSectionFilter.classList.add('sticky')
   else
  scroolSectionFilter.classList.remove('sticky') 
}); */

/********************* Intersection Observer **********************/
// IMPORTANT desactive for now  IMPORTANT

const headerTopObserver = document.querySelector(
  '.showcase-container-title-category'
);
const scroolSectionFilter = document.querySelector(
  '.showcase-container-filter'
);
if (headerTopObserver) {
  const navHeight = scroolSectionFilter.getBoundingClientRect().height;
  // console.log(navHeight);
  const stickyNav = function (entries) {
    const [entry] = entries;
    // console.log(entry);
    if (!entry.isIntersecting) scroolSectionFilter.classList.add('sticky');
    else scroolSectionFilter.classList.remove('sticky');
  };

  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });

  headerObserver.observe(headerTopObserver);
}
/********************* Intersection Observer  END **********************/

const sliderer = function () {
  const allSlides = document.querySelectorAll('.slidex');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  let curSlide = 0;
  const maxSlide = allSlides.length;

  // Functions
  const goToSlide = function (slide) {
    allSlides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 5) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 5;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
  };

  const init = function () {
    goToSlide(0);
  };
  init();

  // Event handlers
  if (btnRight) btnRight.addEventListener('click', nextSlide);
  if (btnLeft) btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });
};
sliderer();

const addNewAddress = document.querySelector('#addNewAddress');
const openFormAddress = document.querySelector('.form-address-wrapper');
const closeFormAddress = document.querySelector('.close-x ');
if (addNewAddress) {
  addNewAddress.addEventListener('click', function () {
    openFormAddress.classList.remove('hidden');
    openFormAddress.style.transform = 'scaleX(1, 1)';
  });
  closeFormAddress.addEventListener('click', function () {
    openFormAddress.classList.add('hidden');
  });
}
// search.addEventListener('submit', function (e) {
//   e.preventDefault();
//   handlerSearch(controlSearchResults);
// });

/* 
const getQuery = document.querySelector('.search-overlay-content__field').value;
handlerSearch = () => {
  search.addEventListener('submit', function (e) {
    e.preventDefault();
    // controlSearchResults()
  });
};

handlerSearch(controlSearchResults); */

// const getQuery = document.querySelector('.search-overlay-content__field').value;

/*  OPEN product details */

const slideBoxNotes = document.querySelector('.slide-box');
const slideBoxNotes1 = document.querySelector('.slide-box1');
const iconNotes = document.querySelector(
  '.showcase-loads-container-gallery-right-notes-box-icon'
);
if (iconNotes) {
  iconNotes.addEventListener('click', function () {
    slideBoxNotes.classList.toggle('showMe');
  });
}

const detailsNotes = document.querySelector('#details');
if (detailsNotes) {
  detailsNotes.addEventListener('click', function () {
    slideBoxNotes1.classList.toggle('showMe');
  });
}

const checkoutBtn = document.querySelector('#book-men');
if (checkoutBtn)
  checkoutBtn.addEventListener('click', function (e) {
    e.target.textContent = 'Proccessing...';
    //const menId = e.target.dataset.menId; using distrating

    const { menId } = e.target.dataset;
    buyProduct(menId);
    //   const menId = document.querySelectorAll('#cartIds[data-men-id]');
    //    buyProduct(menId);
  });

const viewOrder = document.querySelector('.view-order');
const wrapRepalce = document.querySelector('.wrap-replace');
const wrapOrders = document.querySelector('.wrap-orders');
const wrapId = document.querySelector('.wrap-ai');
const orderId = document.querySelector('.order-id');
const orderDate = document.querySelector('.order-date');
const orderCost = document.querySelector('.order-cost');
const orderTracking = document.querySelector('.fine-secondary');
const orderProd = document.querySelector('.prod-description');
if (viewOrder) {
  viewOrder.addEventListener('click', function () {
    wrapRepalce.classList.toggle('view-order-details');
    wrapOrders.style.display = 'none';
    orderId.style.display = 'none';
    orderDate.style.display = 'none';
    orderCost.style.display = 'none';
    orderTracking.in = 'MANAGE ORDER ';
    orderProd.style.display = 'flex';
  });
}

let cartCouter = document.querySelector('.cart-counter');
function updateCart(prod) {
  axios
    .post('/update-cart', prod)
    .then((res) => {
      // console.log(res);
      cartCouter.innerText = res.data.totalQty;
    })
    .catch((err) => {
      console.log(err);
    });
}

let addToCart = document.querySelectorAll('#btnAddToBag');
let addToCart1 = document.querySelectorAll('#btnAddToBag1');
let addToCart2 = document.querySelectorAll('#btnAddToBag2');
if (addToCart)
  addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      let prod = JSON.parse(btn.dataset.collection);
      //  console.log(prod);
      updateCart(prod);
      shopping.classList.remove('active');
    });
  });
if (addToCart1)
  addToCart1.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      let prod = JSON.parse(btn.dataset.girls);
      //  console.log(prod);
      updateCart(prod);
      shopping.classList.remove('active');
    });
  });
if (addToCart2)
  addToCart2.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      let prod = JSON.parse(btn.dataset.men);
      //  console.log(prod);
      updateCart(prod);
      shopping.classList.remove('active');
    });
  });
if (mapBox) {
  const locations = [
    {
      description: 'Rubaccine Store Mayfair ',
      type: 'point',
      coordinates: [-0.1514336, 51.5092271],
    },
    {
      description: 'Rubaccine Store Chelsea  ',
      type: 'point',
      coordinates: [-0.1762855, 51.4989362],
    },
    {
      description: 'Rubaccine Store Kennington',
      type: 'point',
      coordinates: [-0.1948426, 51.4958347],
    },
  ];
  displayMap(locations);
}
const readMore1 = document.getElementById('readMore1');
const readMore2 = document.getElementById('readMore2');
const readMore3 = document.getElementById('readMore3');
const readMore4 = document.getElementById('readMore4');
const readMore5 = document.getElementById('readMore5');
const readMore6 = document.getElementById('readMore6');
const readMore7 = document.getElementById('readMore7');
const readMore8 = document.getElementById('readMore8');
const showMore1 = document.getElementById('showMore1');
const showMore2 = document.getElementById('showMore2');
const showMore3 = document.getElementById('showMore3');
const showMore4 = document.getElementById('showMore4');
const showMore5 = document.getElementById('showMore5');
const showMore6 = document.getElementById('showMore6');
const showMore7 = document.getElementById('showMore7');
const showMore8 = document.getElementById('showMore8');

if (readMore1)
  readMore1.addEventListener('click', function (e) {
    showMore1.classList.remove('vph');
    e.target.textContent = '';
  });
if (readMore2)
  readMore2.addEventListener('click', function (e) {
    showMore2.classList.remove('vph');
    e.target.textContent = '';
  });
if (readMore3)
  readMore3.addEventListener('click', function (e) {
    showMore3.classList.remove('vph');
    e.target.textContent = '';
  });
if (readMore4)
  readMore4.addEventListener('click', function (e) {
    showMore4.classList.remove('vph');
    e.target.textContent = '';
  });
if (readMore5)
  readMore5.addEventListener('click', function (e) {
    showMore5.classList.remove('vph');
    e.target.textContent = '';
  });
if (readMore6)
  readMore6.addEventListener('click', function (e) {
    showMore6.classList.remove('vph');
    e.target.textContent = '';
  });
if (readMore7)
  readMore7.addEventListener('click', function (e) {
    showMore7.classList.remove('vph');
    e.target.textContent = '';
  });
if (readMore8)
  readMore8.addEventListener('click', function (e) {
    showMore8.classList.remove('vph');
    e.target.textContent = '';
  });

const alsoLike = document.querySelector('.showIconMinus');
const showAlsoLike = document.querySelector(
  '.showcase-loads-container-alsoLike-gallery'
);
if (alsoLike)
  alsoLike.addEventListener('click', function () {
    showAlsoLike.classList.toggle('gallery-active');
  });

var checkoutButton = document.getElementById('checkout-button');
if (checkoutButton)
  checkoutButton.addEventListener('click', function () {
    const stripe = Stripe(
      'pk_test_51IWNL3JMGciq6dxqMnbSC6S7Sa15oelmIKAEPuQ3E31c7rHhpzJVSMvZsIDcFksrPb8KN3aDnYamqoe46bIlVnMW00nC7lvWaY'
    );
    // Create a new Checkout Session using the server-side endpoint you
    // created in step 3.
    fetch('/charge', {
      method: 'POST',
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (session) {
        return stripe.redirectToCheckout({ sessionId: session.id });
      })
      .then(function (result) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, you should display the localized error message to your
        // customer using `error.message`.
        if (result.error) {
          alert(result.error.message);
        }
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
  });

const btnGreenDev = document.querySelector('.btnGreenDev1');
// const infoContentHidden = document.querySelectorAll(
//   '.information-content-personal-info-form '
// );
const formAddress = document.querySelector('.form__address__1');
const btnGreenDevAfter = document.querySelector('.btnGreenDev2');
const firstHidden = document.querySelectorAll('.firstHidden');
const deliverHidden = document.querySelectorAll('.deliverHidden');
const formClose = document.querySelector('.icon_form_close');
const formDeliveryAddress = document.querySelector('.deliver__to__address');
const searchAgain = document.querySelector('.search-again');
const informationContent = document.querySelector('.information-content');
const emptyTitle = document.querySelector('empty-title');
const confirmAddress = document.querySelector('.confirm__address');
const formInput = document.querySelectorAll('.form__input');
const emptyTitleSmall = document.querySelectorAll('.emptyTitleSmall');

const progressDetails = document.querySelector('#progress-details');
const clearInputFields = document.getElementById('clearInputFields');
if (clearInputFields)
  clearInputFields.addEventListener('click', function () {
    formInput.forEach((e) => {
      e.value = '';
    });
  });
if (btnGreenDevAfter)
  //Open second Form
  btnGreenDevAfter.addEventListener('click', function () {
    emptyTitleSmall.forEach((el) => {
      el.classList.add('active');
    });
    formAddress.style.visibility = 'visible';
    formAddress.style.opacity = '1';
    formAddress.style.height = 'auto';
    formAddress.style.transform = 'scale(1,1)';
  });
// CLose Form
if (formClose)
  formClose.addEventListener('click', function () {
    emptyTitleSmall.forEach((el) => {
      el.classList.remove('active');
    });
    formAddress.style.visibility = 'hidden';
    formAddress.style.opacity = '0';
    formAddress.style.height = '0rem';
  });

// Bottom Black  Confirm Address >
const mid = document.querySelector('.mid');
const deliver = document.querySelector('.deliver');

const addANewAddress = document.querySelector('.add_a_anew_address');

const progressDelivery = document.getElementById('progress-delivery');
const progressReview = document.getElementById('progress-review');

let saveDatas = [];
const saveData = (el) => {
  let addressData = {
    addressline1: document.getElementById('addressline1').value,
    town: document.getElementById('town').value,
    postCode: document.getElementById('postCode').value,
  };
  saveDatas.push(addressData);
};

if (confirmAddress)
  confirmAddress.addEventListener('click', function (el) {
    if (
      !document.getElementById('addressline1').value &&
      !document.getElementById('town').value &&
      !document.getElementById('postCode').value
    ) {
      return;
    }

    el.preventDefault();
    mid.style.visibility = 'hidden';
    mid.style.opacity = '0';
    mid.style.height = '0rem';
    mid.style.transform = 'scale(1,0)';
    deliver.classList.remove('deliver__to__address');
    deliver.classList.remove('hidden');

    progressDelivery.classList.add('activ');
    progressDelivery.classList.add('complete');
    progressDelivery.classList.add('bold');

    saveData();
    localStorage.setItem('Client address', JSON.stringify(saveDatas));

    // formInput.forEach((e) => {
    //   e.value = '';
    // });
  });

if (addANewAddress)
  addANewAddress.addEventListener('click', function () {
    window.location.reload();
  });

const btnGreenProceedReview = document.querySelector('.review-proceed-green');
const btnGreyProceedReview = document.querySelector('.review-proceed-grey');
const producReview = document.querySelector('.product-review');
const contentTotal = document.querySelector('.content-total');
if (btnGreyProceedReview)
  btnGreyProceedReview.addEventListener('click', function () {
    mid.style.visibility = 'visible';
    mid.style.opacity = '1';
    mid.style.height = 'auto';
    mid.style.transform = 'scale(1,1)';
    deliver.classList.add('deliver__to__address');
  });
if (btnGreenProceedReview)
  btnGreenProceedReview.addEventListener('click', function (e) {
    e.preventDefault();
    formDeliveryAddress.textContent = '';
    producReview.classList.remove('active');
    //  contentTotal.classList.remove('active')
  });

const purchaseSecurely = document.querySelector('.purchaseSecurely');
const paymentMethods = document.querySelector('.payment-methods ');
if (purchaseSecurely)
  purchaseSecurely.addEventListener('click', function () {
    producReview.classList.add('active');
    paymentMethods.classList.remove('active');

    progressReview.classList.add('activ');
    progressReview.classList.add('complete');
    progressReview.classList.add('bold');
  });
// if (searchAgain)
//   searchAgain.addEventListener('click', function (e) {
//     e.preventDefault();
//   });
