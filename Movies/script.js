const apiKey = "b66fe8d54ed333db3ecd37aeed14154d";
let movies = [];
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

// Получение популярных фильмов при загрузке
document.addEventListener("DOMContentLoaded", () => {
    getRecommendedMovies();
});

async function getRecommendedMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
        const data = await response.json();
        movies = data.results;
        displayMovies(movies);
    } catch (error) {
        console.error("Ошибка получения популярных фильмов:", error);
    }
}

// Поиск фильмов по названию
document.getElementById("searchInput").addEventListener("input", async () => {
    const query = document.getElementById("searchInput").value;
    if (query) {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
        const data = await response.json();
        displaySuggestions(data.results.slice(0, 5));
    } else {
        document.getElementById("suggestions").innerHTML = "";
    }
});

function displaySuggestions(suggestions) {
    const suggestionsBox = document.getElementById("suggestions");
    suggestionsBox.innerHTML = suggestions
        .map(movie => `<div class="suggestion-item" onclick="selectSuggestion('${movie.title}')">${movie.title}</div>`)
        .join("");
}

function selectSuggestion(title) {
    document.getElementById("searchInput").value = title;
    searchMovies();
    document.getElementById("suggestions").innerHTML = "";
}

async function searchMovies() {
    const query = document.getElementById("searchInput").value;
    if (query) {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
        const data = await response.json();
        movies = data.results;
        displayMovies(movies);
    }
}

function displayMovies(movies) {
    const movieGrid = document.getElementById("movieGrid");
    movieGrid.innerHTML = movies
        .map(movie => `
            <div class="movie-card" onclick="showMovieDetails(${movie.id})">
                <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
                <h3>${movie.title}</h3>
                <p class="movie-details">Жанр: ${movie.genre_ids.join(", ")}</p>
                <p class="movie-details">Год выпуска: ${new Date(movie.release_date).getFullYear()}</p>
                <p class="movie-details">Рейтинг: ${movie.vote_average}</p>
                <button onclick="addToWatchlist(event, ${movie.id})">${watchlist.includes(movie.id) ? "Удалить из списка" : "Добавить в список"}</button>
            </div>
        `).join("");
}

async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,videos`);
        const movie = await response.json();
        document.getElementById("movieDetails").innerHTML = `
            <h2>${movie.title}</h2>
            <p>Рейтинг: ${movie.vote_average}</p>
            <p>Время: ${movie.runtime} минут</p>
            <p>Синопсис: ${movie.overview}</p>
            <p>Актеры: ${movie.credits.cast.slice(0, 5).map(actor => actor.name).join(", ")}</p>
            ${movie.videos.results.length ? `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${movie.videos.results[0].key}" frameborder="0" allowfullscreen></iframe>` : ""}
        `;
        document.getElementById("modal").classList.remove("hidden");
    } catch (error) {
        console.error("Ошибка получения деталей фильма:", error);
    }
}

function closeModal() {
    document.getElementById("modal").classList.add("hidden");
}

function addToWatchlist(event, movieId) {
    event.stopPropagation();
    if (!watchlist.includes(movieId)) {
        watchlist.push(movieId);
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        alert("Фильм добавлен в список!");
    }
    displayMovies(movies);  
}

function displayWatchlist() {
    window.location.href = 'watchlist.html';
}

function sortMovies(criteria) {
    if (criteria === "popularity") {
        movies.sort((a, b) => b.popularity - a.popularity);
    } else if (criteria === "release_date") {
        movies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (criteria === "rating") {
        movies.sort((a, b) => b.vote_average - a.vote_average);
    }
    displayMovies(movies);
}
