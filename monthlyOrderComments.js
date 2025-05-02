var app = angular.module("MainApp");
app.controller("orderManagerMonthlyOrderComments", function ($scope, $rootScope, unitOfWork, $location, $route, $window) {
    function init() {
        $scope.importWaggonId = $route.current.params.importWaggonId;
        $scope.orderId = $route.current.params.orderId;
        $scope.userName = $route.current.params.userName;
        unitOfWork.MonthlyOrders.complexGet(["Comments", $scope.orderId]).success(function (data) {
            $scope.items = data;
        });
        unitOfWork.MonthlyOrders.complexGet(["GetOrder", $scope.orderId]).success(function (data) {
            $scope.order = data;
        });
        $rootScope.spinnerIsNotVisible = true;
        $scope.model = { WaggonOrderId: $scope.orderId, Comment: "" };
    }
    $scope.return = function () {
        $window.history.back();
    };
    $scope.send = function () {
        unitOfWork.MonthlyOrders.complexPost(["Comment"], $scope.model).success(init);
    };
    init();
});