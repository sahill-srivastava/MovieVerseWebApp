import { showloader, resetloader, fetchMovie, debounce, fetchMovieDetails } from "./main.js";

//DOM refs
const moviePanel = document.querySelector(".movie_info_panel");
const errMsg = document.querySelector(".error-message");

const movieTitle = document.getElementById("movie-title");
const movieYear = document.getElementById("movie-year");

const movieRating = document.getElementById("imdb-rating");
const movieGenre = document.getElementById("genre");
const movieLang = document.getElementById("language");
const moviePlot = document.getElementById("plot");
const movieCast = document.getElementById("actors");
const movieDir = document.getElementById("directors");
const movieWriters = document.getElementById("writers");
const movieCountry = document.getElementById("country");


/*----------------------------States-------------------------------*/

//fetch imdbID
const params = new URLSearchParams(window.location.search);
const imdbID = params.get("imdbID");


/*---------------------------Helper functions---------------------*/

function showError(error) {
    if (!error) return;

    resetloader();

    moviePanel.innerHTML = "";

    const img = new Image();

    img.src = "../assets/movie-error.png";
    img.alt = "movie-not-found"

    moviePanel.append(img)

    setTimeout(() => {
        // window.history.back();
        window.location.href = "index.html"
    }, 2000);
}


function createMoviePanel(result) {

    moviePanel.innerHTML = "";

    moviePanel.innerHTML = `
     <div class="poster_container"></div>
                <div class="movie_info_container">
                    <h1> <span id="movie-title"></span>${result.movieName}<span id="movie-year">(${result.year})</span>
                    </h1>

                    <p><strong>IMDB Rating</strong>: <span id="imdb-rating">${result.rating}</span> ⭐⭐⭐⭐</p>

                    <p><strong>Genre</strong>: <span id="genre">${result.genre}</span></p>
                    <p><strong>Language</strong>: <span id="language">${result.language}</span></p>


                    <p><strong>Plot</strong>: <span id="plot">${result.plot}</span>
                    </p>

                    <p><strong>Cast</strong>: <span id="actors">${result.cast}</span></p>

                    <p><strong>Directors</strong>: <span id="directors">${result.directors}</span>
                    </p>

                    <p><strong>Writers</strong>: <span id="writers">${result.writers}</span>
                    </p>

                    <p><strong>Country</strong>: <span id="country">${result.country}</span>
                    </p>
                </div>
    `

    const poster = document.querySelector(".poster_container");

    const img = new Image();

    img.src = result.posterUrl;

    img.onload = () => {
        poster.style.backgroundImage = `url(${result.posterUrl})`;
    };

    img.onerror = () => {
        poster.style.backgroundImage = `url(../assets/no-poster-avail.png)`;
    };

}


/*--------------------------------UI functions---------------------*/

function renderUI(result) {


    setTimeout(() => {
        resetloader();
        createMoviePanel(result);
    }, 600)

}

/*---------------------------Logic functions-----------------------*/

async function handleMovieDetails() {

     showloader();

    const result = await fetchMovieDetails(imdbID);

    if (!result.success) {
        showError(result.error);
        return;
    } else {
        renderUI(result);
    }


}

/*---------------------------On first load-----------------------*/

document.addEventListener("DOMContentLoaded", () => {

    handleMovieDetails();

})