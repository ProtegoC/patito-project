var app = angular.module("MainApp");
app.controller("extraOrder", function($scope,unitOfWork,$location,$route) {
    function init() {
        unitOfWork.Permissions.complexGet(["AllowExtraOrder"]).success(function(data) {
            $scope.hasPermission = data;
        });
    }
    $scope.navigateToWaggonOrders = function () {
        $location.path("/waggonExtraOrderDetails");
    }
    $scope.navigateToMonthlyOrders = function () {
        $location.path("/monthlyExtraOrders");
    }
    init();
});