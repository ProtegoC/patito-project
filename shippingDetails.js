var app = angular.module("MainApp");
app.controller("shippingDetails", function ($scope, unitOfWork, $location, $route, $modal, $rootScope, $filter) {
    $scope.orderId = $route.current.params.orderId;
    function init() {
        unitOfWork.MonthlyOrders.complexGet(["MonthlyWaggonDetails", $scope.orderId]).success(function (data) {
            $scope.items = $filter("filter")(data, function (item) {
                return item.Status == "3";
            });
        });
    }

    $scope.back = function () {
        $location.path("/monthlyOrderProductDetails/" + $route.current.params.orderId);
    };
    
    init();

    unitOfWork.MonthlyOrders.complexGet(["GetOrder", $scope.orderId]).success(function (data) {
        $scope.order = data;
        var currentDate = new Date();
        var orderDate = new Date(data.FechaPedido);
    });

    $scope.navigateToDetails = function (item) {
        $location.path("/shippingDetails/" + $scope.orderId + "/" + item.Id);
        return;
    };

    $scope.back =  function()
    {
        $location.path("monthlyOrderProductDetails/" + $scope.orderId);
    }
});