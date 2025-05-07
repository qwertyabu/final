const apiKey = '8568df7ff8cf687886db937d5dc2ebc7';
const imageBase = 'https://image.tmdb.org/t/p/w500';

// Splash
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.body.style.background = '#111';
  }, 2200);
});

// Открыть трейлер в модалке
function openModal(videoKey) {
  const iframe = document.getElementById('trailerFrame');
  iframe.src = `https://www.youtube.com/embed/${videoKey}?autoplay=1`;
  document.getElementById('modal').classList.add('active');
}

// Закрыть модалку
function closeModal() {
  document.getElementById('trailerFrame').src = '';
  document.getElementById('modal').classList.remove('active');
}

// Получение трейлера
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

// Загрузка фильмов с сортировкой
function loadMovies(sortBy = 'popularity.desc') {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=ru&sort_by=${sortBy}&page=1`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('movieList');
      container.innerHTML = '';

      data.results.slice(0, 10).forEach(movie => {
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
        `;
        card.onclick = () => getTrailer(movie.id);
        container.appendChild(card);
      });
    });
}

// Сортировка
function sortMovies() {
  const sortBy = document.getElementById('sortSelect').value;
  loadMovies(sortBy);
}

// Открытие трейлера с кнопки (в шапке)
const video = document.getElementById("video");
const myModal = document.getElementById("myModal");
const trailerURL = "https://www.youtube.com/embed/uPzOyzsnmio?autoplay=1";

function openModalButton() {
  video.src = trailerURL;
  myModal.style.display = "block";
}

function closeModalButton() {
  video.src = "";
  myModal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target === myModal) {
    closeModalButton();
  }
};

// Загружаем фильмы при старте
loadMovies();


function searchMovies() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;
  
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=ru&query=${encodeURIComponent(query)}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById('movieList');
        container.innerHTML = '';
  
        if (data.results.length === 0) {
          container.innerHTML = '<p style="color:white;text-align:center;">Ничего не найдено.</p>';
          return;
        }
  
        data.results.slice(0, 10).forEach(movie => {
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
          `;
          card.onclick = () => getTrailer(movie.id);
          container.appendChild(card);
        });
      })
      .catch(() => {
        alert("Ошибка при поиске.");
      });
  }
  
  















