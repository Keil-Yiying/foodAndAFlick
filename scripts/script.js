// html page needs to have 2 search inputs, one for movie genres and one for main ingredient
	// inputs may be dropdown menus due to the way the APIs are structured
// user chooses genre and ingredient and presses submit button
	// save the user's choices to variables, which will be passed to the API calls as search parameters
// Two API calls to (1) movie API using genre and (2) to recipe API using ingredient
	// use .when() to wait for both calls to return the data
// API returns 5~10 results for each (number might depend on app design)
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

// BREAK DOWN EVENT HANDLER - TOO BIG

// SMALLEST MEDIA QUERY - MAYBE NEEDS LINKS TO SKIP TO MOVIES? THEN SKIP BACK TO FOODS? I DUNNO @____@;
    // can do this by changing a display: none to display: block or whatever upon smallest media query.

// SUBMIT BUTTON - maybe use position: absolute to keep it at bottom of screen
    // also needs arrow under for when results load? @________@ - js to show with display-none

// is there a way to use tab/focus to change the icon in the middle?
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^


// NEED AN ERROR CHECK IF USER DOES NOT SELECT ANYTHING FOR ONE OR BOTH INPUTS!!!!!!! - OR, if one doesn't return anything
    // so far I used an alert but it also alerts if one result goes wrong while other results load in ok >___<;;;

// weird error-handling thing:
    // no dish type = empty array, using == false works to catch it
    // no wine pairing = empty object, using == false gives an undefined error, but using == undefined works. (should I use === undefined?)
        // OHHH because I'm looking for the array inside the object, but if the object is empty, there is no array therefore it's undefined (but how come == false doesn't work?)

// ALSO NEED TO STYLE LINKS & LITERALLY EVERYTHING ELSE



// DEAL WITH FOOTER




// function for getting the current date so the movie API won't return unreleased movies
app.setMovieReleaseDate = function() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate() + 1;
    app.movieReleaseDate = `${year}-${month}-${day}`;
}


app.init = function() {    
    
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
                console.log(movieChoices[0], recipeChoices[0]); // REMOVE!!!
                
                $('h3').removeClass('display-none');
                $('.search-again').removeClass('display-none');
                
                // printing movies to page
                $('.movie-results').empty();
                for (let i = 0; i < 4; i++) {
                    const movie = movieChoices[0].results[i];
                    const movieYear = movie.release_date.slice(0, 4);
                    console.log(movieYear); // REMOVE!!!!
                    
                    // making the movie blurbs a bit shorter so they don't stretch the page
                    const movieBlurb = movie.overview.slice(0, 231);
                    console.log(movieBlurb); // REMOVE DIS <<<<
                    
                    const movieHtml = `
                        <div class="movie-card flex-container" data-aos="fade-up" data-aos-duration="500">
                            <div class="movie-img">
                                <img src="${app.movieImgUrl}${movie.poster_path}" alt="Movie poster for ${movie.title}">
                            </div>
                            <div class="card-text">
                                <p class="card-title">${movie.title} <span class="movie-year">(${movieYear})</span></p>
                                <p>${movieBlurb}... <a href="${app.movieInfoUrl}${movie.id}">Read more</a></p>
                            </div>
                        </div>
                    `;
                    $('.movie-results').append(movieHtml);
                } // end of for loop
                    
                // printing recipes to page
                $('.recipe-results').empty();
                for (let i = 0; i < 4; i++) {
                    const recipe = recipeChoices[0].recipes[i];
                    console.log(recipe); // REMOVE
                    console.log(recipe.dishTypes); // REMOVE~!!!!!

                    // getting recipe time / check if it's over 60 min
                    if (recipe.readyInMinutes < 60) {
                        const readyTime = `${recipe.readyInMinutes} minutes`;
                        console.log(readyTime);  // REMOVE    
                    } else {
                        const hours = Math.round(recipe.readyInMinutes / 60);
                        if (recipe.readyInMinutes % 60 === 0) {
                            const readyTime = `${hours} hours`;
                            console.log(readyTime); // REMOVE 
                        } else {
                            const minutes = Math.round(recipe.readyInMinutes % 60);
                            const readyTime = `${hours}h ${minutes}min`;
                            console.log(readyTime); // REMOVE 
                        }
                    }
                
                    
                    // Getting dish types for each recipe, if available.
                    const dishTypeList = recipe.dishTypes;
                    let dishTypeHtml = `<p>Dish Type(s): `;
                    if (dishTypeList == false) {
                        dishTypeHtml = '';
                    } else {
                        for (let i = 0; i < dishTypeList.length; i++ ) {
                            if (i === (dishTypeList.length - 1)) {
                                dishTypeHtml += `${dishTypeList[i]}</p>`;
                                console.log(dishTypeHtml); // REMOVE
                            } else {
                                dishTypeHtml += `${dishTypeList[i]}, `;
                                console.log(dishTypeHtml); // REMOVE
                            } 
                        }
                    }
                        
                    // Getting wine pairings for each recipe, if available.
                    const winePairingList = recipe.winePairing.pairedWines;
                    let wineHtml = `<p>Wine Pairing(s): `;
                    if (winePairingList === undefined) {
                        wineHtml = '';
                    } else {
                        for (let i = 0; i < winePairingList.length; i++ ) {
                            if (i === (winePairingList.length - 1)) {
                                wineHtml += `${winePairingList[i]}</p>`;
                                console.log(wineHtml); // REMOVE
                            } else {
                                wineHtml += `${winePairingList[i]}, `;
                                console.log(wineHtml); // REMOVE
                            } 
                        }
                    }
                
                    const recipeHtml = `
                        <div class="recipe-card flex-container" data-aos="fade-up" data-aos-duration="500">
                            <div class="recipe-img">
                                <img src="${recipe.image}" alt="${recipe.title}">
                            </div>
                            <div class="card-text">
                                <p class="card-title">${recipe.title}</p>
                                <p>Ready in ${readyTime}</p>
                                <p>${recipe.analyzedInstructions[0].steps.length} steps, ${recipe.extendedIngredients.length} ingredients</p>
                                ${dishTypeHtml}
                                ${wineHtml}
                                <p><a href="${recipe.sourceUrl}">Go to recipe</a></p>
                            </div>
                        </div>
                    `;
                    $('.recipe-results').append(recipeHtml);
                } // end of for loop
            })
            .fail(function(error) {
                alert('Sorry, no results found! Please try another search.');
            });
        }  // end of if-else @___@;;
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
        
        //// VVVVVV DOESN'T WORKKKKKKKKK <<<<<<<<<<<<<<<<<<<<<<<<
        // changing the heart icon on focus / making it work with tabbing
        // $('.food-search-container').focus(function(){
            //         $('.icon').removeClass('fa-heart');
            //         $('.icon').addClass('fa-utensils');
            //     })
            
            // // changing the heart icon to film on hover when searching movies
            // $('.genre-search-container').focus(function () {
    //         $('.icon').removeClass('fa-heart');
    //         $('.icon').addClass('fa-film');
    //     })

} // end of app.init()


$(function () {
    AOS.init(); // animate on scroll
    app.init();
});


