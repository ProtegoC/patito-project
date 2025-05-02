var app = angular.module("MainApp");
app.controller("monthlyOrderProductsDetail", function($scope,$window,unitOfWork,$location,$route, $modal, $rootScope) {
    function init() {
        $scope.orderId = $route.current.params.orderId;
        unitOfWork.MonthlyOrders.complexGet(["OrderProducts",$scope.orderId]).success(function(data) {
            $scope.items = data;
        });
        unitOfWork.MonthlyOrders.complexGet(["GetOrder", $scope.orderId]).success(function (data) {
            $scope.order = data;
            var currentDate = new Date();
            var orderDate = new Date(data.FechaPedido);
        });
        unitOfWork.MonthlyOrders.complexGet(["Comments", $scope.orderId]).success(function (data) {
            $scope.comments = data;
        });
        unitOfWork.MonthlyOrders.complexGet(["CanEdit", $scope.orderId]).success(function (data) {
            $scope.canEdit = data;
        });
    }
    $scope.closeConfirm = function () {
        $scope.modalInstance.close();
    }
    $scope.delete = function () {
        $scope.modalInstance.close();
        unitOfWork.MonthlyOrders.delete($scope.orderId).success(function () {
            $location.path("/monthlyOrders");
        });
    }
    $scope.confirmDelete = function () {
        $rootScope.spinnerIsNotVisible = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "App/Views/modal/confirmDelete.html",
            size: "lg",
            scope: $scope
        });
    };
    $scope.print = function() {
        $window.print();
    };
    $scope.isExtraOrder = function () {
        return localStorage.extraOrder == "true";
    }
    init();
});