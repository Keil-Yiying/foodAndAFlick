// 2. set up main param //
const movieApp = {
    key: '38f9a8f5c677f0356adca226f357b762'
};

// 4. function to get information //
movieApp.getMovieInformation = function() {
    console.log('test2 - call api')

$.ajax({
    url: 'https://api.themoviedb.org/3/genre/movie/list',
    method: 'GET',
    dataType: 'json',
    data: {
        api_key: movieApp.key,
        },
    }).then(function(result) {
        // console.log('results', result);
        // display results here //
        movieApp.displayMovieArray(result);
    });
};


// 5. Function to display movie array // LINE 27 is narrowing it down to one result //
movieApp.displayMovieArray = function(movieResultArray) {
    console.log('display array', movieResultArray.genres);
};

// 3. creat init to start the app //
movieApp.init = function() {
    console.log('test1');
    movieApp.getMovieInformation();
}


// 1. doc ready //
$(function () {
    console.log('doc ready');
    movieApp.init();
})


// for (let i = 0; i < displayMovieArray.length; i++) {
// }


// const genres = ["Horror", "Comedy", "Drama", "Action", "Suspense", "Documentary"];


// genres.forEach((genre) => {
//     $(".movieGenres").append("<p>" + genre + "</p>");
// });



