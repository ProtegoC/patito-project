var app = angular.module("MainApp");
app.controller("selectExtraWaggonToImport", function($scope, unitOfWork, $location,$route,$filter) {
    function init() {
        $scope.waggonOrderId = $route.current.params.waggonOrderId;
        $scope.orderId = $route.current.params.orderId;
        unitOfWork.WaggonOrders.complexGet(["ImportOptions",$scope.waggonOrderId]).success(function (data) {
            $scope.items = data;
        });
        unitOfWork.WaggonOrders.complexGet(["Details", $scope.orderId]).success(function (data) {
            $scope.all = $filter("filter")(data, function (item) {
                return item.Status !== "4";
            }).length;
            $scope.completed = $filter("filter")(data, function (item) {
                return item.Status === "3";
            }).length;
            $scope.invoiced = $filter("filter")(data, function (item) {
                return item.InvoiceStatus.toUpperCase() === "FACTURADO" || item.InvoiceStatus.toUpperCase() === "EN PROCESO";
            }).length;
            $scope.diference = $scope.all - $scope.completed;
            $scope.completed = $scope.completed - $scope.invoiced;
        });
    }

    $scope.import = function(item) {
        $location.path("/"+["fillExtraWaggon",$scope.orderId,$scope.waggonOrderId,item.Id].join("/"));
    };
    $scope.getStatus = function (item) {
        switch (item.Status) {
            case "1":
                return "Rest";
            case "2":
                return "Incomplete";
            case "3":
                return "Completed";
            case "4":
                return "Deleted";
            default:
                return "";
        }
    };

    init();
});