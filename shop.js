const apiKey = '8568df7ff8cf687886db937d5dc2ebc7';
const imageBase = 'https://image.tmdb.org/t/p/w500';
const cart = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();
  setupEventListeners();
});

function fetchMovies() {
  fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ru&page=1`)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('movieList');
      container.innerHTML = '';

      data.results.slice(0, 9990).forEach(movie => {
        const poster = movie.poster_path
          ? `${imageBase}${movie.poster_path}`
          : 'https://via.placeholder.com/220x330?text=Нет+постера';

        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
          <img src="${poster}" alt="${movie.title}">
          <h3>${movie.title}</h3>
          <p>Год: ${movie.release_date ? movie.release_date.slice(0, 4) : 'неизвестно'}</p>
          <p>Рейтинг: ${movie.vote_average}</p>
          <button class="add-to-cart">Добавить в корзину</button>
        `;
        card.querySelector('.add-to-cart').addEventListener('click', () => addToCart(movie));
        card.addEventListener('click', (e) => {
          if (!e.target.classList.contains('add-to-cart')) {
            getTrailer(movie.id);
          }
        });
        container.appendChild(card);
      });
    });
}

function addToCart(movie) {
  const price = Math.floor(Math.random() * 150) + 10; // Случайная цена от 100 до 600
  cart.push({ title: movie.title, price });
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartItemsElement = document.getElementById('cartItems');
  const cartTotalElement = document.getElementById('cartTotal');
  cartItemsElement.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.title} — ${item.price}$
      <button onclick="removeFromCart(${index})">Удалить</button>
    `;
    cartItemsElement.appendChild(li);
  });

  cartTotalElement.textContent = `Итого: ${total}$`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

function setupEventListeners() {
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Ваша корзина пуста!');
      return;
    }

    const titles = cart.map(item => item.title).join(', ');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Вы оформили заказ на сумму ${total}$: ${titles}`);
    cart.length = 0; // Очистить корзину
    updateCartDisplay();
  });

  document.getElementById('closeModal').addEventListener('click', closeModal);
  window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
      closeModal();
    }
  });
}

function getTrailer(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=ru`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const trailers = data.results.filter(v => v.site === "YouTube" && v.type === "Trailer");
      if (trailers.length > 0) {
        openModal(trailers[0].key);
      } else {
        alert("Трейлер не найден 😢");
      }
    })
    .catch(() => alert("Ошибка загрузки трейлера"));
}

function openModal(videoKey) {
  const iframe = document.getElementById('trailerFrame');
  iframe.src = `https://www.youtube.com/embed/${videoKey}?autoplay=1`;
  document.getElementById('modal').style}