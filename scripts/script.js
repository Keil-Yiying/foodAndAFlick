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
app.movieImgUrlBase = `https://image.tmdb.org/t/p/w500`;

app.recipeKey = `37d5d0c2cce74758b4307f9f5c729c0d`;
app.recipeUrl = `https://api.spoonacular.com/recipes/random`; 


app.getMovies = function(query) {
    return $.ajax({
        url: app.movieUrl,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: app.movieKey,
            with_genres: query,
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

// SHOULD WE ADD A LOADING CIRCLE CUZ THE AJAX CALLS TAKE A FEW SECONDS??????
        
        
$('form').on('submit', function (e) {
    e.preventDefault();
    app.usersGenreChoice = parseInt($('#genre-search').val());
    console.log(app.usersGenreChoice);  // remove later

    app.usersFoodChoice = $('#food-search').val();
    console.log(app.usersFoodChoice); // remove later

    $.when(app.getMovies(app.usersGenreChoice), app.getRecipes(app.usersFoodChoice))
        .then(function(movieChoices, recipeChoices) {
            console.log(movieChoices[0], recipeChoices[0]); // remove later

            // maybe set up variables for the results to make it more readable
                // const movie = movieChoices[0].results[i]
                // const recipe = recipeChoices[0].recipes[i]

            // adjust later based on html page
            $('.movie-results').empty();
            for (let i = 0; i < 4; i++) {
                $('.movie-results').append(`
                    <p>${movieChoices[0].results[i].title}</p>
                    <p>${movieChoices[0].results[i].release_date}</p>
                    <p>${movieChoices[0].results[i].original_language}</p>
                    <p>${movieChoices[0].results[i].overview}</p>
                    <p><img src="${app.movieImgUrlBase}${movieChoices[0].results[i].poster_path}" alt="Movie poster for ${movieChoices[0].results[i].title}"> This is movieUrl, poster_path</p>
                `);
            }

            // adjust later based on html page
            $('.recipe-results').empty();
            for (let i = 0; i < 4; i++) {
            $('.recipe-results').append(`
                    <p>${recipeChoices[0].recipes[i].title}</p>
                    <p><img src="${recipeChoices[0].recipes[i].image}" alt="${recipeChoices[0].recipes[i].title}"></p>
                    <p>Ready in ${recipeChoices[0].recipes[i].readyInMinutes}</p>
                    <p>Prep minutes ${recipeChoices[0].recipes[i].preparationMinutes}</p>
                    <p>Cooking minutes ${recipeChoices[0].recipes[i].cookingMinutes}</p>
                    <p>Wine Pairings: ${recipeChoices[0].recipes[i].winePairing.pairedWines} << this is an array (need to loop through to print on page)</p>
                    <p><a href="${recipeChoices[0].recipes[i].sourceUrl}">Go to recipe</p>
                `);
            }
        })
        .fail(function(error) {
            console.log(error);   // what to do about this??
        });
})
        
        
// NEED INIT
    // should contain event handlers


// 1. doc ready //
$(function () {
    console.log('doc ready');
    // movieApp.init();
})
