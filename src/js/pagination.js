import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';

import { createPaginataion } from './pagination-btn.js';
import {
  quantityPages,
  getNewDataBatch,
  getNewQuantityPages,
} from './local-storage';

Notify.init({
  fontSize: '20px',
  info: {
    background: 'rgba(79, 46, 232, 0.8)',
    textColor: '#fff',
    notiflixIconColor: '#fff',
  },
});
Report.init({
  backgroundColor: 'rgba(79, 46, 232, 0.8)',
  titleFontSize: '24px',
  messageFontSize: '18px',
  info: {
    svgColor: '#fff',
    titleColor: '#fff',
    messageColor: '#fff',
    buttonBackground: '#2f0fbc',
    buttonColor: '#fff',
    backOverlayColor: 'rgba(79, 46, 232, 0.2)',
  },
});

export const paginationLeft = document.querySelector('.js-pagination-left');
export const paginationCenter = document.querySelector('.js-pagination-center');
export const paginationRight = document.querySelector('.js-pagination-right');
const currentPageElement = document.getElementById('current');

let currentPage = 1;
if (quantityPages > 1) {
  currentPage = Number(currentPageElement.textContent);
}

let lastPage = quantityPages; //!!! const -> let
let page = 1;

//! =====================================================
// Mutation Observer для відслідковування зміни currentPageElement
const callback = function (mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      const element = document.getElementById('current');

      if (!element) {
        return;
      }

      currentPage = Number(element.textContent);
    }
  }
};

const observer = new MutationObserver(callback);

const config = { childList: true, subtree: true };

observer.observe(paginationCenter, config);

//! =====================================================

// Прослуховувач маркерів пагінації і додаткових (не статичних) кнопок
paginationCenter.addEventListener('click', handlerPaginationCenter);

function handlerPaginationCenter(evt) {
  if (!evt.target.classList.contains('js-pag-marker')) {
    if (evt.target.classList.contains('btn-pag--more-left')) {
      lastPage = getNewQuantityPages();
      page = currentPage - 3;

      getPaginationPage(page, lastPage);
    }

    if (evt.target.classList.contains('btn-pag--more-right')) {
      if (currentPage <= lastPage - 3) {
        lastPage = getNewQuantityPages();
        page = currentPage + 3;

        getPaginationPage(page, lastPage);
      } else {
        lastPage = getNewQuantityPages();
        page = lastPage;

        getPaginationPage(page, lastPage);
      }
    }

    return;
  }

  lastPage = getNewQuantityPages();
  page = Number(evt.target.textContent);

  getPaginationPage(page, lastPage);
}

// Прослуховувач лівих керівних кнопок пагінації
paginationLeft.addEventListener('click', handlerPaginationLeft);

function handlerPaginationLeft(evt) {
  if (!evt.target.closest('.js-pagination-left')) {
    return;
  }

  if (evt.target.closest('.js-pag-first')) {
    if (currentPage === 1) {
      Notify.info(
        'Congratulations! You are at the very beginning of the list!'
      );

      return;
    }

    lastPage = getNewQuantityPages();
    page = 1;

    getPaginationPage(page, lastPage);
  }

  if (evt.target.closest('.js-pag-prev')) {
    if (currentPage === 1) {
      Notify.info(
        'Congratulations! You are at the very beginning of the list!'
      );

      return;
    }

    lastPage = getNewQuantityPages();
    page = currentPage - 1;

    getPaginationPage(page, lastPage);
  }
}

// Прослуховувач правих керівних кнопок пагінації
paginationRight.addEventListener('click', handlerPaginationRight);

function handlerPaginationRight(evt) {
  if (!evt.target.closest('.js-pagination-right')) {
    return;
  }

  if (evt.target.closest('.js-pag-last')) {
    if (currentPage === lastPage) {
      Report.info('SORRY', 'This is the last page.', 'Ok');

      return;
    }

    lastPage = getNewQuantityPages();
    page = lastPage;

    getPaginationPage(page, lastPage);
  }

  if (evt.target.closest('.js-pag-next')) {
    if (currentPage === lastPage) {
      Report.info('SORRY', 'This is the last page.', 'Ok');

      return;
    }

    lastPage = getNewQuantityPages();
    page = currentPage + 1;

    getPaginationPage(page, lastPage);
  }
}

function getPaginationPage(page, lastPage) {
  getNewDataBatch(page);

  createPaginataion(page, lastPage);

  // currentPage = page; //застаріле (необхідне без MutationObserver)
}
