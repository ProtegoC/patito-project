(function () {
    var app = angular.module('MainApp');
    app.run(function (amMoment, $rootScope) {


    });
    app.controller('WaggonExtraOrders', function ($scope, unitOfWork, $rootScope, $route, $location, amMoment) {
        $scope.model = {};
        $scope.navigateBack = function () {
            $location.url("/waggonExtraOrderDetails");
        };
        unitOfWork.Permissions.complexGet(["AllowExtraOrder"]).success(function (data) {
            $scope.hasPermission = data;
        });
        //Create
        $scope.save = function () {
            unitOfWork.ExtraOrders.create($scope.model).success(function (result) {
                if (result !== 0)
                    $location.url("/waggonExtraOrderDetails");
            });
        };
    });
})();
