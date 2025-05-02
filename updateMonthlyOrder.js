var app = angular.module("MainApp");
app.controller("updateMonthlyOrder", function($scope,unitOfWork,$location,$route,$filter, $window) {
    function init() {
        $scope.orderId = $route.current.params.orderId;
        $scope.model = {};
        /*unitOfWork.MonthlyOrders.complexGet(["HasMannyClients"]).success(function (data) {
            $scope.hasMannyClients = data;
        });*/
        unitOfWork.MonthlyOrders.complexGet(["GetOrder", $scope.orderId]).success(function(data) {
            $scope.order = data;
            var date = $scope.order.FechaPedido;
            if (date) {
                let d = new Date(date);
                d.setHours(0);
                $scope.model.Date = d;
                console.log("pedido:");
                console.log(date);
                console.log(d);
            }
            $scope.model.ClientCorrelative = $scope.order.NumeroPedido;
            $scope.model.WebCode = $scope.order.PedidoWeb;
            $scope.minDate = new Date(date.split('-')[0], date.split('-')[1] - 1, 1);
            $scope.maxDate = new Date(date.split('-')[0], date.split('-')[1], 0);
            if ($scope.minDate < new Date())
            {
                $scope.minDate = new Date();
            }
        });

    }

    $scope.cancel = function() {
        //$location.path("/monthlyOrders");
        $window.history.back();
    };
    //$scope.disableDate = function (date) {
    //    if (!$scope.monthsAvailability) return false;
    //    var data = $filter("filter")($scope.monthsAvailability, function (item) {
    //        var month = date.getMonth();
    //        var year = 1900 + date.getYear();
    //        return (month === (item.MonthCorrelative - 1)
    //            && year === item.Year
    //            && !($scope.model.IsOwnClient === undefined ? (item.Own || item.Maquila) : ($scope.model.IsOwnClient ? item.Own : item.Maquila)));
    //    });
    //    return data.length !== 0;
    //};
    $scope.save = function () {
        $scope.model.OrderId = $scope.orderId;
        unitOfWork.MonthlyOrders.complexPut(["Update"], $scope.model).success(function (data) {
            if (data)
                $location.path("/monthlyOrderDetails/"+$scope.orderId);
        });
    };
    init();
});