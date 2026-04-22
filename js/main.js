

export const state = {
    query: "",
    type: "",
    page: 1,
    totalPages: 0
}

export async function fetchMovie(state) {

    if (!state.query) return;

    const {
        query: movieTitle,
        page,
        type,
    } = state;

    const params = new URLSearchParams({
        apikey: "72271f99",
        s: movieTitle,
        page

    })

    if (type) {
        params.append("type", type);
    }

    const URL = `https://www.omdbapi.com/?${params.toString()}`;


    try {

        const response = await fetch(URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        };

        const data = await response.json();

        const {
            Response,
            Error: errorMessage,
            Search,
            totalResults
        } = data;

        if (Response === "False") {
            return {
                success: false,
                type: "api",
                error: errorMessage,
                movies: [],
                totalResults: 0
            }
        }

        return {
            success: true,
            type: "success",
            error: null,
            movies: Search,
            totalResults: +(totalResults)
        }

    }

    catch (err) {
        return {
            success: false,
            type: "network",
            error: err.message,
            movies: [],
            totalResults: 0
        }
    }
}

// Add debounce to limit api calls
export function debounce(fn, delay) {
    let timer;

    return function (...args) {

        clearTimeout(timer) //cancel the last/previous call

        timer = setTimeout(() => {
            fn(...args)
        }, delay)
    }
}


export async function fetchMovieDetails(imdbID) {

    try {

        const URL = `https://www.omdbapi.com/?apikey=72271f99&i=${imdbID}`;

        const response = await fetch(URL)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        

        const {
            Actors: cast,
            Country: country,
            Director: directors,
            Genre: genre,
            Language: language,
            Plot: plot,
            Poster: posterUrl,
            Title: movieName,
            Writer: writers,
            Year: year,
            imdbRating: rating,
            Response
        } = data;

        if (Response === "False") {
            return {
                success: false,
                error: "Movie not found",
            }
        }

        return {
            cast,
            country,
            directors,
            genre,
            language,
            plot,
            posterUrl,
            movieName,
            writers,
            year,
            rating,
            success: true,
            error: null
        }

    } catch (err) {
        return {
            success: false,
            error: err.message
        }
    }

}


// loader
const loaderContainer = document.querySelector(".loader_container");
const loader = document.querySelector(".loader")

export function showloader() {

    loaderContainer.style.display = "flex";

}

export function resetloader() {

    loaderContainer.style.display = "none";
}

