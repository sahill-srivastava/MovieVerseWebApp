import { showloader, resetloader, state, fetchMovie, debounce, fetchMovieDetails } from "./main.js";

//DOM refs
const movieFilterEl = document.getElementById("filter-movies");

const searchBoxEl = document.getElementById("search-box");

const searchBtnEl = document.getElementById("search-button")

const suggestionBox = document.querySelector(".suggestion_box");

const cardPanel = document.querySelector(".card_panel");

const prevBtnEl = document.querySelector(".prev");
const nextBtnEl = document.querySelector(".next");

const pageCountEl = document.getElementById("page-count")
const totalPageCountEl = document.getElementById("total-page-count")

/*----------------------------States-------------------------------*/

let isSelecting = false;
let isTyping = false;

/*---------------------------Helper functions---------------------*/

function setState(updates) {

    Object.assign(state, updates);

}

function resetError() {

    suggestionBox.classList.remove("error-msg", "active")

}

function showError(error) {
    if (!error) return;

    suggestionBox.textContent = `⚠️ ${error}`;
    suggestionBox.classList.add("error-msg", "active");
}


/*--------------------------------UI functions---------------------*/

function createCardBox(movie) {

    const {
        Poster: posterUrl,
        Title: title,
        Year: year,
        Type: category,
        imdbID
    } = movie;

    const a = document.createElement("a")
    a.href = `movie-detail.html?imdbID=${imdbID}`;
    a.classList.add("card_box");

    const img = new Image();

    img.src = posterUrl;

    img.onload = () => {
        a.style.backgroundImage = `url(${posterUrl})`;
    };

    img.onerror = () => {
        a.style.backgroundImage = `url(../assets/no-poster-avail.png)`;
    };

    a.target = "_self";

    a.innerHTML = `
     <div class="card_content_box">
        <h2 class="movie_title">${title}</h2>
        <p><span class="movie_year">${year}</span> • <span class="movie_type">${category}</span></p>
    </div>
    `

    cardPanel.append(a);

}

function showSuggestions(result) {

    suggestionBox.innerHTML = "";

    let movieCount = 0;

    result.movies.forEach(movie => {


        if (movieCount < 6) {

            const title = movie.Title;
            const year = movie.Year;
            const url = `movie-detail.html?imdbID=${movie.imdbID}`

            const li = document.createElement("li");

            const div = document.createElement("div");
            div.innerHTML = `
            <i class="fa-brands fa-sistrix"></i>
            <span class="suggestion_movie_title">${title}</span>
            <span class="suggestion_movie_year"> (${year})</span>
            `

            div.addEventListener("click", () => {
                isSelecting = true;

                setState({
                    query: title,
                    page: 1
                })


                searchBoxEl.value = ""
                suggestionBox.innerHTML = "";
                suggestionBox.style.display = "none"
                handleSearch();
                window.location.href = url;
            })


            li.append(div)
            suggestionBox.style.display = "block"
            suggestionBox.append(li);
            isTyping = false;

            movieCount++;
        }

        return;


    })

}

function renderUI(result) {
    cardPanel.innerHTML = "";

    result.movies.forEach(movie => {

        createCardBox(movie)

    })
}

function updateUI(result) {

    if (!state.query) {
        suggestionBox.innerHTML = "";
    }

    if (isTyping) {
        showSuggestions(result)
    }

    setTimeout(() => {
        resetloader();
        cardPanel.style.display = "grid";
        renderUI(result);

    }, 300);
}


/*---------------------------Logic functions-----------------------*/

async function handleSearch() {

    showloader();
    cardPanel.style.display = "none";

    const result = await fetchMovie(state);

    if (!result.success) {
        showError(result.error);
        return;
    } else {
        resetError();
    }

    //stop calling after showing suggestions
    if (isSelecting) {
        isSelecting = false;
        return;
    }



    state.totalPages = Math.ceil(result.totalResults / 10);

    //update pages
    pageCountEl.textContent = state.page;
    totalPageCountEl.textContent = state.totalPages;

    updateUI(result);
}

const debouncedFetchMovie = debounce(handleSearch, 400)

function handleInput(e) {

    isTyping = true;
    setState({
        query: e.target.value.trim(),
        page: 1
    })

    if (!state.query) {
        suggestionBox.innerHTML = "";
        return;
    };


    debouncedFetchMovie();
}

function handleClick() {

    const value = searchBoxEl.value;
    // isTyping = true;
    setState({
        query: value,
        page: 1
    })

    if (!state.query) {
        suggestionBox.innerHTML = "";
        return;
    };


    debouncedFetchMovie();
}


/*-----------------------------On first load-----------------------*/

document.addEventListener("DOMContentLoaded", () => {

    setState({
        query: "avengers",
        page: 1
    })

    handleSearch();
    suggestionBox.innerHTML = "";
    searchBoxEl.value = "";
})


/*-----------------------------Event listeners---------------------*/
searchBoxEl.addEventListener("input", handleInput)

searchBtnEl.addEventListener("click", handleClick)

//clear suggestion box li's
document.addEventListener("click", () => {
    suggestionBox.innerHTML = "";
    suggestionBox.style.display = "none"
})

movieFilterEl.addEventListener("input", (e) => {

    setState({
        type: e.target.value,
        page: 1
    })

    if (!state.query) {
        suggestionBox.innerHTML = "";
        return;
    };

    debouncedFetchMovie()
})

prevBtnEl.addEventListener("click", () => {

    if (state.page > 1) {
        state.page--;
        handleSearch();
    }

})

nextBtnEl.addEventListener("click", () => {

    if (state.page < state.totalPages) {
        state.page++;
        handleSearch();
    }
})


