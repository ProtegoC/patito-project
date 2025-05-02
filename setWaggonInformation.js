var app = angular.module("MainApp");
app.controller("setExtraWaggonInformation", function($scope,unitOfWork,$location,$route,$filter,$rootScope,$modal) {
    function contain(elements,item) {
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element.Type === item.Type && item.Size === element.Size)return true;
        }
        return false;
    }
    function init() {
        $scope.$watch(function() {
            return $scope.query;
        }, function (value) {
            if (!value) {
                $scope.model.TransportId = null;
                return;
            }
           var values= $filter("filter")($scope.items, function(data) {
                return data.Type === value.Type && data.Size === value.Size;
            });
            $scope.model.TransportId = values[0].IdTransport;
        });
        //Si esta en falso pedirá confirmación para eliminar
        $scope.deleteIsConfirm = false;
        $scope.waggonOrderId = $route.current.params.waggonOrderId;
        $scope.orderId = $route.current.params.orderId;
        unitOfWork.WaggonOrders.complexGet(["Transport"]).success(function(data) {
            $scope.items = data;
            $scope.dataFilters = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                item.Type = item.Type.toUpperCase();
                if (!contain($scope.dataFilters, item)) {
                    $scope.dataFilters.push({ Type: item.Type, Size: item.Size });
                }
            }
        });
        unitOfWork.WaggonOrders.complexGet(["WaggonHeader", $scope.waggonOrderId]).success(function (data) {
            $scope.model = data;
            var currentDate = new Date();
            $scope.model.ShipmentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            //$scope.model.ShipmentDate.setDate(1);
            //$scope.model.ShipmentDate = moment($scope.model.ShipmentDate).add(1,"months").subtract(1,"days").toDate();
            $scope.minDate = currentDate;
            $scope.maxDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        });
        //unitOfWork.WaggonOrders.complexGet(["HasMannyClients"]).success(function(data) {
        //    $scope.hasMannyClients = data;
        //});
        unitOfWork.MonthlyOrders.complexGet(["ClientTypes"]).success(function (response) {
            $scope.hasMannyClients = response.length > 1;
            $scope.types = response;
            //unitOfWork.MonthlyOrders.complexGet(["IsOwnClient"]).success(function (isOwn) {
            if ($scope.types.length == 1) {
                //$scope.model.IsOwnClient = $scope.types.propio;
                $scope.model.clientType = $scope.types[0].code;
            }
        });
    }
    $scope.disabled = function (date) {
        var year = date.getYear();
        var month = date.getMonth();
        var otherYear = moment($scope.model.OrderDate).toDate().getYear();
        var otherMonth = moment($scope.model.OrderDate).toDate().getMonth();

        return year !== otherYear
            || month !== otherMonth;
    };
    $scope.model = {};

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };
    $scope.save = function () {
        $scope.model.IsOwnClient = $scope.model.IsOwnClient != 'true' ? false : true;
        $scope.model.WaggonHeaderId = $scope.waggonOrderId;
        unitOfWork.WaggonOrders.complexPost(["SetHeader"], $scope.model).success(function(response) {
            if (response) {
                $location.path("/fillExtraWaggon/" + $scope.orderId + "/" + $scope.waggonOrderId);
            }
        });
    };
    $scope.cancel = function() {
        $location.path("/waggonExtraOrderDetails");
    };
    $scope.delete = function () {
        if ($scope.deleteIsConfirm) {
            $scope.deleteIsConfirm = false;
            unitOfWork.WaggonOrders.complexDelete(["DeleteWaggon", $scope.waggonOrderId]).success(function (data) {
                if (data)
                    $location.path("/waggonExtraOrderDetails");
            });
            $scope.modalInstance.close();
        }
        else {
            confirmDelete();
        }
    };
    $scope.closeConfirm = function () {
        $scope.deleteIsConfirm = false;
        $scope.modalInstance.close();
    }
    var confirmDelete = function () {
        $scope.deleteIsConfirm = true;
        $rootScope.spinnerIsNotVisible = true;
        $scope.modalInstance = $modal.open({
            templateUrl: "App/Views/modal/confirmDelete.html",
            size: "lg",
            scope: $scope
        });
    };
    init();
});