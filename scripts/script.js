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

// SET DEFAULT FOR DROPDOWN??? RESETIING WITH .val('') just empties it
// ALSO STYLE IT!!!!!!!!!!

// SMALLEST MEDIA QUERY - PLUS LINKS FOR MOVIES & RESULTS IF ALL IN ONE LIST

// BIGGEST (DEFAULT) SIZE- MAYBE IMAGES SHOULD BE TO THE LEFT


// NEED AN ERROR CHECK IF USER DOES NOT SELECT ANYTHING FOR ONE OR BOTH INPUTS!!!!!!! - OR, if one doesn't return anything
    // so far I used an alert but 

// weird error-handling thing:
    // no dish type = empty array, using == false works to catch it
    // no wine pairing = empty obje, using == false gives an undefined error, but using == undefined works. (should I use === undefined?)


// NEED A BUTTON UNDER RESULTS IF USER WANTS TO SEARCH AGAIN (take back to top) - MAKE THE BUTTON WORK

// ALSO NEED TO STYLE LINKS & LITERALLY EVERYTHING ELSE
    // find a nice bg image for styling



app.init = function() {    
    
    /*
        EVENT HANDLERS
    */
    $('form').on('submit', function (e) {
        e.preventDefault();
        app.usersFoodChoice = $('#food-search').val();
        app.usersGenreChoice = parseInt($('#genre-search').val());
        
        /* 
            using Math.random() to add some randomization to the movie results that show up, otherwise they will always return the top 4 of that genre listed on the API 
        */
        const moviePage = Math.ceil(Math.random() * 100);


        /*
            Getting the current date so the API won't return unreleased movies
        */
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate() + 1;
        const releaseDate = `${year}-${month}-${day}`;

        $('#food-search').val(''); // clearing inputs after submit
        $('#genre-search').val(28);

        // using Promises to wait for both movie & recipe API calls
        $.when(app.getMovies(app.usersGenreChoice, moviePage, releaseDate), app.getRecipes(app.usersFoodChoice))
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

                    const movieBlurb = movie.overview.slice(0, 251);
                    console.log(movieBlurb);

                    const movieHtml = `
                        <div class="movie-card">
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
                }
                
                // printing recipes to page
                $('.recipe-results').empty();
                for (let i = 0; i < 4; i++) {
                    const recipe = recipeChoices[0].recipes[i];
                    console.log(recipe); // REMOVE
                    console.log(recipe.dishTypes); // REMOVE~!!!!!
                    
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
                    if (winePairingList == undefined) {
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
                        <div class="recipe-card">
                            <div class="recipe-img">
                                <img src="${recipe.image}" alt="${recipe.title}">
                            </div>
                            <div class="card-text">
                                <p class="card-title">${recipe.title}</p>
                                <p>Ready in ${recipe.readyInMinutes} minutes</p>
                                <p>Number of steps: ${recipe.analyzedInstructions[0].steps.length}</p>
                                <p>Number of ingredients: ${recipe.extendedIngredients.length}</p>
                                ${dishTypeHtml}
                                ${wineHtml}
                                <p><a href="${recipe.sourceUrl}">Go to recipe</a></p>
                            </div>
                        </div>
                    `;
                    $('.recipe-results').append(recipeHtml);
                }
            })
            .fail(function(error) {
                alert('Sorry, no results found! Please try another search.');
            });
    })


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

}


$(function () {
    app.init();
});


