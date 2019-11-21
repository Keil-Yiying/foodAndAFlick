// html page needs to have 2 search inputs, one for movie genres and one for main ingredient
	// inputs may be dropdown menus due to the way the APIs are structured
// user chooses genre and ingredient and presses submit button
	// save the user's choices to variables, which will be passed to the API calls as search parameters
// Two API calls to (1) movie API using genre and (2) to recipe API using ingredient
	// use .when() to wait for both calls to return the data
// API returns 5~10 results for each (number might depend on app design)
// append results on html page with images (maybe 4-6 for each)

// 2. set up main param //
const app = {};

app.movieKey = '38f9a8f5c677f0356adca226f357b762';
app.movieUrl = `https://api.themoviedb.org/3/discover/movie`;
app.movieImgUrl = `https://image.tmdb.org/t/p/w500`;

app.recipeKey = `37d5d0c2cce74758b4307f9f5c729c0d`;
app.recipeUrl = `https://api.spoonacular.com/recipes/search`; // general search
app.recipeUrl2 = `https://api.spoonacular.com/recipes/random`; //random

// app.usersGenreChoice;

// app.usersFoodChoice;


// 4. function to get information //
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
        url: app.recipeUrl2, 
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


// passing in the genre ID


// app.getMovies('28');

// app.getRecipes('casserole');


// 5. Function to display movie array // LINE 27 is narrowing it down to one result //
// movieApp.displayMovieArray = function(movieResultArray) {
    //     console.log('display array', movieResultArray.genres);
    // };
    
    // // 3. creat init to start the app //
    // movieApp.init = function() {
        //     console.log('test1');
        //     movieApp.getMovieInformation();
        // }
        
        
        
$('form').on('submit', function (e) {
    e.preventDefault();
    app.usersGenreChoice = parseInt($('#genre-search').val());
    console.log(app.usersGenreChoice);

    app.usersFoodChoice = $('#food-search').val();
    console.log(app.usersFoodChoice);

    // app.getMovies(app.usersGenreChoice);
    // app.getRecipes(app.usersFoodChoice);

    $.when(app.getMovies(app.usersGenreChoice), app.getRecipes(app.usersFoodChoice))
        .then(function(movieChoices, recipeChoices) {
            console.log(movieChoices[0], recipeChoices[0]);




            $('.movie-results').empty();
            for (let i = 0; i < 4; i++) {
                $('.movie-results').append(`
                <p>${movieChoices[0].results[i].title}</p>
                <p>${movieChoices[0].results[i].overview}</p>
                <p><img src="${app.movieImgUrl}${movieChoices[0].results[i].poster_path}"> This is movieUrl, poster_path</p>
            `);
            }

            $('.recipe-results').empty();
            for (let i = 0; i < 4; i++) {
            $('.recipe-results').append(`
                <p>${recipeChoices[0].recipes[i].title}</p>
                <p><img src="${recipeChoices[0].recipes[i].image}"></p>
                <p><a href="${recipeChoices[0].recipes[i].sourceUrl}">Go to recipe</p>
            `);
            }

        })
        .fail(function(error) {
            console.log(error);
        });
})
        
        



// 1. doc ready //
$(function () {
    console.log('doc ready');
    // movieApp.init();
})


// for (let i = 0; i < displayMovieArray.length; i++) {
// }

// const genres = ["Horror", "Comedy", "Drama", "Action", "Suspense", "Documentary"];

// genres.forEach((genre) => {
//     $(".movieGenres").append("<p>" + genre + "</p>");
// });



