var app = angular.module("MainApp");
app.controller("orderManagerMonthlyDetails", function ($scope, unitOfWork, $location, $route, $modal, $rootScope) {
    function init() {
        $scope.orderId = $route.current.params.orderId;
        $scope.userName = $route.current.params.userName;
        unitOfWork.Billers.complexGet(["MonthlyOrderProducts", $scope.orderId]).success(function (data) {
            $scope.items = data;
        });
        unitOfWork.Billers.complexGet(["GetMonthlyOrder", $scope.orderId]).success(function (data) {
            $scope.order = data;
            var currentDate = new Date();
            var orderDate = new Date(data.FechaPedido);
        });
        unitOfWork.Billers.complexGet(["MonthlyComments", $scope.orderId]).success(function (data) {
            $scope.comments = data;
        });
        //unitOfWork.MonthlyOrders.complexGet(["CanEdit", $scope.orderId]).success(function (data) {
        //    $scope.canEdit = data;
        //});
    }
    $scope.navigateToCreateWaggon = function () {
        $location.path("/orderManteinance/monthlyWaggons/" + $route.current.params.userName + "/" + $route.current.params.orderId);
    }

    $scope.back = function () {
        $location.path("/orderManteinance/result");
    }
    init();
});