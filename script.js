const APIURL = 'https://api.themoviedb.org/3/discover/movie?api_key=04c35731a5ee918f014970082a0088b1&language=en-US&sort_by=popularity.desc&page=1'
const IMGPATH = "https://image.tmdb.org/t/p/w1280/";
const SEARCHAPI = "https://api.themoviedb.org/3/search/movie?api_key=04c35731a5ee918f014970082a0088b1&query=";

const main = document.querySelector(".main-movies");
const form = document.getElementById("form");
const search = document.getElementById("search");
const carouselInner = document.querySelector(".carousel-inner");
const popularMovies = document.querySelector(".popular-movies");
const options = document.querySelectorAll('.options li a');
const mobileIcon = document.querySelector('.mobile-nav-icon');


var flagSearch = false;

getMovies(APIURL, flagSearch);

// This function return Movies depending the section 
async function getMovies(url, flagSearch) {
    const response = await fetch(url);
    const responseData = await response.json();

    console.log(responseData);

    if (flagSearch == false) {
        showCarousel(responseData.results);
        showTrendingMovies(responseData.results);
    }

    showMovies(responseData.results);
}

// Carousel section - This function show de carousel
function showCarousel(movies) {
    const populars = movies.sort(function (a, b) { return b.popularity - a.popularity; }).slice(0, 5);
    
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

// Trending Now section - This function show the top 5 of movies with more votes
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

// Movies section - This function displayed all movies
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

// This function return a color depending the vote
function getClassByRate(vote) {
    if (vote >= 8) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

// Search movie
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const searchTerm = search.value;
   
    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm, true);
        search.value = '';
    }

    window.location.href = "#movies-online";
});

$(document).ready(function(){

    // For sticky navigation
    $('.main').waypoint(function(direction) {
        if (direction == "down") {
            $('nav').addClass('sticky');
        } else {
            $('nav').removeClass('sticky');
        }
    });

    // For mobile icon, expand and close menu
    $('.mobile-nav-icon').click(function() {
        const options = $('.options');
        const icon = $('.mobile-nav-icon i');

        options.slideToggle();

        if (icon.hasClass('glyphicon-menu-hamburger')) {
            icon.addClass('glyphicon-remove');
            icon.removeClass('glyphicon-menu-hamburger');
        } else {
            icon.addClass('glyphicon-menu-hamburger');
            icon.removeClass('glyphicon-remove');
        }
    });

    // Dinamic class active por navbar
    $(".option-nav").click(function() {
        $(".option-nav").parent().removeClass("active");
        $(this).parent().addClass("active");
    });
    
    // Attribute for mobile icon when it's displayed or not
    const displayAttribute = window.getComputedStyle(mobileIcon).getPropertyValue('display');
    const icon = document.querySelector('.glyphicon');
    if(displayAttribute=='block') {
        icon.setAttribute('aria-hidden', true);
    } else {
        icon.setAttribute('aria-hidden', false);
    }

});


