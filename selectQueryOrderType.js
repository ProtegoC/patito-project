var app = angular.module("MainApp");
app.controller("selectQueryOrderType", function($scope,unitOfWork,$location,$route) {
    $scope.navigateToWaggonOrders = function () {
        $location.path("/waggonOrdersQuery");
    };
    $scope.navigateToMonthlyOrders = function () {
        $location.path("/monthlyOrdersQuery");
    };
});