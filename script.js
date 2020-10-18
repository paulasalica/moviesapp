const APIURL = 'https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&sort_by=popularity.desc&page=1'
const IMGPATH = "https://image.tmdb.org/t/p/w1280/";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.querySelector(".main-movies");
const form = document.getElementById("form");
const search = document.getElementById("search");
const carouselInner = document.querySelector(".carousel-inner");
const popularMovies = document.querySelector(".popular-movies");

getMovies(APIURL);

async function getMovies(url) {
    const response = await fetch(url);
    const responseData = await response.json();

    console.log(responseData);

    showCarousel(responseData.results);
    showTrendingMovies(responseData.results);
    showMovies(responseData.results);
}

async function getMoviesSearch(url) {
    const response = await fetch(url);
    const responseData = await response.json();

    showMovies(responseData.results);
}

function showCarousel(movies) {
    const populars = movies.sort(function (a, b) { return b.popularity - a.popularity; }).slice(0, 5);
    console.log(populars);
    
    for (let i=0; i<5; i++) {
        const item = document.createElement('div');
        
        if (i==0) {
            item.classList.add('item', 'active');
        } else {
            item.classList.add('item');
        }

        const releaseDate = populars[i].release_date.split('-');
        const year = releaseDate[0];
        
       item.innerHTML = `
        <img src="${IMGPATH + populars[i].poster_path}" alt="${populars[i].title}" >
        <div class="item-info">
            <h3>${populars[i].title}</h3>
            <span class="year">${year}</span><br>
            <p class="overv">${populars[i].overview}</p>
        </div>
        `;

        carouselInner.appendChild(item);
    }; 
}

function showTrendingMovies(movies) {
    popularMovies.innerHTML = '';

    var top5 = movies.sort(function (a, b) { return b.vote_average - a.vote_average; }).slice(0, 5);
   
    top5.forEach(movie => {
        const {poster_path, title, vote_average} = movie;

        const movieEl = document.createElement('li');
        movieEl.classList.add('popular-movie');
        
        movieEl.children.createElement

        movieEl.innerHTML = `
            <img src="${IMGPATH + poster_path}" alt="${title}" >
            <div class="popular-movie-info">
                <span class="${getClassByRate(vote_average)}">${vote_average}</span>
            </div>
        `;

        popularMovies.appendChild(movieEl);
    });
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
                <p class="text">${overview}</p>
            </div>
        `;

        main.appendChild(movieEl);
    });
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
        getMoviesSearch(SEARCHAPI + searchTerm);
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

    $('.mobile-nav-icon').click(function() {
        const options = $('.options');
        const icon = $('.mobile-nav-icon i');
        const nav = $('nav');

        options.slideToggle(400);

        if (icon.hasClass('glyphicon-menu-hamburger')) {
            icon.addClass('glyphicon-remove');
            icon.removeClass('glyphicon-menu-hamburger');
        } else {
            icon.addClass('glyphicon-menu-hamburger');
            icon.removeClass('glyphicon-remove');
        }

        if (nav.hasClass('sticky')) {
            nav.removeClass('sticky');
        }
    });
});

