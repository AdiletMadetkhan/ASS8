const apiKey = "b66fe8d54ed333db3ecd37aeed14154d";
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

document.addEventListener("DOMContentLoaded", loadWatchlist);

async function loadWatchlist() {
    const watchlistGrid = document.getElementById("watchlistGrid");
    watchlistGrid.innerHTML = "";

    if (watchlist.length > 0) {
        for (const movieId of watchlist) {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
            const movie = await response.json();
            watchlistGrid.innerHTML += `
                <div class="movie-card" onclick="showMovieDetails(${movie.id})">
                    <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                    <p>Год: ${new Date(movie.release_date).getFullYear()}</p>
                    <button onclick="removeFromWatchlist(event, ${movie.id})">Удалить</button>
                </div>
            `;
        }
    } else {
        watchlistGrid.innerHTML = "<p>Список пуст.</p>";
    }
}

function removeFromWatchlist(event, movieId) {
    event.stopPropagation();
    watchlist = watchlist.filter(id => id !== movieId);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    loadWatchlist();  // Refresh the watchlist display
}
