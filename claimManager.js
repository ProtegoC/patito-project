var app = angular.module('MainApp');
app.controller("claimManager", function ($scope, unitOfWork, $location, $rootScope) {
    $scope.clientes = [];
    /**
     * Este controlador se utiliza en newers e index de la carpeta Claims
     */
    function init() {
        $scope.top = 10;
        unitOfWork.Claims.complexGet(["clientes"]).success(function (response) {
            var data = [];
            var letras = [];
            $scope.y = 0;
            letras.push(response[0].Code.split('')[0].toUpperCase());
            data.push({ a: response[0].Code.split('')[0].toUpperCase(), reclamos: false });
            for (var i = 0; i < response.length; i++) {
                response[i].letra = response[i].Code.split('')[0].toUpperCase();

                if (letras.indexOf(response[i].letra) == -1) {
                    letras.push(response[i].letra)
                    data.push({ a: response[i].letra  , reclamos :false});
                }

                if (response[i].Claims != 0) {
                    response[i].reclamos = true;
                    $scope.y++;
                } else {
                    response[i].reclamos = false;
                }

                data.push(response[i]);
            }

            $scope.clientes = data;
            $scope.total = response.length;
        });
        unitOfWork.Claims.complexGet(['getNewers']).success(function (data) {
            $scope.news = data;
        });
    }

    $scope.goToNews = function ()
    {
        $location.path("claim/newers");
       
    }
    $scope.goToIndex = function () {
        $location.path("claims");
    }
    $scope.goToSearch = function () {
        $location.path("claim/search");
    }
    $scope.goToReport = function () {
        $location.path("claim/reportClaims");
    }
    $scope.goToClaim = function (item)
    {
        var url = "claims/claim/" + item.idUsuario + "/" + item.idReclamo + "/" + item.encargado;
        $location.path(url);
    }

    $scope.viewMore = function ()
    {
        if ($scope.news)
        $scope.top = $scope.news.length;
    }
    init();



});