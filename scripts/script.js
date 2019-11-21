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

app.recipeKey = `37d5d0c2cce74758b4307f9f5c729c0d`;
app.recipeUrl = `https://api.spoonacular.com/recipes/search`; // general search

app.usersGenreChoice;

app.usersFoodChoice;


// 4. function to get information //
app.getMovies = function(query) { 
    $.ajax({
        url: app.movieUrl,
        method: 'GET',
        dataType: 'json',
        data: {
            api_key: app.movieKey,
            with_genres: query,
            include_adult: false
            }
        }).then(function(result) {
            
            console.log(result);
        }).fail( (error) => {
            console.log(error)
        })
};

app.getRecipes = function(query) {
    $.ajax({ 
        url: app.recipeUrl, 
        method: 'GET', 
        dataType: 'json', 
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            apiKey: app.recipeKey,
            query: query,
            number: 4
        }
    }).then(function(result) {
        console.log(result);
    }).fail(function(error) {
        console.log(error);
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
    app.usersGenreChoice = $('#genreSearch').val();
    console.log(app.usersGenreChoice);
    app.usersFoodChoice = $('#foodSearch').val();
    console.log(app.usersFoodChoice);
    app.getMovies(app.usersGenreChoice);
    app.getRecipes(app.usersFoodChoice);
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



