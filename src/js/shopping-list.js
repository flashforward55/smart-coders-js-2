import { DataFirebase } from './firebaseInteraction.js';
const dataFirebase = new DataFirebase();

import { getData, storageData } from './local-storage';

export const refs = {
  container: document.querySelector('.shop-list__empty-page'),
  cards: document.querySelector('.shop-list__cards'),
};

// видаляємо книгу з localStorage та з розмітки сторінки
refs.cards.addEventListener('click', onRemoveCard);

function onRemoveCard(evt) {
  if (!evt.target.closest('.btn-trash-box')) {
    return;
  }

  const card = evt.target.closest('.shop-list__one-card');
  const id = card.dataset.id;

  // видаляємо книгу з localStorage
  const bookShopKeys = Object.keys(storageData);

  bookShopKeys.forEach(key => {
    if (storageData[key].id === id) {
      delete storageData[key];
    }
  });

  localStorage.setItem('shopingList', JSON.stringify(storageData));

  // видаляємо книгу з розмітки сторінки
  evt.target.closest('.shop-list__one-card').remove();

  getData();

  // якщо всі книги видалено, генерується розмітка пустої сторінки
  if (!refs.cards.children.length) {
    refs.cards.classList.add('visually-hidden');
    refs.container.innerHTML = `
    <div class="shop-list__empty-page">
    <p class="textEmptyPage">
      This page is empty, add some books and proceed to order.
    </p>
    <img class="imgEmptyPage" src="./images/is-empty@2x.png" alt="books" />
  </div>`;
  }
}

const btnTrash = document.querySelector('.shop-list__cards');
btnTrash.addEventListener('click', onBtnTrash);

async function onBtnTrash(e) {
  if (!e.target.closest('.btn-trash-box')) {
    return;
  }
  const id = e.target.closest('button').dataset.id;

  await dataFirebase.deleteBook(id);
  // window.location.reload();
}
