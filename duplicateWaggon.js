var app = angular.module("MainApp");
app.controller("DuplicateExtraWaggon", function ($scope, unitOfWork, $location, $filter, $route) {
    $scope.orderId = $route.current.params.orderId;
    $scope.waggonOrderId = $route.current.params.waggonOrderId;
    /*unitOfWork.WaggonOrders.complexGet(["CompletedDetails", $scope.orderId]).success(function (data) {
        $scope.items = data;
    });*/
    $scope.back = function () {
        $location.path("/waggonExtraOrderDetails");
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

    function init() {
        unitOfWork.ExtraOrders.getAll($scope, "items").success(function () {
            var data = $scope.items;
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
            /*$scope.all = $filter("filter")(data, function (item) {
                return item.Status !== "4";
            }).length;
            $scope.completed = $filter("filter")(data, function (item) {
                return item.Status === "3";
            }).length;
            $scope.invoiced = $filter("filter")(data, function (item) {
                return item.InvoiceStatus.toUpperCase() === "FACTURADO" || item.InvoiceStatus.toUpperCase() === "EN PROCESO";
            }).length;
            $scope.diference = $scope.all - $scope.completed;
            $scope.completed = $scope.completed - $scope.invoiced;*/
        });
        //If the view is in set information
        if ($scope.waggonOrderId) {
            unitOfWork.WaggonOrders.complexGet(["WaggonHeader", $scope.waggonOrderId]).success(function (data) {
                $scope.item = data;
            });
            $scope.model = {
                WaggonHeaderId: $scope.waggonOrderId,
                Qty: 0
            };
        }
    }

    $scope.duplicate = function() {
        unitOfWork.ExtraOrders.complexPost(["Duplicate"],$scope.model).success(function(data) {
            if(data)
                $location.path("/waggonExtraOrderDetails");

        });
    };
    $scope.navigateToDuplicateDetails = function (item) {
        if(item.Status == 3)
        $location.path("/duplicateExtraWaggon/" + $scope.orderId + "/" + item.Id);
    };
    $scope.navigateToDuplicate = function () {
        $location.path("/duplicateExtraWaggon/" + $scope.orderId );
    };
    init();
});