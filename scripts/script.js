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
            
            
            
            // adjust later based on html page
            $('.movie-results').empty();
            for (let i = 0; i < 4; i++) {
                const movie = movieChoices[0].results[i];
                const movieHtml = `
                    <div class="movie-card">
                        <div class="movie-img">
                            <img src="${app.movieImgUrlBase}${movie.poster_path}" alt="Movie poster for ${movie.title}">
                        </div>
                        <div class="card-text">
                            <p class="card-title">${movie.title} <span class="movie-year">${movie.release_date}</span></p>
                            <p>${movie.overview}</p>                          
                        </div>
                    </div>
                `;
                $('.movie-results').append(movieHtml);
            }
            
            // adjust later based on html page
            $('.recipe-results').empty();
            for (let i = 0; i < 4; i++) {
                const recipe = recipeChoices[0].recipes[i];
                console.log(recipe);
                console.log(recipe.winePairing.pairedWines);
                
                /* 
                    Getting wine pairings for each recipe, if available.
                */
                const winePairingList = recipe.winePairing.pairedWines;
                let wineHtml = `<p>Wine Pairings: `;
                if (winePairingList === undefined) {
                    wineHtml = '';
                } else {
                    for (let i = 0; i < winePairingList.length; i++ ) {
                        if (i === (winePairingList.length - 1)) {
                            wineHtml += `${winePairingList[i]}. </p>`;
                            console.log(wineHtml);
                        } else {
                            wineHtml += `${winePairingList[i]}, `;
                            console.log(wineHtml);
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
                            ${wineHtml}
                            <p><a href="${recipe.sourceUrl}">Go to recipe</a></p>
                        </div>
                    </div>
                `;
                $('.recipe-results').append(recipeHtml);
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

        // $('icons').hover(function () {
        //     $(this).find('noColor').stop().animate({ 'opacity': 0 }, 300);
        // }, function () {
        //     $(this).find('color').stop().animate({ 'opacity': 1 }, 300);
        // });

        $('.food-search-container').hover(
            function(){
                $('i').removeClass('fa-heart')
                $('i').addClass('fa-utensils')
            },
            function(){
                $('i').removeClass('fa-utensils')
                $('i').addClass('fa-heart')
            })

    $('.genre-search-container').hover(
        function () {
            $('i').removeClass('fa-heart')
            $('i').addClass('fa-film')
        },
        function () {
            $('i').removeClass('fa-film')
            $('i').addClass('fa-heart')
        })






    });


