var app = angular.module("MainApp");
app.controller("orderManagerAddWaggon", function ($scope, unitOfWork, $location, $route, $modal, $rootScope) {
    $scope.userName = $route.current.params.userName;
    $scope.orderId = $route.current.params.orderId;
    $scope.model = {
        OrderId: $scope.orderId
    };
    function init() {
        $scope.orderId = $route.current.params.orderId;
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
    $scope.addWaggonsToOrder = function () {
        unitOfWork.Billers.complexPost(["AddWaggonsToMonthlyOrder"], $scope.model).success(function (data) {
            $location.path("/orderManteinance/monthlyWaggons/" + $scope.userName + "/" + $scope.orderId);
        });
    };
    $scope.back = function () {
        $location.path("/orderManteinance/monthlyDetails/" + $scope.userName + "/" + $scope.orderId);
    };
    init();
});