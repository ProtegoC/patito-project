var app = angular.module('MainApp');
app.controller("claimSearch", function ($scope, unitOfWork, $location, $rootScope) {
    $scope.clientes = [];
    /**
     * Este controlador se utiliza en newers e index de la carpeta Claims
     */
    function init() {
        $scope.model = {};
        if ($rootScope.seachClaimRequest) {
            $scope.model = $rootScope.seachClaimRequest;
            $scope.search();
        }
        $scope.top = 10;
        
        unitOfWork.Claims.complexGet(['getNewers']).success(function (data) {
            $scope.news = data;
        });
    }

    $scope.search = function () {
        $rootScope.seachClaimRequest = $scope.model;
        unitOfWork.Claims.complexPost(['search'], $scope.model).success(function (data) {
            $scope.items = data;
        });
    }
    $scope.goToNews = function ()
    {
        $location.path("claim/newers");
       
    }

    $scope.goToIndex = function () {
        $location.path("claims");
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