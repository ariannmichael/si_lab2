angular.module("overSeries").controller("overSeriesCtrl", function($scope, $http) {
    $scope.app = "overSeries";
    $scope.input;
    $scope.searchMade = [];
    $scope.watchlist = [];
    $scope.profile = [];

    $scope.searchInput = function () {
        if($scope.input === undefined || $scope.input.length === 0) {
            alert('Digite no campo de pesquisa');
        } else {
            var promise = $http.get("https://omdbapi.com/?s=" + $scope.input + "&type=series&apikey=93330d3c").then(function (response) {
                if(response.data.Response === "False") {
                    alert('Sua pesquisa não possui resposta');
                } else {
                    $scope.searchMade = response.data.Search;
                }
            }, function error (error) {
                console.log(error);
            });
            return promise;
        }
    };

    $scope.addProfile = function (serie) {
        if ($scope.contains($scope.profile, serie)) {
            alert('"' + serie.Title + '" já está no seu perfil')
        } else {
            var promise = $http.get("https://omdbapi.com/?i=" + serie.imdbID + "&plot=full&apikey=93330d3c").then(function(response) {
                serie = response.data;
                serie.myRating = "N/A"
                serie.lastEpisode = "N/A"
                $scope.profile.push(serie);
            }).catch(function(error){
                console.log(error);
            });
        }
    };

    $scope.removeProfile = function (serie) {
        if(confirm('Deseja remover "' + serie.Title + '" do seu catálogo?') === true) {
            var index = $scope.profile.indexOf(serie);
            $scope.profile.splice(index, 1);
        }
    }

    $scope.addWatchlist = function (serie) {
        if ($scope.contains($scope.watchlist, serie)) {
            alert('"' + serie.Title + '" já está na sua watchlist!')
        } else if ($scope.contains($scope.profile, serie)) {
            alert('"' + serie.Title + '" já está no seu perfil!')
        } else {
            $scope.watchlist.push(angular.copy(serie));
        }
    };

    $scope.removeWatchlistNoWarning = function (serie) {
        var index = $scope.watchlist.indexOf(serie);
        $scope.watchlist.splice(index, 1);
    };

    $scope.removeWatchlist = function (serie) {
        if (confirm('Deseja remover "' + serie.Title + '" da sua watchlist?') === true) {
            var index = $scope.watchlist.indexOf(serie);
            $scope.watchlist.splice(index, 1);
        }
    };

    $scope.contains = function (array, serie) {
        for (var i = 0; i < array.length; i++) {
            if(array[i].imdbID === serie.imdbID) {
                return true;
            }
        }
        return false;
    };

    $scope.sendRating = function (serie, rating) {
        serie.myRating = rating;
    };

    $scope.sendLastEpisode = function (serie, episode) {
        serie.lastEpisode = episode;
    };

    $('#search-button').on('click', function() {
        $('#search').prop('checked', true);
    });
});
