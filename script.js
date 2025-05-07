const apiKey = '8568df7ff8cf687886db937d5dc2ebc7';
const imageBase = 'https://image.tmdb.org/t/p/w500';

window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    document.body.style.background = '#111';
  }, 2200);
});

function openModal(videoKey) {
  const iframe = document.getElementById('trailerFrame');
  iframe.src = `https://www.youtube.com/embed/${videoKey}?autoplay=1`;
  document.getElementById('modal').classList.add('active');
}

function closeModal() {
  const iframe = document.getElementById('trailerFrame');
  iframe.src = '';
  document.getElementById('modal').classList.remove('active');
}

window.onclick = function(event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    closeModal();
  }
};

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

fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=ru&page=1`)
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















  const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Проверка сохранённой темы в localStorage
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  // Сохранение выбранной темы в localStorage
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  body.classList.add('dark-mode');
}

