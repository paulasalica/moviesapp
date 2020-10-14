const APIURL = 'https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&sort_by=popularity.desc&page=1'
const IMGPATH = "https://image.tmdb.org/t/p/w1280/";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.querySelector(".main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const carouselInner = document.querySelector(".carousel-inner");

getMovies(APIURL);

async function getMovies(url) {
    const response = await fetch(url);
    const responseData = await response.json();

    console.log(responseData);

    showMovies(responseData.results);
    showCarousel(responseData.results);
}

function showMovies(movies) {

    main.innerHTML = '';
   
    movies.forEach(movie => {
        const {poster_path, title, vote_average, overview} = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${IMGPATH + poster_path}" alt="${title}" >
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                ${overview}
            </div>
        `;

        main.appendChild(movieEl);
    });
}

function showCarousel(movies) {
    
    for (let i=0; i<5; i++) {
        console.log(movies[i]);

        const item = document.createElement('div');
        if (i==1) {
            item.classList.add('item', 'active');
        } else {
            item.classList.add('item');
        }

        const releaseDate = movies[i].release_date.split('-');
        const year = releaseDate[0];
        
       item.innerHTML = `
        <img src="${IMGPATH + movies[i].poster_path}" alt="${movies[i].title}" >
        <div class="item-info">
            <h3>${movies[i].title}</h3>
            <span class="year">${year}</span>
            <span class="overview">${movies[i].overview}</span>
        </div>
        `;
       console.log(movies[i].overview);
        carouselInner.appendChild(item);
    }
}

function getClassByRate(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value;
   
    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm);
        search.value = '';
    }
});


$(document).ready(function(){
  
    /* for the sticky navigation */
    $('.main').waypoint(function(direction) {
        if (direction == "down") {
            $('nav').addClass('sticky');
        } else {
            $('nav').removeClass('sticky');
        }
    }, {
        offset: '60%'
    });
});

