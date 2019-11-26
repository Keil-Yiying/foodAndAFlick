// html page needs to have 2 search inputs, one for movie genres and one for main ingredient
	// inputs may be dropdown menus due to the way the APIs are structured
// user chooses genre and ingredient and presses submit button
	// save the user's choices to variables, which will be passed to the API calls as search parameters
// Two API calls to (1) movie API using genre and (2) to recipe API using ingredient
	// use .when() to wait for both calls to return the data
// API returns some results for each (number might depend on app design)
// append results on html page with images (maybe 4-6 for each)

const app = {};

app.movieKey = '38f9a8f5c677f0356adca226f357b762';
app.movieUrl = `https://api.themoviedb.org/3/discover/movie`;
app.movieInfoUrl = `https://www.themoviedb.org/movie/`;
app.movieImgUrl = `https://image.tmdb.org/t/p/w500`;

app.recipeKey = `37d5d0c2cce74758b4307f9f5c729c0d`;
app.recipeUrl = `https://api.spoonacular.com/recipes/random`; 


/*
    AJAX CALLS
*/
app.getMovies = function(query, page, releaseDate) {
    return $.ajax({
        url: app.movieUrl,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: app.movieKey,
            with_genres: query,
            page: page,
            'primary_release_date.lte': releaseDate,
            include_adult: false
            }
    })
}

app.getRecipes = function(query) {
    return $.ajax({ 
        url: app.recipeUrl, 
        method: 'GET', 
        dataType: 'json', 
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            apiKey: app.recipeKey,
            tags: query,
            number: 4
        }
    })
}

// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV
// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
// SHOULD WE ADD A LOADING CIRCLE CUZ THE AJAX CALLS TAKE A FEW SECONDS??????
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


/*
    METHODS
*/
// getting the current date so the movie API won't return unreleased movies
app.setMovieReleaseDate = function() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate() + 1;
    app.movieReleaseDate = `${year}-${month}-${day}`;
}

// method to print movies to page
app.printMoviesToPage = function(title, year, imgUrl, blurb, id) {
    const movieHtml = `
        <div class="movie-card flex-container" data-aos="fade-up" data-aos-duration="500">
            <div class="movie-img">
                <img src="${app.movieImgUrl}${imgUrl}" alt="Movie poster for ${title}">
            </div>
            <div class="card-text">
                <p class="card-title">${title} <span class="movie-year">(${year})</span></p>
                <p>${blurb}... <a href="${app.movieInfoUrl}${id}">Read more</a></p>
            </div>
        </div>
    `;
    $('.movie-results').append(movieHtml);
}

// method to print recipes to page
app.printRecipesToPage = function(title, imgUrl, readyTime, steps, ingredients, dishTypes, wines, url) {
    const recipeHtml = `
        <div class="recipe-card flex-container" data-aos="fade-up" data-aos-duration="500">
            <div class="recipe-img">
                <img src="${imgUrl}" alt="${title}">
            </div>
            <div class="card-text">
                <p class="card-title">${title}</p>
                <p>Ready in ${readyTime}</p>
                <p>${steps.length} steps, ${ingredients.length} ingredients</p>
                ${dishTypes}
                ${wines}
                <p><a href="${url}">Go to recipe</a></p>
            </div>
        </div>
    `;
    $('.recipe-results').append(recipeHtml);
}

// method to get "ready in x min" info & convert to a readable format
app.getRecipeReadyTime = function(recipeTimeData) {
    if (recipeTimeData < 60) {
        const readyTimeString = `${recipeTimeData} minutes`;  
        return readyTimeString;
    } else {
        const hours = Math.round(recipeTimeData / 60);
        if (recipeTimeData % 60 === 0) {
            const readyTimeString = `${hours} hours`;
            return readyTimeString;
        } else {
            const minutes = Math.round(recipeTimeData % 60);
            const readyTimeString = `${hours}h ${minutes}min`;
            return readyTimeString; 
        }
    }
}

// method to get dish types
app.getDishType = function(dishTypes) {
    const dishTypeList = dishTypes;
    let dishTypeString = `<p>Dish Type(s): `;
    if (dishTypeList == false) {
        dishTypeString = '';
        return dishTypeString;
    } else {
        for (let i = 0; i < dishTypeList.length; i++ ) {
            if (i === (dishTypeList.length - 1)) {
                dishTypeString += `${dishTypeList[i]}</p>`;
            } else {
                dishTypeString += `${dishTypeList[i]}, `;
            } 
        }
        return dishTypeString; 
    }   
}

