var app = angular.module('MainApp');
app.controller("claimTraking", function ($route, $scope, unitOfWork, $rootScope, $location) {
    function init() {
        $scope.model = {};
    }

    $scope.search = function () {
        unitOfWork.Claims.complexPost(["ClaimsByDate"], $scope.model).success(function (x) {
            $scope.reclamos = x;
        });
    };

    $scope.viewDetails = function (item)
    {
        $rootScope.userDetailClaimRequest = {
            start: $scope.model.desde,
            end: $scope.model.hasta
        }

        $location.path('/claims/userDetail/' + item.idUsuario + '/' + item.usuario);
    }

    init();
});