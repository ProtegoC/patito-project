var app = angular.module("MainApp");
app.controller("AddExtraWaggonToOrder", function($scope,unitOfWork,$route,$location,$filter) {
    $scope.model = {};
    $scope.model.OrderId = $route.current.params.orderId;
    function init() {
        unitOfWork.WaggonOrders.complexGet(["Details", $scope.model.OrderId]).success(function (data) {
            data = $scope.deleted = $filter("filter")(data, function (item) {
                return item.WebCode.indexOf("-E") !== -1;
            });
            $scope.items = data;
            $scope.deleted = $filter("filter")(data, function (item) {
                return item.Status == "4";
            }).length;
            $scope.allOwn = $filter("filter")(data, function (item) {
                return item.IsOwnClient && item.Status !== "4";
            }).length;
            $scope.allMaquila = $filter("filter")(data, function (item) {
                return (!item.IsOwnClient) && item.Status !== "4";
            }).length;
            $scope.all = $scope.allOwn + $scope.allMaquila;

            $scope.completedOwn = $filter("filter")(data, function (item) {
                return item.IsOwnClient && item.Status === "3";
            }).length;
            $scope.completedMaquila = $filter("filter")(data, function (item) {
                return (!item.IsOwnClient) && item.Status === "3";
            }).length;
            $scope.completed = $scope.completedOwn + $scope.completedMaquila;

            $scope.invoicedOwn = $filter("filter")(data, function (item) {
                return item.IsOwnClient && (item.InvoiceStatus.toUpperCase() === "FACTURADO" || item.InvoiceStatus.toUpperCase() === "EN PROCESO");
            }).length;
            $scope.invoicedMaquila = $filter("filter")(data, function (item) {
                return (!item.IsOwnClient) && (item.InvoiceStatus.toUpperCase() === "FACTURADO" || item.InvoiceStatus.toUpperCase() === "EN PROCESO");
            }).length;
            $scope.invoiced = $scope.invoicedOwn + $scope.invoicedMaquila;

            $scope.diferenceOwn = $scope.allOwn - $scope.completedOwn;
            $scope.diferenceMaquila = $scope.allMaquila - $scope.completedMaquila;
            $scope.diference = $scope.diferenceOwn + $scope.diferenceMaquila;
            $scope.completed = $scope.completed - $scope.invoiced;
            $scope.all = $scope.completed + $scope.invoiced;
            $scope.allOwn = $scope.completedOwn + $scope.invoicedOwn;
            $scope.allMaquila = $scope.completedMaquila + $scope.invoicedMaquila;
        });

        unitOfWork.WaggonOrders.complexGet(["CanEdit", $scope.model.OrderId]).success(function (data) {
            $scope.canEdit = data;
        });
    }

    init();
    $scope.addWaggonsToOrder = function() {
        unitOfWork.ExtraOrders.create($scope.model).success(function (data) {
            $scope.back();
        });
    };
    $scope.back = function() {
        $location.path("/waggonExtraOrderDetails");
    };
});