// method to get wine pairings
app.getWinePairings = function(wineList) {
    const winePairingList = wineList;
    let wineString = `<p>Wine Pairing(s): `;
    if (winePairingList === undefined) {
        wineString = '';
        return wineString;
    } else {
        for (let i = 0; i < winePairingList.length; i++ ) {
            if (i === (winePairingList.length - 1)) {
                wineString += `${winePairingList[i]}</p>`;
            } else {
                wineString += `${winePairingList[i]}, `;
            } 
        }
        return wineString;
    }
}


app.init = function() {   
    
    /*
        METHODS THAT NEED TO INITIALIZE
    */
    $('.fa-chevron-down').hide();
    $('h3').hide();
    $('.search-again').hide();
    $('footer').hide();
    
    /*
        EVENT HANDLERS
    */
    $('form').on('submit', function (e) {
        e.preventDefault();

        app.usersFoodChoice = $('#food-search').val();
        app.usersGenreChoice = parseInt($('#genre-search').val());
        
        if (app.usersFoodChoice === '') {
            alert('Please make sure you entered a recipe to search and a movie genre!');
        } else {

            /* 
            using Math.random() to add some randomization to the movie results that show up, otherwise they will always return the top 4 of that genre listed on the API 
            */
            const moviePage = Math.ceil(Math.random() * 100);
            app.setMovieReleaseDate();
        
            $('#food-search').val(''); // reset inputs after submit
            $('#genre-search').val(28);
        
            // using Promises to wait for both movie & recipe API calls
            $.when(app.getMovies(app.usersGenreChoice, moviePage, app.movieReleaseDate), app.getRecipes(app.usersFoodChoice))
            .then(function(movieChoices, recipeChoices) {
                $('.fa-chevron-down').show();
                $('h3').show();
                $('.search-again').show();
                $('footer').show();
                
                // printing movies to page
                $('.movie-results').empty();
                for (let i = 0; i < 4; i++) {
                    const movie = movieChoices[0].results[i];
                    const movieYear = movie.release_date.slice(0, 4);
                    
                    // making the movie blurbs a bit shorter so they don't stretch the page
                    const movieBlurb = movie.overview.slice(0, 241);

                    app.printMoviesToPage(movie.title, movieYear, movie.poster_path,movieBlurb, movie.id);                    
                } // end of for loop - movies
                    
                // printing recipes to page
                $('.recipe-results').empty();
                for (let i = 0; i < 4; i++) {
                    const recipe = recipeChoices[0].recipes[i];
                    const readyTime = app.getRecipeReadyTime(recipe.readyInMinutes);

                    // get dish types & wine pairings for each recipe, if available
                    const dishTypeHtml = app.getDishType(recipe.dishTypes);
                    const wineHtml = app.getWinePairings(recipe.winePairing.pairedWines);

                    app.printRecipesToPage(recipe.title, recipe.image, readyTime, recipe.analyzedInstructions[0].steps, recipe.extendedIngredients, dishTypeHtml, wineHtml, recipe.sourceUrl);
                } // end of for loop - recipes
            })
            .fail(function(error) {
                alert('Sorry, no results found! Please try another search.');
            });
        }  // end of if-else for getting results
    }) // end of form submit event handler

    // changing the heart icon to utensils on hover when searching recipes
    $('.food-search-container').hover(
        function(){
            $('.icon').removeClass('fa-heart');
            $('.icon').addClass('fa-utensils');
        },
        function(){
            $('.icon').removeClass('fa-utensils');
            $('.icon').addClass('fa-heart');
        })
    
    // changing the heart icon to film on hover when searching movies
    $('.genre-search-container').hover(
        function () {
            $('.icon').removeClass('fa-heart');
            $('.icon').addClass('fa-film');
        },
        function () {
            $('.icon').removeClass('fa-film');
            $('.icon').addClass('fa-heart');
        })

    // smooth scrolling
    $('.fa-chevron-down').on('click', function() {
        $('html, body').animate({ 
            scrollTop: $('#results').offset().top
        }, 500);
    })

    $('.search-again-button').on('click', function() {
        $('html, body').animate({ 
            scrollTop: $('#landing').offset().top
        }, 1000);
    })

} // end of app.init()


$(function () {
    AOS.init(); // animate on scroll
    app.init();
});


